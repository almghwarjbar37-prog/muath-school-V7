require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const session    = require('express-session');
const MongoStore = require('connect-mongo');
const path       = require('path');

const app = express();

// ── Connect to MongoDB ─────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected - server.js:12'))
  .catch(err => console.error('❌ MongoDB error: - server.js:13', err));

// ── Middleware ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/news',     require('./routes/news'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/staff',    require('./routes/staff'));

// ── Serve HTML pages ───────────────────────────────────────
const pages = ['index', 'about', 'news', 'contact', 'admin', 'login'];
pages.forEach(p => {
  app.get(p === 'index' ? ['/', '/index'] : `/${p}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${p}.html`));
  });
});

// ── Seed admin on first run ────────────────────────────────
const User = require('./models/User');
async function seedAdmin() {
  const exists = await User.findOne({ role: 'admin' });
  if (!exists) {
    const bcrypt = require('bcryptjs');
    const hash   = await bcrypt.hash('Admin@2026', 10);
    await User.create({
      name: 'مدير النظام',
      email: 'admin@muath-school.edu.jo',
      password: hash,
      role: 'admin'
    });
    console.log('✅ Admin seeded  email: admin@muathschool.edu.jo | pass: Admin@2026 - server.js:56');
  }
}
mongoose.connection.once('open', seedAdmin);

// ── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} - server.js:65`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is busy, trying another port... - server.js:68`);
    app.listen(PORT + 1, () => {
      console.log(`🚀 Server running on http://localhost:${PORT + 1} - server.js:70`);
    });
  } else {
    console.error(err);
  }
});
