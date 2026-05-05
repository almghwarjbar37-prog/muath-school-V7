# 🕊️ مدرسة الشهيد معاذ الكساسبة — الموقع الرسمي

تم التطوير بواسطة الطالب **زيد طاهر المصري** | قسم تكنولوجيا المعلومات BTEC | 2026

---

## 📁 هيكل المشروع

```
muath-school/
├── server.js              ← نقطة الدخول الرئيسية
├── package.json
├── .env                   ← متغيرات البيئة (لا ترفعه على git)
├── models/
│   ├── User.js            ← نموذج المستخدمين
│   ├── News.js            ← نموذج الأخبار
│   └── Message.js         ← نموذج الرسائل
├── routes/
│   ├── auth.js            ← تسجيل الدخول والتسجيل
│   ├── news.js            ← CRUD الأخبار
│   ├── messages.js        ← إدارة الرسائل
│   └── users.js           ← إدارة المستخدمين
├── middleware/
│   └── auth.js            ← JWT والصلاحيات
└── public/
    ├── index.html         ← الصفحة الرئيسية
    ├── about.html         ← عن المدرسة
    ├── news.html          ← الأخبار (ديناميكية)
    ├── contact.html       ← تواصل معنا
    ├── login.html         ← تسجيل الدخول
    ├── admin.html         ← لوحة التحكم
    ├── css/
    │   └── styles.css     ← كل الـ CSS
    ├── js/
    │   └── script.js      ← كل الـ JavaScript المشترك
    └── images/
        ├── hero-bg.png
        ├── favicon.ico
        └── news/          ← صور الأخبار (تُنشأ تلقائياً)
```

---

## 🚀 طريقة التشغيل خطوة بخطوة

### المتطلبات
- Node.js v18 أو أحدث → https://nodejs.org
- MongoDB Community → https://www.mongodb.com/try/download/community
- محرر نصوص (VS Code مثلاً)

---

### الخطوة 1 — تثبيت MongoDB
حمّل وثبّت MongoDB Community Edition، ثم شغّله:
```bash
# على Windows — شغّل كـ Service أو:
mongod

# على Mac (بعد التثبيت عبر Homebrew):
brew services start mongodb-community
```

---

### الخطوة 2 — فك ضغط المشروع
```bash
# افك ضغط الملف في أي مكان تريد
cd muath-school
```

---

### الخطوة 3 — تثبيت المكتبات
```bash
npm install
```

---

### الخطوة 4 — إعداد ملف .env
افتح ملف `.env` وعدّل القيم إذا احتجت:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/muath_school
JWT_SECRET=muath_school_super_secret_jwt_key_2026
SESSION_SECRET=muath_school_session_secret_2026
EMAIL_USER=aiyschool1@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> لتفعيل الإيميل: روح على حساب Gmail ← Security ← App Passwords ← أنشئ كلمة مرور للتطبيق

---

### الخطوة 5 — تشغيل المشروع
```bash
# تشغيل عادي
npm start

# أو تشغيل مع إعادة تحميل تلقائي (للتطوير)
npm run dev
```

---

### الخطوة 6 — افتح المتصفح
```
http://localhost:3000
```

---

## 🔐 بيانات الدخول الافتراضية للمدير

| الحقل | القيمة |
|-------|--------|
| البريد | admin@muath-school.edu.jo |
| كلمة المرور | Admin@2026 |

> سيتم إنشاؤها تلقائياً عند أول تشغيل

---

## 🌐 صفحات الموقع

| الصفحة | الرابط |
|--------|--------|
| الرئيسية | http://localhost:3000 |
| عن المدرسة | http://localhost:3000/about |
| الأخبار | http://localhost:3000/news |
| تواصل معنا | http://localhost:3000/contact |
| تسجيل الدخول | http://localhost:3000/login |
| لوحة التحكم | http://localhost:3000/admin |

---

## 🔌 API Endpoints

### المصادقة
| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | /api/auth/login | تسجيل الدخول |
| POST | /api/auth/register | إنشاء حساب |
| POST | /api/auth/logout | تسجيل الخروج |
| GET | /api/auth/me | بيانات المستخدم الحالي |

### الأخبار
| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | /api/news | جلب الأخبار |
| GET | /api/news/:id | خبر واحد |
| POST | /api/news | إضافة خبر (admin) |
| PUT | /api/news/:id | تعديل خبر (admin) |
| DELETE | /api/news/:id | حذف خبر (admin) |

### الرسائل
| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | /api/messages | إرسال رسالة |
| GET | /api/messages | جلب الرسائل (admin) |
| PATCH | /api/messages/:id/read | وضع علامة مقروء |
| DELETE | /api/messages/:id | حذف رسالة |

---

## 🛡️ الأمان المطبّق
- كلمات مرور مشفرة بـ bcrypt
- JWT tokens مع انتهاء صلاحية 7 أيام
- Session store في MongoDB
- تنقية المدخلات من HTML injection
- صلاحيات (admin/user)
- حد أقصى 5MB للصور
- فلترة نوع الملفات

---

© 2026 — مدرسة الشهيد الطيار معاذ الكساسبة الثانوية للبنين
