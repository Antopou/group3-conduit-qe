import cors from 'cors';
import * as bodyParser from 'body-parser';
import express from 'express';
import request from 'supertest';
import routes from '../app/routes/routes';
import HttpException from '../app/models/http-exception.model';
import * as authService from '../app/routes/auth/auth.service';
import * as articleService from '../app/routes/article/article.service';

jest.mock('../app/routes/auth/auth.service');
jest.mock('../app/routes/article/article.service');
jest.mock('../app/routes/auth/auth', () => ({
  __esModule: true,
  default: {
    required: (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.headers.authorization) {
        const err = new Error('UnauthorizedError');
        err.name = 'UnauthorizedError';
        return next(err);
      }

      (req as any).auth = { user: { id: 123 } };
      return next();
    },
    optional: (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.headers.authorization) {
        (req as any).auth = { user: { id: 123 } };
      }
      return next();
    },
  },
}));

const mockedAuthService = jest.mocked(authService);
const mockedArticleService = jest.mocked(articleService);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.use(
  (
    err: Error | HttpException,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err && err.name === 'UnauthorizedError') {
      return res.status(401).json({
        status: 'error',
        message: 'missing authorization credentials',
      });
    } else if (err && 'errorCode' in err) {
      return res.status((err as HttpException).errorCode).json((err as HttpException).message);
    } else if (err) {
      return res.status(500).json(err.message);
    }

    return next();
  },
);

describe('Users and Articles API checklist tests', () => {
  const authToken = 'test-token';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('UT-001 Register with valid data (Happy Path)', async () => {
    mockedAuthService.createUser.mockResolvedValue({
      id: 123,
      username: 'user1',
      email: 'user1@example.com',
      bio: null,
      image: null,
      token: 'token-1',
    });

    const response = await request(app).post('/api/users').send({
      user: {
        username: 'user1',
        email: 'user1@example.com',
        password: 'Password123!',
      },
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('token');
  });

  test('UT-002 Register with duplicate email (Sad Path)', async () => {
    mockedAuthService.createUser.mockRejectedValue(
      new HttpException(422, { errors: { email: ['has already been taken'] } }),
    );

    const response = await request(app).post('/api/users').send({
      user: {
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'Password123!',
      },
    });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveProperty('email');
  });

  test('UT-003 Login with correct credentials (Happy Path)', async () => {
    mockedAuthService.login.mockResolvedValue({
      username: 'user1',
      email: 'user1@example.com',
      bio: null,
      image: null,
      token: 'token-1',
    });

    const response = await request(app).post('/api/users/login').send({
      user: {
        email: 'user1@example.com',
        password: 'Password123!',
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('token');
  });

  test('UT-004 Login with wrong password (Sad Path)', async () => {
    mockedAuthService.login.mockRejectedValue(
      new HttpException(403, { errors: { 'email or password': ['is invalid'] } }),
    );

    const response = await request(app).post('/api/users/login').send({
      user: {
        email: 'user1@example.com',
        password: 'wrong-password',
      },
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('errors');
  });

  test('UT-005 Login with missing email (Sad Path)', async () => {
    mockedAuthService.login.mockRejectedValue(
      new HttpException(422, { errors: { email: ["can't be blank"] } }),
    );

    const response = await request(app).post('/api/users/login').send({
      user: {
        password: 'Password123!',
      },
    });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ errors: { email: ["can't be blank"] } });
  });

  test('UT-006 Create article with valid data (Happy Path)', async () => {
    mockedArticleService.createArticle.mockResolvedValue({
      slug: 'my-article-123',
      title: 'My article',
      description: 'desc',
      body: 'body',
      tagList: ['testing'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorited: false,
      favoritesCount: 0,
      author: { username: 'user1', bio: null, image: null, following: false },
    } as any);

    const response = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        article: {
          title: 'My article',
          description: 'desc',
          body: 'body',
          tagList: ['testing'],
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.article).toHaveProperty('slug');
  });

  test('UT-007 Create article without title (Sad Path)', async () => {
    mockedArticleService.createArticle.mockRejectedValue(
      new HttpException(422, { errors: { title: ["can't be blank"] } }),
    );

    const response = await request(app)
      .post('/api/articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        article: {
          description: 'desc',
          body: 'body',
          tagList: ['testing'],
        },
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ errors: { title: ["can't be blank"] } });
  });

  test('UT-008 Create article without auth token (Sad Path)', async () => {
    const response = await request(app).post('/api/articles').send({
      article: {
        title: 'My article',
        description: 'desc',
        body: 'body',
      },
    });

    expect(response.status).toBe(401);
    expect(mockedArticleService.createArticle).not.toHaveBeenCalled();
  });

  test('UT-009 Get all articles (Happy Path)', async () => {
    mockedArticleService.getArticles.mockResolvedValue({
      articles: [
        {
          slug: 'article-1',
          title: 'Article 1',
          description: 'desc',
          body: 'body',
          tagList: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          favorited: false,
          favoritesCount: 0,
          author: { username: 'user1', bio: null, image: null, following: false },
        },
      ],
      articlesCount: 1,
    } as any);

    const response = await request(app).get('/api/articles');

    expect(response.status).toBe(200);
    expect(response.body.articlesCount).toBe(1);
    expect(Array.isArray(response.body.articles)).toBe(true);
  });

  test('UT-010 Delete article with valid auth (Happy Path)', async () => {
    mockedArticleService.deleteArticle.mockResolvedValue(undefined);

    const response = await request(app)
      .delete('/api/articles/my-article-123')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);
  });
});