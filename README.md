# Hassan Mehdi — Portfolio Website

Complete professional portfolio with a **React-free** frontend (HTML + CSS + Bootstrap)
and a **Node.js + Express + MongoDB** backend for contact form with email notifications.

---

## 📁 Folder Structure

```
Hassan_Portfolio/
│
├── frontend/                   ← Open this in browser / deploy to Vercel
│   ├── index.html              ← Main HTML (all sections)
│   ├── css/
│   │   └── style.css           ← All custom styles + dark/light theme
│   ├── js/
│   │   └── main.js             ← All interactions + form submission
│   └── assets/                 ← ★ PUT YOUR CV FILE HERE
│       └── Hassan_Mehdi_CV.pdf ← (place your PDF here)
│
├── backend/                    ← Run this on a server / deploy to Render
│   ├── server.js               ← Express app entry point
│   ├── package.json            ← Dependencies
│   ├── .env.example            ← Environment variables template
│   ├── .gitignore
│   ├── models/
│   │   └── Contact.js          ← MongoDB schema for messages
│   └── routes/
│       └── contact.js          ← POST /api/contact handler
│
└── README.md                   ← This file
```

---

## ★ HOW TO ADD YOUR CV (Download Feature)

**Step 1** — Export your CV as a PDF from Canva, Word, or any tool.

**Step 2** — Rename the file to:
```
Hassan_Mehdi_CV.pdf
```

**Step 3** — Place it inside:
```
Hassan_Portfolio/frontend/assets/Hassan_Mehdi_CV.pdf
```

**Step 4** — That's it! The Download CV buttons in the Hero and About sections already
point to `assets/Hassan_Mehdi_CV.pdf`. No code changes needed.

> **Tip:** When you update your CV, just replace the PDF with the same filename
> and the download link automatically gives the latest version.

---

## ★ HOW TO RECEIVE FORM MESSAGES (Email Notifications)

When someone fills out your contact form, you will:
1. Get an **instant email notification** with their name, email, subject, and message
2. The message is also **saved to your MongoDB database**
3. The visitor gets an **auto-reply email** confirming you received their message

### STEP 1 — Set Up Gmail App Password

> You need this instead of your regular password for security.

1. Go to **myaccount.google.com**
2. Click **Security** → Turn on **2-Step Verification** (if not already on)
3. Go to **Security → App Passwords**
4. Choose **Mail** as the app → **Generate**
5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

---

### STEP 2 — Set Up MongoDB Atlas (Free)

1. Go to **https://cloud.mongodb.com** and sign up (free)
2. Create a new **Project** → **Create Cluster** (free tier M0)
3. Click **Connect** → **Drivers** → copy the connection string
4. It looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio
   ```
5. Save this — you need it for the next step

---

### STEP 3 — Configure Environment Variables

1. Open the `backend/` folder
2. Copy `.env.example` and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and fill in all values:

```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/portfolio
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_RECEIVER=yourgmail@gmail.com
CLIENT_URL=http://127.0.0.1:5500
```

> **EMAIL_USER** — Gmail that SENDS the notification  
> **EMAIL_PASS** — The 16-char App Password (NOT your real password)  
> **EMAIL_RECEIVER** — Where you RECEIVE the notification (can be same as EMAIL_USER)

---

### STEP 4 — Run the Backend Locally

```bash
# 1. Go into backend folder
cd Hassan_Portfolio/backend

# 2. Install packages (first time only)
npm install

# 3. Start development server (auto-restarts on changes)
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on http://localhost:5000
```

---

### STEP 5 — Open the Frontend

Open `frontend/index.html` in your browser using **Live Server** (VS Code extension)
or any local server. The form will now send messages to your backend.

> **Important:** The frontend sends to `http://localhost:5000/api/contact` by default.
> This is set at the top of `frontend/js/main.js` in the `CONFIG` object.

---

## 🚀 DEPLOYMENT (Make It Live on the Internet)

### Deploy Frontend → Vercel (Free)

1. Push `frontend/` folder to a GitHub repository
2. Go to **vercel.com** → Import your GitHub repo
3. Vercel auto-detects static site → Click **Deploy**
4. Done! Your frontend is live at `https://your-project.vercel.app`

---

### Deploy Backend → Render (Free)

1. Push `backend/` folder to GitHub (a separate repo or subfolder)
2. Go to **render.com** → New → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add your environment variables in the Render dashboard (same as your `.env` file)
6. Click **Deploy** → Your API is live at `https://your-app.onrender.com`

---

### Update Frontend API URL

After deploying backend, open `frontend/js/main.js` and update:

```javascript
// Line ~18 in main.js — change this:
API_URL: 'http://localhost:5000/api/contact',

// To your Render URL:
API_URL: 'https://your-app.onrender.com/api/contact',
```

Also update `CLIENT_URL` in your Render environment variables to your Vercel URL:
```
CLIENT_URL=https://your-portfolio.vercel.app
```

---

## 🔧 CUSTOMIZATION CHECKLIST

Open these files and replace placeholder values:

### frontend/index.html
- [ ] Replace `hassanmehdi@gmail.com` with your email
- [ ] Replace `+92 300 0000000` with your WhatsApp number
- [ ] Replace `fiverr.com/hassanmehdi` with your Fiverr profile link
- [ ] Replace `#` in social links with your GitHub, LinkedIn, WhatsApp, Twitter URLs
- [ ] Replace project `href="#"` with your real live demo and GitHub links

### frontend/js/main.js
- [ ] Update `CONFIG.API_URL` to your deployed backend URL (after deployment)
- [ ] Update `CONFIG.typedPhrases` to your own custom phrases

### frontend/assets/
- [ ] Add `Hassan_Mehdi_CV.pdf` (your CV file)

### backend/.env
- [ ] Fill in all 5 environment variables

### backend/routes/contact.js
- [ ] Update GitHub, LinkedIn, Fiverr links in the auto-reply email template

---

## 📦 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | HTML5, CSS3, Bootstrap 5|
| Fonts      | Syne, Space Mono, DM Sans (Google Fonts) |
| Icons      | Bootstrap Icons         |
| Backend    | Node.js, Express.js     |
| Database   | MongoDB (Mongoose)      |
| Email      | Nodemailer + Gmail SMTP |
| Deployment | Vercel + Render         |

---

## 🧪 Test the API

After starting the backend, test it with this command:

```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","subject":"Hello","message":"This is a test message from the portfolio."}'
```

Expected response:
```json
{
  "success": true,
  "message": "Message received! Hassan will reply within 24 hours."
}
```

---

## 📞 Support

If you run into any issues:
- Check the terminal running the backend for error messages
- Make sure `.env` is filled in correctly (no quotes needed around values)
- Make sure MongoDB Atlas allows connections from anywhere (Network Access → 0.0.0.0/0)
- Make sure Gmail 2-Step Verification is ON before generating an App Password
