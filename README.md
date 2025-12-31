# Freelancing Platform

React + Django scaffold that backs the Freelancing Platform described in the SRS.

---

## Repository Contents

- `SRS_SWE.pdf` – original Software Requirements Specification
- `Frontend/` – Vite + React + TypeScript single-page app scaffold
- `Backend/` – Django 5 project configured for REST development
- `README.md` – project overview and setup instructions

Directory structure:

```
SWE_Project/
├── Frontend/         # React client (Vite)
├── Backend/          # Django REST backend
├── README.md
└── .gitignore
```

---

## Getting Started

### 1. Frontend (React)

```
cd Frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` by default. Environment-specific values can be defined in `Frontend/.env` (Vite convention) as needed.

### 2. Backend (Django + DRF)

```
cd Backend
python -m venv .venv
.venv\Scripts\activate      # Windows PowerShell
pip install -r requirements.txt
copy env.example .env       # or configure manually
python manage.py migrate
python manage.py runserver
```

Key features of the backend scaffold:

- `platform_api` app mounted at `http://localhost:8000/api/`
- `/api/health/` endpoint for availability checks
- `django-rest-framework` and `django-cors-headers` preconfigured
- `.env` driven settings (secret key, debug flag, hosts, Postgres credentials, frontend URL)
- Defaults to SQLite for local dev; switches to PostgreSQL automatically when `POSTGRES_*` vars are provided

---

## Roadmap Snapshot

- Authentication / role management (admin, client, freelancer, company)
- Requests, negotiations, projects, and deliverables
- Reviews, community posts, notifications, reports, offers, and help desk
- Media management for uploads across modules
- Comprehensive API layer aligning with the SRS tables and endpoints described in the system design document

---

## Next Steps

1. Flesh out database models in `Backend/platform_api/models.py` following the schema in the design doc.
2. Build REST serializers + viewsets that expose the detailed API endpoints already listed in the SRS.
3. Implement React layouts, routing, and shared state management that consume those endpoints.
4. Add CI/CD, linting, and testing workflows once business logic lands in the repo.
