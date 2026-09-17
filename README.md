# Student Management System
web link: https://student-management-system-jaanu2.vercel.app
## Live Demo
- **Frontend:** https://student-management-system-jaanu2.vercel.app
- **Backend API:** https://student-management-system-qhvv.onrender.com/api/

A full-stack CRUD web application built with **React**, **Django REST Framework**, and **SQLite**, following the standard CRUD-application SOP (requirement analysis → design → build → validate → test → document).

## 1. Project Overview

Manages student records for an academic institution. A staff user can add, view, search, edit, and delete student records through a responsive web interface backed by a REST API.

## 2. Problem Statement

Institutions often track student data (roll numbers, contact info, course, year, GPA) in spreadsheets, which are error-prone and hard to search or share. This app provides a simple, validated, centralized system for managing that data.

## 3. Objectives

- Implement full CRUD (Create, Read, Update, Delete) for student records.
- Enforce validation on both client and server.
- Expose a documented REST API.
- Provide a responsive, easy-to-use UI with search/filter.

## 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), plain CSS |
| Backend | Django 6 + Django REST Framework |
| Database | SQLite (default; swappable to PostgreSQL/MySQL) |
| API Testing | Django's built-in `APITestCase` (12 automated tests); Postman-compatible |
| Version Control | Git |

## 5. System Architecture

```
User → React (Vite, port 5173) → REST API (fetch/axios, JSON)
     → Django REST Framework (port 8000) → ORM → SQLite (db.sqlite3)
```

## 6. Database Design (ER summary)

**Table: `students_student`**

| Field | Type | Constraints |
|---|---|---|
| id | AutoField | Primary key |
| roll_no | CharField(20) | Unique, required, alphanumeric+hyphen |
| name | CharField(100) | Required |
| email | EmailField | Unique, required, valid email format |
| phone | CharField(15) | Optional, digits (7–15), optional leading `+` |
| course | CharField(10) | Choice field (CSE/ECE/MECH/CIVIL/IT/OTHER) |
| year | PositiveSmallInteger | Required, 1–5 |
| gpa | Decimal(4,2) | Required, 0–10 |
| created_at | DateTime | Auto-set on create |
| updated_at | DateTime | Auto-set on update |

Single-entity design — no relationships needed for this scope. Ready to extend (e.g., a `Course` foreign key) if required.

## 7. API Endpoint Documentation

Base URL: `http://127.0.0.1:8000/api/`

| Operation | Method | Endpoint | Notes |
|---|---|---|---|
| Create | POST | `/students/` | Body: JSON student object |
| Read all | GET | `/students/` | Supports `?search=` (name/roll_no/email) and `?course=CSE` |
| Read one | GET | `/students/{id}/` | 404 if not found |
| Update | PUT/PATCH | `/students/{id}/` | PATCH for partial updates |
| Delete | DELETE | `/students/{id}/` | Returns 204 on success |

**Example — create a student**

```bash
curl -X POST http://127.0.0.1:8000/api/students/ \
  -H "Content-Type: application/json" \
  -d '{"roll_no":"CSE001","name":"Asha Rao","email":"asha@example.com","phone":"9876543210","course":"CSE","year":2,"gpa":8.5}'
```

**Success response (201):**
```json
{"id":1,"roll_no":"CSE001","name":"Asha Rao","email":"asha@example.com","phone":"9876543210","course":"CSE","year":2,"gpa":"8.50","created_at":"...","updated_at":"..."}
```

**Validation error response (400):**
```json
{"error":"Validation failed","details":{"name":["This field is required."]}}
```

List responses are paginated (20 per page): `{"count": N, "next": url|null, "previous": url|null, "results": [...]}`.

## 8. CRUD Implementation Details

- **Frontend**: `StudentForm.jsx` handles create/edit with client-side validation (required fields, email regex, phone regex, numeric ranges). `StudentList.jsx` renders a searchable, sortable-by-column table with Edit/Delete actions and a confirm dialog before delete. `App.jsx` owns state and calls `api.js` (axios) for all network requests, showing success/error banners.
- **Backend**: `StudentViewSet` (DRF `ModelViewSet`) implements all 5 REST operations, with search/filter via query params. `StudentSerializer` enforces server-side validation (uniqueness on roll number/email, format checks) independent of the frontend, per the SOP requirement that server-side validation must exist even when client-side validation is present.

## 9. Validation Rules

| Field | Rule |
|---|---|
| roll_no | Required, unique, alphanumeric + hyphen |
| name | Required, non-empty after trimming |
| email | Required, valid format, unique |
| phone | Optional; if present, 7–15 digits with optional `+` |
| year | Required, integer 1–5 |
| gpa | Required, decimal 0–10 |

Duplicate roll numbers/emails return a `400` with a clear message instead of a server error.

## 10. Testing

Automated backend tests (`backend/students/tests.py`) cover:
- Create with valid data
- Create with missing required field
- Create with duplicate roll number
- Create with invalid email
- List (empty & populated)
- Retrieve valid and invalid IDs
- Update valid and invalid IDs
- Delete valid and invalid IDs
- Search/filter

Run them with:
```bash
cd backend
python manage.py test students
```
Result: **12/12 passing**.

For manual API testing, import the endpoints above into Postman, or use the `curl` example above as a template for each operation.

Frontend responsiveness was verified via CSS media query (`main` switches from a 2-column to 1-column layout under 800px) — test by resizing the browser or using DevTools device emulation.

## 11. Installation & Execution

### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit DJANGO_SECRET_KEY
python manage.py migrate
python manage.py runserver
```
API now runs at `http://127.0.0.1:8000/api/students/`.
Optional admin panel: `python manage.py createsuperuser`, then visit `/admin/`.

### Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env            # adjust VITE_API_BASE_URL if needed
npm run dev
```
App runs at `http://127.0.0.1:5173`.

> Make sure the backend is running first — the frontend calls it directly. CORS is pre-configured in `settings.py` for `localhost:5173`.

## 12. Security Notes

- `SECRET_KEY` and `DEBUG` are read from environment variables (`.env`), never hard-coded in a shared/deployed setting.
- All database access goes through Django's ORM (parameterized queries — no raw SQL, no injection risk).
- Server-side validation is enforced independently of the client.
- `.env`, `venv/`, `node_modules/`, and `db.sqlite3` are git-ignored.

## 13. Challenges & Solutions

- **Pagination vs. simple list assumptions**: DRF's default pagination wraps list responses in a `results` key; the frontend (`api.js`) and tests account for this explicitly.
- **CORS between dev servers**: Frontend (5173) and backend (8000) run on different origins; solved with `django-cors-headers` and an explicit allow-list.
- **Duplicate-safe validation**: Uniqueness checks in the serializer exclude the current instance on update, so editing a record without changing its roll number/email doesn't falsely trigger a "duplicate" error.

## 14. Future Enhancements

- Authentication (JWT) and role-based access (admin vs. read-only staff).
- Pagination controls and column sorting in the UI.
- CSV import/export.
- Course/Department as a related model instead of a flat choice field.
- Deployment configs (Docker, PostgreSQL, Nginx) for production.

## 15. Project Structure

```
sms/
├── README.md
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── studentms/          # project settings, urls
│   └── students/           # app: models, serializers, views, urls, admin, tests
└── frontend/
    ├── package.json
    ├── index.html
    ├── .env.example
    └── src/
        ├── App.jsx, App.css, main.jsx, api.js
        └── components/StudentForm.jsx, StudentList.jsx
```

## 16. Completion Checklist

- [x] Create, Read, Update, Delete all implemented and tested
- [x] Frontend ↔ backend ↔ database communication verified end-to-end
- [x] Client-side and server-side validation implemented
- [x] 12 automated API tests passing
- [x] Search/filter implemented
- [x] Responsive layout
- [x] Documentation complete (this file)
