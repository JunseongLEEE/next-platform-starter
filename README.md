# A-EYE Demo (Netlify + Flask) — Quick Start for Course Evaluation

Repository URL (GitHub)
- https://github.com/JunseongLEEE/next-platform-starter

## What this project contains
- Next.js 16 (App Router) frontend deployed on Netlify
- A-EYE backend (Flask + Google Gemini + Naver APIs + Depth Anything V2) located at `final_function_aeye/A-Eye`
- A demo page at `/aeye` in the Next.js app that embeds the A‑EYE UI (via iframe)

You can run the A‑EYE backend anywhere (local, GPU server, or ngrok) and just point the Netlify site to it.

---

## Easiest demo path (recommended for grading)

1) Backend: run A‑EYE with HTTPS URL (ngrok or server)
- Option A: Local + ngrok (fastest)
  - Terminal 1
    ```
    cd final_function_aeye/A-Eye
    conda create -n aeye python=3.10 -y
    conda activate aeye
    pip install -r requirements.txt
    ```
  - Place model checkpoint at:
    - `final_function_aeye/A-Eye/checkpoints/depth_anything_v2_metric_hypersim_vits.pth`
  - Environment file:
    ```
    cp .env.template .env
    # edit .env to include:
    # API_KEY (or API_KEY_1..3), NAVER_CLIENT_ID/NAVER_CLIENT_SECRET, NCP_CLIENT_ID/NCP_CLIENT_SECRET
    ```
  - Run backend:
    ```
    python server.py   # serves on http://0.0.0.0:8081
    ```
  - Terminal 2 (ngrok):
    ```
    ngrok http 8081
    ```
    Copy the HTTPS forwarding URL (e.g. https://<random>.ngrok.io).

- Option B: GPU server (stable)
  - Serve Flask behind HTTPS domain (e.g. https://aeye.yourschool.ac.kr) via Nginx.
  - Make sure HTTPS is enabled (camera/mic require HTTPS).

2) Frontend: point Netlify to the backend URL
- On Netlify, set the environment variable:
  - `NEXT_PUBLIC_AEYE_UI_ORIGIN` = your A‑EYE HTTPS URL (ngrok or server)
- Deploy (or redeploy) the Netlify site.

3) Demo
- Visit `https://<your-netlify-app>/**aeye**`
- Allow camera/mic permissions in the browser (mobile Safari/Chrome supported)
- Use the big start button to begin auto analysis; optional: press the gear icon for settings; try the “길찾기” button to test navigation flow if Naver APIs are configured.

Notes
- If using ngrok free tier, the URL may change; update `NEXT_PUBLIC_AEYE_UI_ORIGIN` accordingly and redeploy Netlify before the demo.
- iframe requires that your backend is embeddable (no `X-Frame-Options: DENY`). Default Flask is OK; if using Nginx, don’t block framing.

---

## Local development (both apps)

- Backend (Flask)
  ```
  cd final_function_aeye/A-Eye
  conda create -n aeye python=3.10 -y
  conda activate aeye
  pip install -r requirements.txt
  cp .env.template .env   # add API keys as needed
  # Place model checkpoint under checkpoints/
  python server.py        # http://localhost:8081
  ```

- Frontend (Next.js)
  ```
  npm install
  # point the iframe to local backend
  NEXT_PUBLIC_AEYE_UI_ORIGIN=http://localhost:8081 npm run dev
  # open http://localhost:3000/aeye
  ```

---

## Environment variables

- A‑EYE backend (`final_function_aeye/A-Eye/.env`)
  - `API_KEY` or `API_KEY_1`, `API_KEY_2`, `API_KEY_3` (Google Gemini)
  - `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` (Naver Search API; place name → address)
  - `NCP_CLIENT_ID`, `NCP_CLIENT_SECRET` (Naver Cloud Maps for directions)

- Netlify (Next.js)
  - `NEXT_PUBLIC_AEYE_UI_ORIGIN` = HTTPS origin of your A‑EYE backend (ngrok or server)
  - (optional) `AEYE_API_ORIGIN` if you later add API proxy rewrites
  - (optional) `APPS_SCRIPT_URL` for visitor/advice logging

---

## Directory layout (key parts)
- `app/aeye/page.jsx`: iframe demo page for A‑EYE
- `final_function_aeye/A-Eye/`: Flask backend
  - `server.py`: main server (Gemini, routes, navigation, depth analysis)
  - `requirements.txt`: Python deps
  - `templates/index.html`, `static/`: A‑EYE UI
  - `depth_anything_v2/`: Depth model implementation
  - `checkpoints/`: put model file here

---

## Troubleshooting
- Camera/mic not working: ensure HTTPS and browser permissions granted.
- Depth analysis disabled: model checkpoint missing; see the path above.
- CORS/iframe blocked: remove `X-Frame-Options: DENY` from any reverse proxy.
- ngrok URL changed: update Netlify env var and redeploy.
- GPU usage: confirm with `python -c "import torch; print(torch.cuda.is_available())"`.

---

# Next.js on Netlify Platform Starter

[Live Demo](https://nextjs-platform-starter.netlify.app/)

A modern starter based on Next.js 16 (App Router), Tailwind, and [Netlify Core Primitives](https://docs.netlify.com/core/overview/#develop) (Edge Functions, Image CDN, Blob Store).

In this site, Netlify Core Primitives are used both implictly for running Next.js features (e.g. Route Handlers, image optimization via `next/image`, and more) and also explicitly by the user code.

Implicit usage means you're using any Next.js functionality and everything "just works" when deployed - all the plumbing is done for you. Explicit usage is framework-agnostic and typically provides more features than what Next.js exposes.

## Deploying to Netlify

Click the button below to deploy this template to your Netlify account.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JunseongLEEE/next-platform-starter)

## Developing Locally

1. Clone this repository, then run `npm install` in its root directory.

2. For the starter to have full functionality locally (e.g. edge functions, blob store), please ensure you have an up-to-date version of Netlify CLI. Run:

```
npm install netlify-cli@latest -g
```

3. Link your local repository to the deployed Netlify site. This will ensure you're using the same runtime version for both local development and your deployed site.

```
netlify link
```

4. Then, run the Next.js development server via Netlify CLI:

```
netlify dev
```

If your browser doesn't navigate to the site automatically, visit [localhost:8888](http://localhost:8888).

## Resources

- Check out the [Next.js on Netlify docs](https://docs.netlify.com/frameworks/next-js/overview/)
