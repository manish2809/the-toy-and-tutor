# 🚀 Quick Start - Deploy to Render

This folder contains all production-ready files for "The Toy and Tutor" app.

## ⚠️ Don't Have Git Installed?

**No problem!** See `DEPLOY_WITHOUT_GIT.md` for easy deployment without Git.

Or install Git in 5 minutes: See `INSTALL_GIT.md`

---

## 📁 Files Included

✅ `server.js` - Main server file
✅ `package.json` - Dependencies
✅ `package-lock.json` - Locked dependencies
✅ `public/` - Frontend files (HTML, CSS, JS)
✅ `.gitignore` - Git ignore rules
✅ `vercel.json` - Vercel config
✅ `Procfile` - Heroku config
✅ `README.md` - Full documentation
✅ `DEPLOYMENT.md` - Detailed deployment guide

---

## 🎯 Deploy to Render (Recommended)

### Step 1: Push to GitHub

```bash
cd git
git init
git add .
git commit -m "Initial commit - The Toy and Tutor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-toy-and-tutor.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository: `the-toy-and-tutor`
5. Configure:
   - **Name:** the-toy-and-tutor
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free
6. Add Environment Variable:
   - **Key:** `JWT_SECRET`
   - **Value:** `your-secret-key-here-12345`
7. Click "Create Web Service"
8. Wait 2-3 minutes
9. Your app is live! 🎉

---

## 🌐 Your Live URL

After deployment:
```
https://the-toy-and-tutor.onrender.com
```

---

## ✅ What's Included

- 25 Smartivity STEM toys with images
- 12 tutors in Sholinganallur with ratings
- Shopping cart & checkout
- Service booking system
- Location-based filtering
- Mobile responsive design
- Beautiful purple gradient UI

---

## 📱 Test Your App

1. Open the Render URL
2. Register a new account
3. Create child profile:
   - Location: Chennai
   - Area: Sholinganallur
4. Browse products and services
5. Add to cart
6. Book services
7. Test on mobile!

---

## 🆘 Need Help?

See `DEPLOYMENT.md` for detailed instructions.

---

## 🎉 That's It!

Your POC is ready to share with stakeholders!
