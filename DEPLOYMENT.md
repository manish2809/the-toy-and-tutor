# Deployment Guide - The Toy and Tutor

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow prompts:**
   - Link to existing project? No
   - Project name: the-toy-and-tutor
   - Directory: ./
   - Override settings? No

4. **Done!** Your app will be live at: `https://your-app.vercel.app`

**Note:** Vercel has serverless limitations. Database will reset on each deployment.

---

### Option 2: Render (Best for POC with persistent database)

1. **Go to** [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repo (or upload files)
   - Name: the-toy-and-tutor
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`

3. **Add Environment Variables:**
   - `JWT_SECRET`: your-secret-key-here
   - `PORT`: 3000

4. **Deploy!** Your app will be at: `https://the-toy-and-tutor.onrender.com`

**Pros:** Free tier, persistent storage, auto-deploy from Git

---

### Option 3: Railway

1. **Go to** [railway.app](https://railway.app)

2. **New Project → Deploy from GitHub**
   - Select your repository
   - Railway auto-detects Node.js

3. **Add Environment Variables:**
   - `JWT_SECRET`: your-secret-key-here

4. **Deploy!** Railway provides a URL automatically

**Pros:** Very simple, good free tier, persistent storage

---

### Option 4: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
heroku create the-toy-and-tutor
```

3. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your-secret-key-here
```

4. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

5. **Open App**
```bash
heroku open
```

---

## Local Testing Before Deploy

```bash
# Install dependencies
npm install

# Start server
npm start

# Open browser
http://localhost:3000
```

---

## Environment Variables Needed

- `PORT` - Server port (auto-set by most platforms)
- `JWT_SECRET` - Secret key for JWT tokens (set a strong random string)

---

## Files Included for Deployment

- ✅ `vercel.json` - Vercel configuration
- ✅ `Procfile` - Heroku configuration
- ✅ `.gitignore` - Ignore node_modules and database
- ✅ `package.json` - Dependencies and scripts

---

## Post-Deployment Checklist

1. ✅ App loads successfully
2. ✅ Can register new user
3. ✅ Can create child profile
4. ✅ Products display with images
5. ✅ Services show for Sholinganallur area
6. ✅ Can add products to cart
7. ✅ Can book services
8. ✅ Mobile responsive

---

## Troubleshooting

### Database resets on each deploy
- **Solution:** Use Render or Railway (persistent storage)
- Or add a proper database service (PostgreSQL, MongoDB)

### CORS errors
- Check that CORS is enabled in server.js (already done)

### Images not loading
- Images use Unsplash CDN (should work everywhere)

### Port issues
- App uses `process.env.PORT` (auto-configured by platforms)

---

## Recommended: Render Deployment

**Why Render?**
- ✅ Free tier available
- ✅ Persistent file storage (database won't reset)
- ✅ Auto-deploy from Git
- ✅ Easy to use
- ✅ Good for POC/demos

**Steps:**
1. Push code to GitHub
2. Go to render.com
3. New Web Service → Connect GitHub
4. Deploy!

---

## Demo URL Structure

After deployment, your app will be accessible at:
- Vercel: `https://the-toy-and-tutor.vercel.app`
- Render: `https://the-toy-and-tutor.onrender.com`
- Railway: `https://the-toy-and-tutor.up.railway.app`
- Heroku: `https://the-toy-and-tutor.herokuapp.com`

---

## Need Help?

1. Check platform-specific docs
2. Ensure all dependencies are in package.json
3. Check server logs for errors
4. Verify environment variables are set

---

## Production Considerations (Future)

For a production app, consider:
- Use PostgreSQL/MongoDB instead of SQLite
- Add Redis for caching
- Implement proper authentication
- Add rate limiting
- Use environment-specific configs
- Add monitoring/logging
- Implement backup strategy
