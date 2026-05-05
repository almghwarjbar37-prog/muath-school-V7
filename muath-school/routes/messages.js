const router  = require('express').Router();
const Message = require('../models/Message');
const { protect, adminOnly, sanitize } = require('../middleware/auth');

// POST submit message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, role, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ success: false, message: 'يرجى تعبئة جميع الحقول المطلوبة' });

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email))
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني غير صحيح' });

    const msg = await Message.create({
      name:    sanitize(name),
      email:   sanitize(email),
      phone:   sanitize(phone),
      role:    sanitize(role),
      subject: sanitize(subject),
      message: sanitize(message)
    });

    // Optional email notification
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to:   process.env.EMAIL_USER,
        subject: `رسالة جديدة: ${subject}`,
        html: `<div dir="rtl"><h3>من: ${name}</h3><p>البريد: ${email}</p><p>${message}</p></div>`
      });
    } catch { /* email optional */ }

    res.status(201).json({ success: true, message: 'تم إرسال رسالتك بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'خطأ في الخادم' });
  }
});

// GET all messages (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH mark as read
router.patch('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE message
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'تم الحذف' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
