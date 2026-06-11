# Express Learning API

A modular, robust, and clean RESTful API built using **Node.js**, **Express.js**, **TypeScript**, and **PostgreSQL**. This project demonstrates standard modular structure practices for scalable applications, featuring custom middlewares, role-based access control, secure authentication via JSON Web Tokens (JWT), and raw SQL database connection pooling.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js (v5.2.1)
- **Language:** TypeScript (v6.0.3)
- **Database:** PostgreSQL (v8.21.0 using `pg` driver)
- **Authentication & Hashing:**
  - `jsonwebtoken` (v9.0.3) - for Access & Refresh tokens
  - `bcryptjs` (v3.0.3) - for password encryption
- **Development Tools:**
  - `tsx` (v4.22.4) - TypeScript Execute for rapid watch-mode reloading
  - `dotenv` (v17.4.2) - environment variable configuration
  - `cors` & `cookie-parser` - cross-origin requests & cookie handling

---

## 📂 Project Directory Structure

Click on any file path below to navigate directly to the file:

```text
express-learning/
├── .env.example (Environment template)
├── package.json (Dependency & script management)
├── tsconfig.json (TypeScript config)
└── src/
    ├── app.ts (Express Application setup & route definitions)
    ├── server.ts (Entry point - boots up DB & Server)
    ├── config/
    │   └── index.ts (Environment configuration parser)
    ├── db/
    │   └── index.ts (PostgreSQL connection pool & auto-migration schemas)
    ├── middleware/
    │   ├── auth.ts (Role-based access token verification middleware)
    │   ├── globalErrorHandler.ts (Centralized Express error handling)
    │   ├── logger.ts (Request logger caching details to logger.txt)
    │   └── index.d.ts (Express Request interface declaration extensions)
    ├── types/
    │   └── index.ts (Shared types and role constants)
    ├── utility/
    │   └── sendResponse.ts (Standardized API response formatter)
    └── modules/
        ├── user/ (User Management)
        │   ├── user.interface.ts
        │   ├── user.controller.ts
        │   ├── user.service.ts
        │   └── user.route.ts
        ├── profile/ (User Profile details)
        │   ├── profile.controller.ts
        │   ├── profile.service.ts
        │   └── profile.route.ts
        └── auth/ (Authentication & Token Refreshing)
            ├── auth.controller.ts
            ├── auth.service.ts
            └── auth.route.ts
```

### 🔗 Key Configurations & Core Files:

- [package.json]
- [src/server.ts]
- [src/app.ts]
- [src/db/index.ts]
- [src/config/index.ts]

---

## 🗃️ Database Schema

The database relies on raw SQL connections established using connection pools. When the server launches, [src/db/index.ts]executes schemas auto-creation to set up the following two normalized relational tables:

### 1. `users` Table

Stores authentication and basic user detail:
| Column | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | _auto-increment_ |
| `name` | `VARCHAR(100)` | - | `NULL` |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | - |
| `password` | `TEXT` | `NOT NULL` | - |
| `is_active`| `BOOLEAN` | - | `true` |
| `age` | `INT` | - | `NULL` |
| `role` | `VARCHAR(10)` | - | `'user'` |
| `created_at`| `TIMESTAMP` | - | `NOW()` |
| `updated_at`| `TIMESTAMP` | - | `NOW()` |

> **Role Options:** Defined in [src/types/index.ts](file:///E:/code%20and%20relavent%20documets/ph%20zankar%20mahbub/level-2-nextl-level-web-7/mission-2/express-learning/src/types/index.ts) as `"admin" | "agent" | "user"`.

### 2. `profiles` Table

Stores extended metadata linked one-to-one with the user:
| Column | Type | Constraints | Default |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | _auto-increment_ |
| `user_id` | `INT` | `UNIQUE`, `REFERENCES users(id) ON DELETE CASCADE` | - |
| `bio` | `TEXT` | - | `NULL` |
| `address` | `TEXT` | - | `NULL` |
| `phone` | `VARCHAR(15)` | - | `NULL` |
| `gender` | `VARCHAR(10)` | - | `NULL` |
| `created_at`| `TIMESTAMP` | - | `NOW()` |
| `updated_at`| `TIMESTAMP` | - | `NOW()` |

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js installed (v18+ recommended)
- A running PostgreSQL database instance (local or remote/Neon DB hosted)

### Steps

1.  **Clone / Navigate** to the project directory:
    ```bash
    cd express-learning
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**:
    Create a `.env` file in the root directory and populate it with your configuration:
    ```env
    PORT=5000
    CONNECTIONSTRING=postgresql://<username>:<password>@<host>:<port>/<dbname>?sslmode=require
    JWT_SECRET=your_jwt_access_secret_key
    JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
    ```
4.  **Run in Development Mode**:
    Starts the server using `tsx watch` for auto-reloading:
    ```bash
    npm run dev
    ```
    The console will print:
    ```text
    Database connected Successfully!
    Example app listening on port 5000
    ```

---

## 🛡️ Custom Middleware Architecture

The application handles incoming requests through structured middlewares located under the [src/middleware] directory:

1.  **[auth.ts]**:
    - Verifies incoming `Authorization` headers containing the JWT token.
    - Authenticates active users (`is_active: true`) against the database.
    - Implements role checking against optional route parameter constraints (e.g. `auth("admin", "agent")`).
2.  **[logger.ts]**:
    - Logs request `Method`, `Time`, and `URL` to both the terminal and appends details into `logger.txt`.
3.  **[globalErrorHandler.ts]**:
    - Intercepts syntax errors, thrown database errors, and authentication failures. It outputs clean JSON errors to avoid exposing stack trace details to consumers.

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/auth`)

- **POST** `/api/auth/login`
  - Logs in a user with `email` and `password`.
  - Returns `accessToken` (lasts 1 day) and `refreshToken` (lasts 10 days).
- **POST** `/api/auth/refresh-token`
  - Regenerates a new `accessToken` using a valid `refreshToken` passed in header/body.

### 👤 User Operations (`/api/users`)

- **POST** `/api/users/`
  - Creates a new user profile.
  - _Payload:_ `{ name, email, password, age, role }`
  - Password gets encrypted using `bcrypt` (12 rounds) before database storage.
- **GET** `/api/users/`
  - Retrieves all users. (Excludes raw passwords in response).
  - 🔒 _Protected:_ Only accessible to roles: `admin` or `agent`.
- **GET** `/api/users/:id`
  - Retrieves a single user's detail by their auto-increment ID.
- **PUT** `/api/users/:id`
  - Updates user details like `name`, `password`, `age`, or `is_active` status (uses `COALESCE` to support partial updates).
- **DELETE** `/api/users/:id`
  - Deletes a user record. Cascading reference automatically deletes their profile details as well.

### 📝 Profile Operations (`/api/profile`)

- **POST** `/api/profile/`
  - Creates or adds profile details.
  - _Payload:_ `{ user_id, bio, address, phone, gender }`
  - Performs database checks to guarantee the referenced `user_id` exists.
