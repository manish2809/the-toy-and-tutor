const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DB_PATH = path.join(__dirname, 'learning.db');

let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Database
async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
    console.log('✅ Database loaded');
  } else {
    db = new SQL.Database();
    console.log('✅ New database created');
    
    // Create tables
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        child_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        grade INTEGER NOT NULL,
        board TEXT NOT NULL,
        interests TEXT NOT NULL,
        location TEXT,
        apartment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        age_min INTEGER,
        age_max INTEGER,
        grade_min INTEGER,
        grade_max INTEGER,
        interests TEXT,
        image_url TEXT
      );

      CREATE TABLE services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        tutor_name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        age_min INTEGER,
        age_max INTEGER,
        location TEXT,
        address TEXT,
        rating REAL DEFAULT 4.5,
        reviews_count INTEGER DEFAULT 0,
        interests TEXT,
        experience TEXT,
        qualifications TEXT,
        area TEXT
      );

      CREATE TABLE cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      CREATE TABLE bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        service_id INTEGER NOT NULL,
        booking_type TEXT NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      );
    `);
    
    // Insert sample products - Smartivity-inspired STEM toys
    const products = [
      ['Smartivity Robotic Mechanical Hand', 'STEM Toy', 'Build a working robotic hand with hydraulic mechanism - Learn engineering and mechanics', 1499, 8, 14, 3, 9, 'Science,Technology,Building', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'],
      ['Smartivity Hydraulic Plane Launcher', 'STEM Toy', 'Launch planes using hydraulic power - Understand physics and aerodynamics', 1299, 7, 13, 2, 8, 'Science,Math,Building', 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=400'],
      ['Smartivity Space Shooter Game', 'STEM Toy', 'DIY arcade game teaching projectile motion and angles', 1599, 8, 14, 3, 9, 'Math,Science', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'],
      ['Smartivity Parabolic Basketball', 'STEM Toy', 'Learn parabolic curves while playing basketball', 1399, 7, 12, 2, 7, 'Math,Sports', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'],
      ['Smartivity Vortex Cannon', 'STEM Toy', 'Create air vortex rings and learn about air pressure', 999, 6, 11, 1, 6, 'Science', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400'],
      ['Smartivity Microscope 100x', 'STEM Toy', 'Real working microscope for young scientists', 1899, 9, 15, 4, 10, 'Science', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400'],
      ['Smartivity Hydraulic Crane', 'STEM Toy', 'Build a functional crane using hydraulic principles', 1599, 8, 14, 3, 9, 'Science,Building,Math', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'],
      ['Smartivity Foosball Table', 'STEM Toy', 'DIY tabletop foosball game - Learn mechanics and strategy', 1799, 7, 14, 2, 9, 'Math,Sports', 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400'],
      ['Smartivity Globe Trotter', 'STEM Toy', 'Explore geography and mechanics with this moving globe', 1299, 6, 12, 1, 7, 'Science,Math', 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400'],
      ['Smartivity Bulls Eye Bow', 'STEM Toy', 'Archery set teaching trajectory and precision', 1199, 7, 13, 2, 8, 'Math,Sports,Science', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
      ['Smartivity Gravity Transporter', 'STEM Toy', 'Understand gravity and motion with this marble run', 1399, 6, 11, 1, 6, 'Science,Math', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400'],
      ['Smartivity Pinball Machine', 'STEM Toy', 'Build your own pinball machine - Learn angles and momentum', 1699, 8, 14, 3, 9, 'Math,Science', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'],
      ['Smartivity Music Machine', 'STEM Toy', 'Create music with mechanical instruments', 1499, 6, 12, 1, 7, 'Music,Science,Art', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400'],
      ['Smartivity Roller Coaster', 'STEM Toy', 'Build a working roller coaster and learn about energy', 1899, 8, 14, 3, 9, 'Science,Math,Building', 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400'],
      ['Smartivity Catapult', 'STEM Toy', 'Medieval catapult teaching force and motion', 999, 6, 11, 1, 6, 'Science,Math', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400'],
      ['Smartivity Kaleidoscope', 'STEM Toy', 'Explore symmetry and light reflection', 799, 5, 10, 1, 5, 'Science,Art,Math', 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400'],
      ['Smartivity Marble Climber', 'STEM Toy', 'Defying gravity marble machine', 1299, 7, 12, 2, 7, 'Science,Math', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400'],
      ['Smartivity Mechanical Safe', 'STEM Toy', 'Build a working safe with combination lock', 1599, 9, 14, 4, 9, 'Math,Science,Building', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400'],
      ['Smartivity Solar System Model', 'STEM Toy', 'Motorized solar system teaching astronomy', 1799, 8, 13, 3, 8, 'Science', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400'],
      ['Smartivity Wind-Powered Car', 'STEM Toy', 'Build a car powered by wind energy', 1099, 6, 11, 1, 6, 'Science,Technology', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400'],
      ['Smartivity Pneumatic Lift', 'STEM Toy', 'Learn about air pressure with working lift', 1399, 8, 13, 3, 8, 'Science,Math,Building', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'],
      ['Smartivity Gear Machine', 'STEM Toy', 'Understand gear ratios and mechanical advantage', 1199, 7, 12, 2, 7, 'Math,Science,Building', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'],
      ['Smartivity Pendulum Clock', 'STEM Toy', 'Working clock teaching time and oscillation', 1499, 8, 13, 3, 8, 'Math,Science', 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=400'],
      ['Smartivity Periscope', 'STEM Toy', 'Build a periscope and learn about light reflection', 899, 6, 11, 1, 6, 'Science', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'],
      ['Smartivity Balancing Act', 'STEM Toy', 'Learn center of gravity with balancing sculptures', 999, 6, 11, 1, 6, 'Science,Math,Art', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']
    ];
    
    products.forEach(p => {
      db.run('INSERT INTO products (name, category, description, price, age_min, age_max, grade_min, grade_max, interests, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', p);
    });
    
    // Insert sample services - All in Sholinganallur, Chennai
    const services = [
      ['Math Tutor - Olympiad Prep', 'Rajesh Kumar', 'Academic', 'Expert Math tutor specializing in Olympiad preparation', 800, 8, 14, 'Chennai', 'Shop 12, Sunshine Apartments, Sholinganallur', 4.8, 45, 'Math', '8 years', 'M.Sc Mathematics, IIT Madras', 'Sholinganallur'],
      ['Swimming Classes', 'Priya Sharma', 'Sports', 'Professional swimming coach for beginners to advanced', 1200, 5, 15, 'Chennai', 'Aqua Sports Complex, Sholinganallur Main Road', 4.9, 78, 'Sports,Swimming', '10 years', 'National Swimming Coach Certification', 'Sholinganallur'],
      ['Tamil Language Tutor', 'Lakshmi Iyer', 'Academic', 'Native Tamil speaker with expertise in literature and grammar', 600, 6, 12, 'Chennai', 'Flat 301, Tamil Nadu Apartments, Sholinganallur', 4.7, 32, 'Tamil,Language', '6 years', 'M.A Tamil Literature', 'Sholinganallur'],
      ['Drawing & Painting Classes', 'Amit Verma', 'Arts', 'Professional artist teaching various art techniques', 700, 5, 14, 'Chennai', 'Art Studio, Sholinganallur OMR', 4.6, 56, 'Art,Drawing', '12 years', 'BFA from Chennai College of Art', 'Sholinganallur'],
      ['Science Tutor - CBSE', 'Dr. Meena Patel', 'Academic', 'Experienced science teacher for CBSE curriculum', 750, 10, 14, 'Chennai', 'Wisdom Academy, Sholinganallur Phase 2', 4.9, 89, 'Science', '15 years', 'Ph.D. in Physics, Former CBSE examiner', 'Sholinganallur'],
      ['Chess Coaching', 'Vikram Singh', 'Sports', 'FIDE rated chess coach for strategic thinking', 500, 6, 16, 'Chennai', 'Chess Club, Sholinganallur IT Park', 4.8, 67, 'Chess,Strategy', '9 years', 'FIDE Instructor, State Champion', 'Sholinganallur'],
      ['Coding Classes - Python', 'Neha Gupta', 'Technology', 'Learn Python programming from basics to advanced', 900, 9, 15, 'Chennai', 'Tech Hub, Sholinganallur Tech Park', 4.9, 92, 'Coding,Technology', '7 years', 'B.Tech CSE, Software Engineer', 'Sholinganallur'],
      ['English Speaking & Grammar', 'Sarah D\'Souza', 'Academic', 'Improve English communication and grammar skills', 650, 7, 13, 'Chennai', 'Language Center, Sholinganallur Main Road', 4.7, 54, 'English,Reading', '8 years', 'M.A English, Cambridge Certified', 'Sholinganallur'],
      ['Music Classes - Keyboard', 'Ravi Shankar', 'Arts', 'Learn keyboard and music theory from beginner level', 800, 6, 14, 'Chennai', 'Melody Music School, Sholinganallur', 4.8, 41, 'Music', '11 years', 'Trinity College Certified', 'Sholinganallur'],
      ['Karate Classes', 'Sensei Tanaka', 'Sports', 'Traditional karate training for discipline and fitness', 1000, 6, 15, 'Chennai', 'Martial Arts Dojo, Sholinganallur Phase 1', 4.9, 73, 'Sports', '14 years', 'Black Belt 4th Dan, International Instructor', 'Sholinganallur'],
      ['Robotics Workshop', 'Arjun Reddy', 'Technology', 'Build and program robots with Arduino and sensors', 1100, 10, 16, 'Chennai', 'Innovation Lab, Sholinganallur IT Corridor', 4.8, 38, 'Coding,Science,Technology', '6 years', 'B.E Robotics, IIT Madras', 'Sholinganallur'],
      ['Dance Classes - Bharatanatyam', 'Anjali Krishnan', 'Arts', 'Classical Bharatanatyam dance training', 750, 5, 14, 'Chennai', 'Natya Academy, Sholinganallur', 4.9, 61, 'Dance,Art', '13 years', 'Arangetram completed, Kalakshetra trained', 'Sholinganallur']
    ];
    
    services.forEach(s => {
      db.run('INSERT INTO services (name, tutor_name, category, description, price, age_min, age_max, location, address, rating, reviews_count, interests, experience, qualifications, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', s);
    });
    
    saveDatabase();
  }
}

function saveDatabase() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    const existing = db.exec('SELECT id FROM users WHERE email = ?', [email]);
    if (existing[0]?.values.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
    saveDatabase();
    
    const result = db.exec('SELECT id, email, name FROM users WHERE email = ?', [email]);
    const user = result[0].values[0];
    
    const token = jwt.sign({ userId: user[0], email: user[1] }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user[0], email: user[1], name: user[2] } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = db.exec('SELECT id, email, name, password FROM users WHERE email = ?', [email]);
    if (!result[0] || result[0].values.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = result[0].values[0];
    const validPassword = await bcrypt.compare(password, user[3]);
    
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user[0], email: user[1] }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user[0], email: user[1], name: user[2] } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profiles', authenticateToken, (req, res) => {
  try {
    const { childName, age, grade, board, interests, location, apartment } = req.body;
    
    console.log('Creating profile:', { childName, age, grade, board, interests, location, apartment });
    
    db.run('INSERT INTO profiles (user_id, child_name, age, grade, board, interests, location, apartment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, childName, age, grade, board, interests.join(','), location || '', apartment || '']);
    saveDatabase();
    
    const result = db.exec('SELECT * FROM profiles WHERE user_id = ? ORDER BY id DESC LIMIT 1', [req.user.userId]);
    
    if (!result[0] || result[0].values.length === 0) {
      throw new Error('Failed to retrieve created profile');
    }
    
    const profile = result[0].values[0];
    
    console.log('Profile created successfully:', profile[0]);
    
    res.json({
      id: profile[0],
      childName: profile[2],
      age: profile[3],
      grade: profile[4],
      board: profile[5],
      interests: profile[6].split(','),
      location: profile[7] || '',
      apartment: profile[8] || ''
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles', authenticateToken, (req, res) => {
  try {
    const result = db.exec('SELECT * FROM profiles WHERE user_id = ?', [req.user.userId]);
    
    if (!result[0] || result[0].values.length === 0) {
      return res.json([]);
    }
    
    const profiles = result[0].values.map(p => ({
      id: p[0],
      childName: p[2],
      age: p[3],
      grade: p[4],
      board: p[5],
      interests: p[6].split(','),
      location: p[7] || '',
      apartment: p[8] || ''
    }));
    
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profiles/:profileId', authenticateToken, (req, res) => {
  try {
    const { childName, age, grade, board, interests, location, apartment } = req.body;
    const profileId = req.params.profileId;
    
    console.log('Updating profile:', profileId, { childName, age, grade, board, interests, location, apartment });
    
    // Verify profile belongs to user
    const checkResult = db.exec('SELECT id FROM profiles WHERE id = ? AND user_id = ?', 
      [profileId, req.user.userId]);
    
    if (!checkResult[0] || checkResult[0].values.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Update profile
    db.run(
      'UPDATE profiles SET child_name = ?, age = ?, grade = ?, board = ?, interests = ?, location = ?, apartment = ? WHERE id = ?',
      [childName, age, grade, board, interests.join(','), location || '', apartment || '', profileId]
    );
    saveDatabase();
    
    // Get updated profile
    const result = db.exec('SELECT * FROM profiles WHERE id = ?', [profileId]);
    const profile = result[0].values[0];
    
    console.log('Profile updated successfully');
    
    res.json({
      id: profile[0],
      childName: profile[2],
      age: profile[3],
      grade: profile[4],
      board: profile[5],
      interests: profile[6].split(','),
      location: profile[7] || '',
      apartment: profile[8] || ''
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recommendations/:profileId', authenticateToken, (req, res) => {
  try {
    console.log('Getting recommendations for profile:', req.params.profileId);
    
    const profileResult = db.exec('SELECT * FROM profiles WHERE id = ? AND user_id = ?', 
      [req.params.profileId, req.user.userId]);
    
    if (!profileResult[0] || profileResult[0].values.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const profile = profileResult[0].values[0];
    const age = profile[3];
    const grade = profile[4];
    const interests = profile[6].split(',').map(i => i.trim());
    const userArea = (profile[8] || '').toLowerCase().trim();
    
    console.log('Profile details:', { age, grade, interests, userArea });
    
    // Get all products first
    const allProductsResult = db.exec('SELECT * FROM products');
    let products = [];
    
    if (allProductsResult[0] && allProductsResult[0].values.length > 0) {
      products = allProductsResult[0].values
        .filter(p => {
          const ageMatch = p[5] <= age && p[6] >= age;
          const gradeMatch = p[7] <= grade && p[8] >= grade;
          return ageMatch && gradeMatch;
        })
        .filter(p => {
          if (!p[9]) return false;
          const productInterests = p[9].split(',').map(i => i.trim());
          return interests.some(i => productInterests.includes(i));
        })
        .map(p => ({
          id: p[0],
          name: p[1],
          category: p[2],
          description: p[3],
          price: p[4],
          interests: p[9],
          imageUrl: p[10]
        }));
    }
    
    console.log('Found products:', products.length);
    
    // Get all services filtered by area
    const allServicesResult = db.exec('SELECT * FROM services');
    let services = [];
    
    if (allServicesResult[0] && allServicesResult[0].values.length > 0) {
      services = allServicesResult[0].values
        .filter(s => {
          const ageMatch = s[6] <= age && s[7] >= age;
          return ageMatch;
        })
        .filter(s => {
          // Filter by area - only show Sholinganallur services
          const serviceArea = (s[15] || '').toLowerCase().trim();
          return serviceArea === 'sholinganallur';
        })
        .filter(s => {
          if (!s[12]) return false;
          const serviceInterests = s[12].split(',').map(i => i.trim());
          return interests.some(i => serviceInterests.includes(i));
        })
        .map(s => ({
          id: s[0],
          name: s[1],
          tutorName: s[2],
          category: s[3],
          description: s[4],
          price: s[5],
          location: s[8],
          address: s[9],
          rating: s[10],
          reviewsCount: s[11],
          interests: s[12],
          experience: s[13],
          qualifications: s[14],
          area: s[15]
        }));
    }
    
    console.log('Found services:', services.length);
    
    res.json({ products, services });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cart endpoints
app.get('/api/cart', authenticateToken, (req, res) => {
  try {
    const result = db.exec(`
      SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url, p.description
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.userId]);
    
    if (!result[0] || result[0].values.length === 0) {
      return res.json([]);
    }
    
    const cartItems = result[0].values.map(item => ({
      id: item[0],
      productId: item[1],
      quantity: item[2],
      name: item[3],
      price: item[4],
      imageUrl: item[5],
      description: item[6],
      total: item[4] * item[2]
    }));
    
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', authenticateToken, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if product already in cart
    const existing = db.exec('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', 
      [req.user.userId, productId]);
    
    if (existing[0] && existing[0].values.length > 0) {
      // Update quantity
      const newQuantity = existing[0].values[0][1] + quantity;
      db.run('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, existing[0].values[0][0]]);
    } else {
      // Add new item
      db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.userId, productId, quantity]);
    }
    
    saveDatabase();
    res.json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:itemId', authenticateToken, (req, res) => {
  try {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.itemId, req.user.userId]);
    saveDatabase();
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Checkout endpoint
app.post('/api/checkout', authenticateToken, (req, res) => {
  try {
    const { paymentMethod } = req.body;
    
    // Get cart items
    const cartResult = db.exec(`
      SELECT c.product_id, c.quantity, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.userId]);
    
    if (!cartResult[0] || cartResult[0].values.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate total
    const items = cartResult[0].values;
    const totalAmount = items.reduce((sum, item) => sum + (item[2] * item[1]), 0);
    
    // Create order
    db.run('INSERT INTO orders (user_id, total_amount, status, payment_method) VALUES (?, ?, ?, ?)',
      [req.user.userId, totalAmount, 'completed', paymentMethod]);
    saveDatabase();
    
    const orderResult = db.exec('SELECT id FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 1', 
      [req.user.userId]);
    const orderId = orderResult[0].values[0][0];
    
    // Add order items
    items.forEach(item => {
      db.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item[0], item[1], item[2]]);
    });
    
    // Clear cart
    db.run('DELETE FROM cart WHERE user_id = ?', [req.user.userId]);
    saveDatabase();
    
    res.json({ message: 'Order placed successfully', orderId, totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Booking endpoints
app.post('/api/bookings', authenticateToken, (req, res) => {
  try {
    const { serviceId, bookingType, bookingDate, bookingTime } = req.body;
    
    db.run('INSERT INTO bookings (user_id, service_id, booking_type, booking_date, booking_time) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, serviceId, bookingType, bookingDate, bookingTime]);
    saveDatabase();
    
    res.json({ message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  try {
    const result = db.exec(`
      SELECT b.id, b.booking_type, b.booking_date, b.booking_time, b.status,
             s.name, s.tutor_name, s.address, s.price
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.userId]);
    
    if (!result[0] || result[0].values.length === 0) {
      return res.json([]);
    }
    
    const bookings = result[0].values.map(b => ({
      id: b[0],
      bookingType: b[1],
      bookingDate: b[2],
      bookingTime: b[3],
      status: b[4],
      serviceName: b[5],
      tutorName: b[6],
      address: b[7],
      price: b[8]
    }));
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
