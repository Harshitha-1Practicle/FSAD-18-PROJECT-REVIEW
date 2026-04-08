# 🧵 LoomGlobal – Handloom Fashion Marketplace

A full-stack web application to promote and sell handloom fashion products to global buyers.

## Tech Stack
- **Backend**: Spring Boot 3.2, Spring Security (JWT), Spring Data JPA
- **Frontend**: React 18, React Router v6, Axios, React Hot Toast
- **Database**: MySQL 8.0

## Roles
| Role | Capabilities |
|------|-------------|
| **Admin** | Dashboard, user management, order management, review moderation |
| **Artisan** | Product listing, inventory management, sales tracking |
| **Buyer** | Browse, search, cart, checkout, order tracking, reviews |
| **Marketing Specialist** | Campaign creation, promotion management |

## Project Structure
```
handloom/
├── backend/                    ← Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/handloom/
│       ├── config/             ← Security, CORS, App config
│       ├── controller/         ← REST API controllers
│       ├── dto/                ← Data Transfer Objects
│       ├── exception/          ← Global exception handler
│       ├── model/              ← JPA entities
│       ├── repository/         ← Spring Data JPA repos
│       ├── security/           ← JWT filter & UserDetailsService
│       └── service/            ← Business logic
├── frontend/                   ← React application
│   ├── src/
│   │   ├── components/         ← Reusable components
│   │   ├── context/            ← AuthContext
│   │   ├── pages/              ← Page components (admin/artisan/buyer/marketing)
│   │   ├── services/           ← API service calls
│   │   └── App.js             ← Routes
│   └── package.json
└── database/
    └── schema.sql              ← MySQL database schema
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### 1. Database Setup
```sql
mysql -u root -p < database/schema.sql
```
Or just start the app — Spring Boot will auto-create tables (`ddl-auto=update`).

### 2. Backend Setup
```bash
cd backend

# Configure database in src/main/resources/application.properties
# Update: spring.datasource.username and spring.datasource.password

mvn clean install
mvn spring-boot:run
```
Backend runs at: **http://localhost:8080**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at: **http://localhost:3000**

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |

### Products (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/public/search` | Search products with filters |
| GET | `/api/products/public/{id}` | Get product by ID |
| GET | `/api/products/public/top-selling` | Top selling products |
| GET | `/api/products/public/latest` | Latest products |

### Artisan (ROLE_ARTISAN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/artisan/products` | Create product |
| GET | `/api/artisan/products` | Get my products |
| PUT | `/api/artisan/products/{id}` | Update product |
| DELETE | `/api/artisan/products/{id}` | Delete product |

### Buyer (ROLE_BUYER)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/buyer/cart` | Get cart |
| POST | `/api/buyer/cart/add` | Add to cart |
| POST | `/api/buyer/orders` | Place order |
| GET | `/api/buyer/orders` | Get my orders |

### Admin (ROLE_ADMIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/orders` | All orders |
| PATCH | `/api/admin/orders/{id}/status` | Update order status |

### Marketing (ROLE_MARKETING_SPECIALIST)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/marketing/campaigns` | Create campaign |
| GET | `/api/marketing/campaigns` | Get campaigns |
| PATCH | `/api/marketing/campaigns/{id}/status` | Update status |

## Default Login Credentials
```
Admin:   admin@loomglobal.com / admin123
```

## Integration Notes (React ↔ Spring Boot ↔ MySQL)
1. **Proxy**: `frontend/package.json` has `"proxy": "http://localhost:8080"` — all `/api/` calls auto-forward
2. **CORS**: Backend allows `http://localhost:3000` via Spring Security CORS config
3. **JWT Auth**: Token stored in `localStorage`, sent as `Authorization: Bearer <token>` header
4. **JPA**: `spring.jpa.hibernate.ddl-auto=update` auto-creates/updates MySQL tables
