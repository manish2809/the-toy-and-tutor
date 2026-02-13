# The Toy and Tutor

A personalized learning ecosystem platform featuring Smartivity STEM toys and local tutors/coaches.

## 🚀 Quick Deploy (POC)

### Easiest: One-Click Deploy

**Option 1: Vercel (Fastest)**
```bash
npm install -g vercel
vercel
```

**Option 2: Render (Best for POC)**
1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub
3. Deploy!

**Option 3: Railway**
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Done!

📖 **Full deployment guide:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Features

- **User Authentication**: Secure login and registration
- **Child Profile with Location**: Age, grade, board, interests, location, and apartment
- **25 Smartivity STEM Toys**: Real products with images
- **12 Tutors/Coaches**: In Sholinganallur area with ratings, reviews, and addresses
- **Shopping Cart**: Add products and checkout
- **Service Booking**: Book intro sessions or classes
- **Smart Recommendations**: Based on child's profile and location
- **Separate Tabs**: Products, Services, and Profile management
- **Mobile Responsive**: Works perfectly on all devices

## Local Development

### Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Start server:**
```bash
npm start
```

3. **Open browser:**
```
http://localhost:3000
```

### First Time Setup

1. **Register**: Create a new account
2. **Create Profile**: Fill in child's details including:
   - Name, Age, Grade, Board
   - Interests (select multiple)
   - Location: Chennai
   - Apartment/Area: Sholinganallur
3. **View Recommendations**: 
   - Products tab: 25 Smartivity STEM toys with images
   - Services tab: 12 tutors in Sholinganallur with ratings
   - Profile tab: View and edit profile

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: SQLite (sql.js)
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: JWT + bcrypt
- **Images**: Unsplash CDN

## Sample Data

### Products (25 Smartivity STEM Toys)
- Robotic Mechanical Hand (₹1,499)
- Hydraulic Plane Launcher (₹1,299)
- Space Shooter Game (₹1,599)
- Microscope 100x (₹1,899)
- Roller Coaster (₹1,899)
- And 20 more...

### Services (12 Tutors/Coaches in Sholinganallur)
- Math Olympiad Tutor (4.8★, 45 reviews)
- Swimming Coach (4.9★, 78 reviews)
- Tamil Language Tutor (4.7★, 32 reviews)
- Coding Classes (4.9★, 92 reviews)
- And 8 more...

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Profiles
- `GET /api/profiles` - Get user's profiles
- `POST /api/profiles` - Create child profile
- `PUT /api/profiles/:id` - Update profile

### Recommendations
- `GET /api/recommendations/:profileId` - Get personalized products and services

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:itemId` - Remove from cart
- `POST /api/checkout` - Checkout and create order

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Book a service

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
```bash
# Vercel
vercel

# Or use the batch file
deploy-vercel.bat
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens

## Troubleshooting

### "No such column: location" error
- Delete the `learning.db` file
- Restart the server

### Can't see STEM toys
- Create a profile with interests (Math, Science, Building, etc.)
- Restart server to reload products

### Services not showing
- Make sure location includes "Sholinganallur"
- All services are in Sholinganallur area only

## License

MIT

---

## 📱 Mobile Optimized

The app is fully responsive and works perfectly on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktops

## 🎯 Perfect for POC/Demo

This app is ready to deploy as a proof of concept with:
- ✅ Real product data (Smartivity toys)
- ✅ Location-based services
- ✅ Shopping cart functionality
- ✅ Booking system
- ✅ Beautiful UI
- ✅ Mobile responsive
- ✅ Easy to deploy
