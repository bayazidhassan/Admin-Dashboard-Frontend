# Admin Dashboard Frontend

React + Vite frontend for the Admin Dashboard backend — a role-based admin panel covering authentication, permissions, roles, users, media, categories, brands, attributes, and products (simple and variable).

---

# Live

```text
https://admindashboardbd.netlify.app
```

Backend API this connects to: https://github.com/bayazidhassan/Admin-Dashboard-Backend
(see that repo's README for seeded login credentials)

---

# Tech Stack

* React (Vite)
* TypeScript
* Redux Toolkit + RTK Query
* Tailwind CSS
* react-hot-toast

---

# Features

* Login with automatic access-token refresh on expiry, and session persistence across page reloads
* Permission groups, roles, and user management (RBAC)
* Media library — upload, edit metadata, delete
* Category management with nested tree structure
* Brand and Attribute (with values) management
* Product management — simple and variable products, variant generation, product/variant/attribute-value media attachment

---

# Installation

```bash
git clone https://github.com/bayazidhassan/Admin-Dashboard-Frontend.git
cd Admin-Dashboard-Frontend
npm install
```

---

# Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://admin-dashboard-backend-q1bs.onrender.com/api/v1
VITE_SERVER_URL=https://admin-dashboard-backend-q1bs.onrender.com
```

* `VITE_API_URL` — the API base used for all requests (includes `/api/v1`)
* `VITE_SERVER_URL` — the bare server origin, used to resolve media/image URLs (e.g. uploaded files served from `/uploads`)

For local development against a locally running backend, point both to your local API instead (e.g. `http://localhost:5000/api/v1` and `http://localhost:5000`).

---

# Running the Project

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build locally
npm run preview
```

---

# Deployment

Deployed on Netlify. The included `vercel.json`/Netlify redirect config routes all paths to `index.html` so client-side routing (React Router) works correctly on refresh.

---

# Module Status

| Module | Status |
|---|---|
| Authentication (login, refresh, logout, session persistence) | Complete |
| Permission | Complete |
| Role | Complete |
| User | Complete |
| Media | Complete |
| Category | Complete |
| Brand | Complete |
| Attribute (incl. attribute value media) | Complete |
| Product (simple, variable, variants, media) | Complete |

---

# Known Issues

* Sorting the product list by price is accurate for simple products. For variable products, price is a min/max computed from variants after the database query runs, so price sorting does not perfectly interleave variable products by their computed range. (Backend limitation — see backend repo's README.)

---

# Author

**Bayazid Hassan**
* GitHub: https://github.com/bayazidhassan
