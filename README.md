# guestpg

Local development
--

1. Start the Node backend (node-aws):

```bash
cd /var/www/html/node-aws
npm install
npm run dev
```

2. Start the React frontend:

```bash
cd /var/www/html/guestpg
npm install
npm run dev   # or `npm run start`
```

Notes
--
- The frontend proxies `/api` to the backend (configured in `vite.config.js`).
- Ensure `node-aws/.env` has `PORT=8585` and `CORS_ORIGIN=http://localhost:5173`.
- Frontend environment variable `VITE_API_URL` is set in `.env` to `http://localhost:8585/api`.

If you want, I can start the backend and frontend in terminals for you.