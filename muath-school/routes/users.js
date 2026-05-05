const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User   = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET stats (admin) — must be ABOVE /:id routes
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const News    = require('../models/News');
    const Message = require('../models/Message');
    const [users, news, messages, unread] = await Promise.all([
      User.countDocuments(),
      News.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false })
    ]);
    res.json({ success: true, stats: { users, news, messages, unread } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all users (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH change user role (admin)
router.patch('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ success: false, message: 'دور غير صالح' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE user (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'لا يمكنك حذف حسابك' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
