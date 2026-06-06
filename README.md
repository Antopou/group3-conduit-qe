# 🧪 Group 3 — Conduit RealWorld Blog App
## Software Quality Engineering Project

---

## 👥 Team Members

| Member | Name | Role |
|--------|------|------|
| Member 1 | [ Your Name ] | Project Lead, Setup, Slides |
| Member 2 | [ Name ] | TC-003, TC-004, Charter CH-001 |
| Member 3 | [ Name ] | TC-005, TC-006, Charter CH-002, Unit Tests, Postman |
| Member 4 | [ Name ] | TC-007, TC-008, Charter CH-003, Playwright E2E |
| Member 5 | [ Name ] | TC-009, TC-010, JMeter Performance |

---

## 📌 Project Info

| Field | Details |
|-------|---------|
| Project Path | Path A — The Integrator |
| Application | Conduit RealWorld Blog App |
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | PostgreSQL (via Prisma ORM) |
| Testing Tools | Jest, Postman, Playwright, JMeter |

---

## 📁 Repository Structure

```
Group3-Conduit-QE/
│
├── README.md
├── backend/              ← Conduit Node/Express source code
├── frontend/             ← Conduit React source code
├── unit-tests/           ← Jest unit test files (Member 3)
│   └── users.test.js
├── postman/              ← Postman collection export (Member 3)
│   └── Group3_Conduit.postman_collection.json
├── playwright/           ← Playwright E2E scripts (Member 4)
│   └── e2e.spec.js
├── performance/          ← JMeter test plan (Member 5)
│   └── Group3_LoadTest.jmx
└── report/               ← Full QE Report (all members contribute)
    └── Group3_QE_Report.docx
```

---

## 🚀 How to Run the App Locally

### 1. Start PostgreSQL (Docker)
```bash
docker run -d \
  --name conduit-postgres \
  -e POSTGRES_USER=conduit \
  -e POSTGRES_PASSWORD=conduit \
  -e POSTGRES_DB=conduit \
  -p 5432:5432 \
  postgres:15
```

### 2. Start Backend
```bash
cd backend
npm install
npx prisma migrate deploy
npm run start
# Runs on http://localhost:3000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:4100
```

---

## 🧪 How to Run Tests

### Unit Tests (Jest)
```bash
cd unit-tests
npm install
npm test
```

### Playwright E2E
```bash
cd playwright
npm install @playwright/test
npx playwright install
npx playwright test --headed
```

### Postman
- Open Postman
- Import `postman/Group3_Conduit.postman_collection.json`
- Set environment variable `base_url` = `http://localhost:3000/api`
- Run Collection

---

## 📊 Phase Summary

### Phase 1 — Exploration & Test Design
- ✅ 10 Black-Box Test Cases
- ✅ 3 Charter Logs (Session-Based Test Management)
- ✅ Bug Reports with Evidence

### Phase 2 — White-Box & API
- ✅ 10 Unit Tests (Jest + Supertest)
- ✅ 10 Postman API Requests (Full CRUD)
- ✅ 2 Playwright E2E Flows

### Phase 3 — Performance
- ✅ JMeter Load Test (1 → 50 concurrent users)
- ✅ Performance Analysis Report with graphs

---

## 📝 Report & Commit Convention

Each member commits their own section of the report.
Commit message format: `MemberX: description of what was added`

Example:
```
Member1: Initial setup and report template
Member2: Fill TC-003, TC-004 and Charter CH-001
Member3: Fill TC-005, TC-006 and unit test results
Member4: Fill TC-007, TC-008 and Playwright results
Member5: Fill TC-009, TC-010 and JMeter performance report
Member1: Final report compilation and slides
```

---

## ⚠️ Important Git Rule
Always run `git pull` before editing the report to avoid conflicts.
