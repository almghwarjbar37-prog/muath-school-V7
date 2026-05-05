const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'كلمة المرور 6 أحرف على الأقل' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم مسبقاً' });

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hash });
    const token = signToken(user._id);

    req.session.token = token;
    req.session.user  = { id: user._id, name: user.name, role: user.role };

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم', error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'البريد وكلمة المرور مطلوبان' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'بيانات غير صحيحة' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'بيانات غير صحيحة' });

    const token = signToken(user._id);
    req.session.token = token;
    req.session.user  = { id: user._id, name: user.name, role: user.role };

    res.json({ success: true, token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'تم تسجيل الخروج' });
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
