const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1] || req.session?.token;
    if (!token) return res.status(401).json({ success: false, message: 'غير مصرح — يرجى تسجيل الدخول' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'رمز غير صالح' });
  }
};

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'صلاحية المدير مطلوبة' });
  next();
};

// Input sanitizer
exports.sanitize = (str) => {
  if (!str) return '';
  return str.toString().replace(/[<>'"]/g, c => ({ '<':'&lt;', '>':'&gt;', "'":'&#x27;', '"':'&quot;' }[c]));
};
