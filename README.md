# Muhammad Abuzar — Portfolio

A static site (no build step) — `index.html`, `styles.css`, `script.js`, plus certificate images in `assets/certs/`.

## Go live on Vercel — pick one

### Option A: No GitHub needed (fastest, ~1 minute)
1. Install the CLI once: `npm i -g vercel`
2. From inside this `portfolio` folder, run:
   ```
   vercel --prod
   ```
3. Log in when prompted (GitHub/GitLab/email). Vercel detects it's a static site automatically.
4. You'll get a live `https://your-project.vercel.app` URL in your terminal.

### Option B: Via GitHub (for ongoing auto-deploys)
1. Create a new repo on github.com (e.g. `abuzar-portfolio`), don't initialize it with a README.
2. In this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/abuzar-portfolio.git
   git push -u origin main
   ```
3. Go to vercel.com/new, import that GitHub repo, click Deploy. No framework/build settings needed — it's a static site.
4. Every future `git push` redeploys automatically.

## Before you publish
Open `index.html` and search for `your.email@example.com` and the two `href="#"` placeholder links in the Contact section — swap in your real email, LinkedIn and GitHub URLs.
