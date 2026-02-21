# Double Sprint App

A productivity application for tracking exam preparation and YouTube channel growth simultaneously.

## Deployment to Vercel

This project is configured for easy deployment on Vercel.

### Steps:

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**: Go to [vercel.com](https://vercel.com), click "Add New Project", and select your repository.
3.  **Configure Build Settings**:
    *   **Framework Preset**: Vite
    *   **Build Command**: `npm run build` (or `vite build`)
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   Add `GEMINI_API_KEY` if you are using Google Gemini features.
    *   Add any other environment variables from `.env.example`.
5.  **Deploy**: Click "Deploy".

### Local Development

1.  Install dependencies: `npm install`
2.  Start dev server: `npm run dev`
3.  Build for production: `npm run build`
