# SemiLab Frontend

React/Vite frontend for the SemiLab interactive semiconductor physics laboratory.

## Run locally

```powershell
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_URL` in `.env` to the URL of the separate Flask backend. The default is the deployed SemiLab backend; use `http://localhost:5000` when running Flask locally.

## Build

```powershell
npm run build
```

The production build is the frontend verification command. Request handling
uses a 250 ms slider debounce, AbortController cancellation, stale-response
protection, and a retry action after API failures. There is no separate test
runner configured in this lightweight Vite repository yet.

## Included

- Responsive light laboratory dashboard
- Semiconductor material and junction controls
- Interactive electric-field, charge-density, energy-band, and ideal diode charts
- P–N junction visualization with animation controls
- Loading, API error, and model-validity states

Scientific calculations are intentionally not implemented in this repository. The frontend consumes results from the Flask backend through `/api/materials` and `/api/simulate`.
