# NovaCart Account Dashboard
### HC&D Associates Capstone — App Developer + App Consultant

Your starting point for the NovaCart Account Dashboard capstone. The infrastructure is already set up. Your job is to implement the API endpoints and the frontend UI.

---

## What's in this repo

```
backend/          Python + FastAPI API skeleton
  main.py         ← Your main work — implement the 5 TODO endpoints
  connection.py   ← Already done — handles local dev + SPCS automatically
  requirements.txt
  Dockerfile

frontend/         React 18 frontend skeleton
  src/pages/      ← Your main work — implement the UI in these 3 files
    OrdersView.js
    ProductsView.js
    CustomersView.js
  src/components/ ← Already done — Navbar, ServiceStatus
  src/utils/      ← Already done — api.js, ThemeContext.js
  Dockerfile

router/           NGINX reverse proxy — do not modify
data/
  novacart_gold.db  ← SQLite database for local development
                      30,000 orders · 400 customers · 15 products

build-and-push.sh   ← Run this on Day 4 to deploy to SPCS
```

---

## Quick Start — Local Development

### 1. Backend

```bash
cd backend
cp .env.example .env
# No changes needed — DATA_BACKEND=sqlite works out of the box

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Open **http://localhost:8000/docs** — Swagger UI with all endpoints.

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env

npm install
npm start
# Opens at http://localhost:3000
```

---

## Your Work

### App Developer

**Backend** — open `backend/main.py` and implement the 5 endpoints:

| Endpoint | Description |
|---|---|
| `GET /franchise/summary` | Total revenue, orders, unique customers |
| `GET /franchise/orders` | Monthly order volume and revenue |
| `GET /franchise/products` | Top 10 products by revenue |
| `GET /franchise/customers` | Top 20 customers by revenue |
| `GET /franchise/cities` | Revenue by city and state |

Each endpoint has a `TODO` comment with hints and the expected response format.

**Frontend** — open the three files in `frontend/src/pages/` and implement the UI:

| File | What to build |
|---|---|
| `OrdersView.js` | Stat cards + monthly revenue chart + cities chart |
| `ProductsView.js` | Products bar chart + products table |
| `CustomersView.js` | Sortable customers table |

Each file has `TODO` comments explaining exactly what to build and which data is available.

### App Consultant

- Write the requirements document before any code is written (end of Day 1)
- Validate each endpoint against requirements before marking it done
- Write the Solution Design Document by Day 4
- Prepare and lead the client presentation on Day 5

---

## Data Schema

The SQLite database has four tables matching the Gold layer from the Data Engineering capstone:

```
fact_orders    order_id, customer_id, product_id, order_date, amount,
               currency, status, quantity, date_key

dim_customer   customer_id, name, email, signup_date,
               addr_street, addr_city, addr_state, addr_zip,
               valid_from, valid_to, is_current

dim_product    product_id, name, category, price, updated_at

dim_date       date_key, full_date, year, quarter, month,
               month_name, day_of_week, is_weekend
```

Use `status IN ('delivered', 'shipped')` for revenue calculations.

---

## Frontend Implementation Notes (feat/frontend)

The frontend was built against dummy data. `backend/`, `router/` and the database were not changed.

### Data source

- `frontend/src/utils/mockApi.js` holds dummy data with the same function names and response shapes as `api.js`.
- `frontend/src/utils/dataSource.js` picks `mockApi` or the real `api.js`. All pages and `ServiceStatus` import from it.
- Dummy data is the default. To call the real backend, set `REACT_APP_USE_MOCK=false` in `frontend/.env` (see `frontend/.env.example`) and restart `npm start`.
- Dummy city, product and customer figures scale with the selected date range. They are invented, not taken from `novacart_gold.db`.

### Requirements coverage

| ID | Requirement | Implementation | Status |
|---|---|---|---|
| FE-01 | React 18 | Starter project | Met |
| FE-02 | Calls go through `/api/*` | `api.js` uses `REACT_APP_BACKEND_URL` (`/api` in SPCS). Pages call it through `dataSource.js`. | Met in code, not tested against a running backend |
| FE-03 | OAuth via `/authorize`, store the franchise id | `utils/AuthContext.js` calls `authorize()` at startup, keeps the user in context and `sessionStorage`, and shows it in the sidebar | Met. The backend returns `user`, which is stored as the franchise id. |
| FE-04 | Loading state and a friendly error | `components/ErrorMessage.js` shows "We couldn't load this data. Please try again." with a Retry button. Technical errors go to the console only. Every page shows a loading message. | Met |
| FE-05 | Nav bar with all views and a status indicator | Sidebar links to Orders, Products and Customers, plus `ServiceStatus` (uses `/health`) | Met |
| FE-06 | Dark mode toggle that persists | Toggle in the sidebar. Persistence comes from `ThemeContext.js` (localStorage). | Met |

**View 1, Orders**
- Total Revenue and Total Orders cards follow the date range. They are summed from the monthly data, so they also work with the real backend.
- Monthly revenue is an area (line-style) chart with short month labels.
- Revenue by city is a bar chart.
- Date range filter with an Apply button, and a check that From is not after To.
- Unique Customers is an extra card showing the all-time figure, because `/franchise/summary` has no date filter.

**View 2, Products**
- Top 10 products bar chart with the top product highlighted.
- Table with Product Name, Category, Units Sold and Revenue.
- Same date range filter.

**View 3, Customers**
- Top 20 customers table. Every column header is a sortable button with `aria-sort`.
- Same date range filter.

**Deviations from the requirements document**
- The document says "country" for the Orders chart and the Customers table. The data only has city and state, so those are used.
- The Unique Customers card is an addition.

### Design (Figma: NovaCart MVP)

- `components/Navbar.js` is a blue left sidebar: Indigo Bio Med brand block, uppercase links, a white pill on the active page, service status, theme toggle and a user block. The logo is a placeholder SVG, not the client's file.
- `App.css` was rewritten with blue (`#1D4FFF`) and teal (`#00BFA5`) tokens plus dark-mode variants. The colors were estimated from screenshots. The sidebar becomes a top bar on small screens.
- `utils/chartTheme.js` holds the shared chart colors, axis text and tooltip style for light and dark mode.
- Dummy product names follow the Figma samples (Smart Scale Pro, Pulse Watch Elite and so on).

**Differences from the Figma**
- The From/To date pickers replace the month dropdown, because the requirements ask for a date range.
- Revenue by city is a bar chart (required), where the Figma shows an area chart.
- The Customers table shows City and State instead of Country.

### Typography

- IBM Plex Sans is self-hosted through `@fontsource/ibm-plex-sans`, with weights 400, 600 and 700 imported in `index.js`. No external font service is called.
- Headings are bold blue. `h1` scales from 28px to 40px. Body text is 15px regular with a 1.5 line height. Text is left-aligned.
- Known gaps against the 14–16 body spec: table headers and chart axis labels are 12px, and headings and stat values use a 1.2 line height.

### Other changes

- `useEffect` lint warnings are silenced with a comment on the three pages, because data loads once on mount and reloads on Apply.
- Date inputs have linked labels, and the error and status components use `role="alert"` and `role="status"`.

### Not done yet

- Real data: the five backend endpoints are still unimplemented.
- Verification: confirm the fonts and layout in the browser with `npm start`, and re-run `npm run build`.
- Client logo and brand colors, if the client supplies them.

---


## Deploying to SPCS

When your endpoints are working and the UI is connected, on Day 4:

```bash
export REPO_URL=<provided by your facilitator>
export GROUP=<your team number>

bash build-and-push.sh
```

Then notify your facilitator — they will deploy your services and give you the public URL.

---

## Troubleshooting

**`501 Not implemented` error** — Expected. Those are the endpoints you need to build.

**Backend can't find the database** — Run `uvicorn` from inside the `backend/` directory.

**CORS error in browser** — Make sure `CLIENT_VALIDATION=Dev` in your backend `.env`.

**`snow` command not found** — Run:
```bash
pip3 install snowflake-cli-labs
export PATH="$HOME/Library/Python/3.9/bin:$PATH"
```

**Docker build fails** — Run with `--no-cache`:
```bash
docker build --no-cache --platform linux/amd64 ...
```
