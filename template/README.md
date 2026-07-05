# A Template to Start a New Node API Project

This template provides a professional and modern starting point for creating a new Node.js API project. It comes preconfigured with essential tools, a structured module system, and a robust logging and validation layer.

## Key Features

- 🚀 **Professional Startup Banner**: Real-time system stats (RAM, Disk, Uptime) on boot.
- 🛠️ **Environment Management**: Fully integrated with `.env` files.
- 📊 **Modern Logging**: Winston logger with Luxon for precise localized timestamps.
- 🔗 **Pluggable Database**: One `DB_ENGINE` switch — MongoDB (Mongoose) or SQL (Knex for PostgreSQL & MySQL) — behind a clean **repository pattern**, so your business logic never changes when you swap engines.
- 🛡️ **Security**: Pre-configured with CORS, Rate Limiting, and JWT authentication.
- 🧩 **Modular Structure**: Organized by modules (Controllers, Services, Repositories, Models, Routes).

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A database matching your `DB_ENGINE`: [MongoDB](https://www.mongodb.com/), [PostgreSQL](https://www.postgresql.org/), or [MySQL](https://www.mysql.com/)

## Installation

1. Create a new project using the CLI:
   ```sh
   npx create-it-api my-awesome-project
   ```

2. Enter the directory:
   ```sh
   cd my-awesome-project
   ```

3. Configure your environment:
   ```sh
   # .env is automatically created from .env.example
   nano .env
   ```

## Choosing a Database Engine

Pick the backend with a single `DB_ENGINE` variable in your `.env` — everything else stays the same:

```dotenv
DB_ENGINE=mongo            # mongo | postgres | mysql

# When DB_ENGINE=mongo
MONGO_USER=...
MONGO_PASSWORD=...
MONGO_SERVER=...
MONGO_DB=...

# When DB_ENGINE=postgres | mysql
SQL_HOST=localhost
SQL_PORT=5432              # 5432 for postgres, 3306 for mysql
SQL_USER=...
SQL_PASSWORD=...
SQL_DATABASE=...
SQL_SSL=false
```

Data access lives behind a **repository pattern** — see the reference `user` module. Each
DB-backed module defines a domain contract plus one adapter per engine, and a factory
resolves the right one at runtime from `DB_ENGINE`. Your services and controllers never
import a database library directly; that is what keeps switching engines painless.

## Running the Project

### Development Mode
Auto-restarts on file changes using `nodemon`:
```sh
npm run dev
```

### Production Mode
Standard execution with `node`:
```sh
npm start
```

## Package.json Overview

The `package.json` includes the following modern stack:

### Key Dependencies:
- `express` (v5+) - Fast, unopinionated, minimalist web framework.
- `mongoose` (v9+) - Elegant MongoDB object modeling (used when `DB_ENGINE=mongo`).
- `knex` - SQL query builder powering the Postgres/MySQL engines.
- `pg` / `mysql2` - PostgreSQL and MySQL drivers (used when `DB_ENGINE=postgres`/`mysql`).
- `express-validator` - Set of express.js middlewares that wraps validator.js.
- `jsonwebtoken` - JWT-based authentication.
- `bcrypt` - Optimized password hashing.
- `cors` - Cross-origin resource sharing.
- `dotenv` - Zero-dependency environment variable loader.
- `winston` - Universal logging library with daily rotation support.

> ℹ️ **Note on the SQL drivers:** `pg` and `mysql2` ship as regular dependencies so **any**
> engine works right after `npm install`, with no extra setup. They're loaded lazily — only
> when `DB_ENGINE` actually selects them — so a MongoDB-only project pays zero runtime cost
> for them. If you're sure you'll never use SQL, you can safely remove both (or move them to
> `optionalDependencies`).

### Development Tools:
- `nodemon` - Auto-restart server on file changes.
- `morgan` - HTTP request logger middleware.
- `multer` - Middleware for handling `multipart/form-data` (file uploads).

### Utilities:
- `luxon` - Powerful and modern library for working with dates and times.
- `lodash` - Modern JavaScript utility library.
- `socket.io` - Real-time, bidirectional and event-based communication.
- `resend` - Email sending integration.
- `uuid` - RFC4122 UUID generation.

## Folder Structure

```
.env
package.json
app.js
server.js
db/               # Pluggable DB factory (engine chosen via DB_ENGINE)
├── index.js      #   connect() / getClient() / disconnect()
└── engines/      #   mongo.js (Mongoose), postgres.js & mysql.js (Knex)
src/
├── helpers/      # Global utilities (logger, token, etc.)
├── middlewares/  # Express middlewares
├── modules/      # Business logic by module
│   ├── home/     # Stateless reference module
│   └── user/     # DB-backed reference module (repository pattern)
│       ├── controllers/
│       ├── services/      # DB-agnostic business logic
│       ├── repositories/  # port (contract) + mongo/ & sql/ adapters + factory
│       ├── models/        # models/mongo/ (schema) · models/sql/ (table)
│       └── routes/
└── routes/       # Versioned route entry points
```

## License

This project is licensed under the MIT License.
