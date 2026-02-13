# Deploy to Vercel

To deploy this project to Vercel, follow these steps:

1.  **Import Project**: Import your GitHub repository into Vercel.
2.  **Framework Preset**: Vercel should automatically detect "Vite". If not, select **Vite**.
3.  **Root Directory**: 
    - Go to **Build & Development Settings**.
    - Click **Edit** next to "Root Directory".
    - Select the **`frontend`** folder.
4.  **Build Command**: Ensure it is set to `npm run build` (Default).
5.  **Output Directory**: Ensure it is set to `dist` (Default).
6.  **Deploy**: Click **Deploy**.

## Configuration Details
- The existing `frontend/vercel.json` handles client-side routing (rewrites to `/index.html`), so your application routes will work correcty on refresh.
- The build produces a static site in `frontend/dist`.
