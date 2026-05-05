const router  = require('express').Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const Staff   = require('../models/Staff');
const { protect, adminOnly } = require('../middleware/auth');

// Multer setup for staff images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/images/staff');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all staff (public)
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find().sort({ dept: 1, order: 1, createdAt: 1 });
    res.json({ success: true, staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST add staff (admin)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, role, dept } = req.body;
    const image = req.file ? '/images/staff/' + req.file.filename : '';
    const member = await Staff.create({ name, role, dept, image });
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update staff (admin)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, role, dept } = req.body;
    const update = { name, role, dept };
    if (req.file) update.image = '/images/staff/' + req.file.filename;
    const member = await Staff.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE staff (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
