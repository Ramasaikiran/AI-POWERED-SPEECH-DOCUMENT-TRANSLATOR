---
# 🚀 AI-Powered Speech & Document Translator
A modern, AI-powered translation tool built with **JavaScript**, **Google Translate API**, **Web Speech API**, **PDF.js**, and **Mammoth.js**.
This project enables users to translate **speech**, **text**, and **documents (PDF/Word)** into 100+ languages—designed for accessibility, education, global communication, and productivity.

Breaking language barriers in **communication, education, and business**.

---

## ✨ Features

### 🗣️ **User Interaction**

* 🎤 **Speech-to-Text** using Web Speech API
* 🌐 **Instant Text Translation** via Google Translate API
* 🌍 **100+ Languages Supported**
* 📋 **Copy & Download Options** for translated text

---

### 📄 **Document Translation**

* 📘 **PDF Translation** using PDF.js
* 📝 **Word (.docx) Translation** via Mammoth.js
* 📂 **Drag & Drop File Uploads**
* 💾 **Download Translated Documents** (TXT format)

---

### ⚡ **Real-Time Translation**

* 🎤 **Live Speech Translation**
* 🔁 **Continuous Mode** for long-form speaking
* 🔊 **Text-to-Speech Playback** for translated output

---

### 🎨 **Modern UI/UX**

* Responsive, mobile-first layout
* Clean, distraction-free interface
* 🌙 **Light/Dark Mode Toggle**
* ⏳ Loading indicators & progress states

---

## 🏗️ Project Structure

```
AI-powered speech and document translator/
├── index.html        # Main entry point
├── style.css         # Styling (custom + modern theme)
├── script.js         # Core logic (speech, API calls, translations)
├── assets/           # Icons, images
├── libs/             # External libs (pdf.js, mammoth.js, etc.)
└── README.md         # Documentation
```

---

## 🚀 Quick Start

### ✔️ **Prerequisites**

* Node.js (v16+) — optional (for local server)
* Google Translate API key
* Modern browser (Chrome recommended for Web Speech API)

---

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Ramasaikiran/AI-POWERED-SPEECH-AND-DOCUMENT-TRANSLATOR.git
cd AI-POWERED-SPEECH-AND-DOCUMENT-TRANSLATOR
```

### 2️⃣ Open Locally

You can simply open `index.html` in your browser.
Or run a lightweight local server:

```bash
npx http-server
```

Access at:
👉 `http://localhost:8080`

---

## 🔧 Configuration

Open **script.js** and update your API key:

```js
const API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY";
```

---

## 📊 Core Functionalities

### 🗣️ Speech Translation

* Speak → Get real-time translation
* Hear pronunciation using text-to-speech

### 📄 Document Translation

* Upload `.pdf` or `.docx`
* Extract text → translate → export

### ✍️ Text Translation

* Type + click → instant translated output

---

## 🎨 UI Components

| Component             | Description                                     |
| --------------------- | ----------------------------------------------- |
| **Navbar**            | Quick mode switching (Speech / Text / Document) |
| **Translator Box**    | Input + output + language selector              |
| **Upload Section**    | PDF/Word upload with drag-and-drop              |
| **Live Output Panel** | Displays real-time speech/document translations |

---

## 🔒 Security Features

* Input sanitization to prevent XSS
* API key security recommendations
* CORS-safe request handling

---

## 🚀 Deployment

### **GitHub Pages**

1. Push repo to GitHub
2. Enable GitHub Pages in repo settings
3. App becomes available at:
   **[https://yourusername.github.io/AI-POWERED-SPEECH-AND-DOCUMENT-TRANSLATOR](https://yourusername.github.io/AI-POWERED-SPEECH-AND-DOCUMENT-TRANSLATOR)**

### **Netlify / Vercel**

* Drag & drop repo
* Or use GitHub automatic deployment

---

## 🧪 Testing

Run unit tests (if configured):

```bash
npm test
```

Recommended browser tests:

* ✔️ Chrome — Speech recognition
* ✔️ Firefox/Edge — PDF.js, Mammoth.js

---

## 📈 Future Enhancements

* 🌐 Offline translation (local ML models)
* 📲 PWA Mobile App
* 💬 Real-time translated chat (multi-user)
* 🎥 Video subtitle translation
* 🤖 AI-based grammar & tone correction

---

## 🤝 Contributing

1. Fork repo
2. Create a feature branch:

   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Commit changes:

   ```bash
   git commit -m "Add awesome feature"
   ```
4. Push branch:

   ```bash
   git push origin feature/awesome-feature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👥 Team

| Area               | Tools / Technologies                                     |
| ------------------ | -------------------------------------------------------- |
| **Frontend & UI**  | HTML, CSS, JavaScript                                    |
| **Backend & APIs** | Google Translate API, Web Speech API, PDF.js, Mammoth.js |
| **Design**         | Modern, responsive dashboard-style UI                    |

---
