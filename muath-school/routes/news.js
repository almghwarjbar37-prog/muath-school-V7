const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const News   = require('../models/News');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/images/news')),
  filename:    (req, file, cb) => cb(null, `news_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    /image\/(jpeg|png|gif|webp)/.test(file.mimetype) ? cb(null, true) : cb(new Error('صور فقط'));
  }
});

const fs = require('fs');
const newsImgDir = path.join(__dirname, '../public/images/news');
if (!fs.existsSync(newsImgDir)) fs.mkdirSync(newsImgDir, { recursive: true });

// GET all news (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 6, category } = req.query;
    const filter = { published: true };
    if (category && category !== 'الكل') filter.category = category;

    const total = await News.countDocuments(filter);
    const news  = await News.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, news, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single news
router.get('/:id', async (req, res) => {
  try {
    const item = await News.findById(req.params.id).populate('author', 'name');
    if (!item) return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    res.json({ success: true, news: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create news (admin)
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'العنوان والمحتوى مطلوبان' });

    const news = await News.create({
      title, content, category,
      image:  req.file ? `/images/news/${req.file.filename}` : '',
      author: req.user._id,
      excerpt: content.substring(0, 150) + '...'
    });
    res.status(201).json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update news (admin)
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: Date.now() };
    if (req.file) update.image = `/images/news/${req.file.filename}`;
    const news = await News.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!news) return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE news (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    res.json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
