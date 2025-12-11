// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------
// TODO: Replace with your actual Google Translate API Key for production use.
// If left empty, it falls back to a free (but rate-limited/unstable) endpoint.
const API_KEY = "";

const LANGUAGES = {
    en: "English", hi: "Hindi", te: "Telugu", ta: "Tamil", kn: "Kannada",
    ml: "Malayalam", mr: "Marathi", gu: "Gujarati", pa: "Punjabi", bn: "Bengali",
    or: "Odia", as: "Assamese", ur: "Urdu", ko: "Korean", es: "Spanish",
    fr: "French", de: "German", zh: "Chinese", ar: "Arabic", ru: "Russian",
    ja: "Japanese", it: "Italian", pt: "Portuguese"
};

// ---------------------------------------------------------
// DOM ELEMENTS
// ---------------------------------------------------------
const elements = {
    inputText: document.getElementById("inputText"),
    targetLanguage: document.getElementById("targetLanguage"),
    outputText: document.getElementById("outputText"),
    translateBtn: document.getElementById("translateBtn"),
    fileInput: document.getElementById("fileInput"),
    fileNameDisplay: document.getElementById("fileName"),
    downloadBtn: document.getElementById("downloadBtn"),
    downloadPdfBtn: document.getElementById("downloadPdfBtn"),
    copyBtn: document.getElementById("copyBtn"),
    textStatusBar: document.getElementById("textStatusBar"),

    // Speech
    speechTargetLanguage: document.getElementById("speechTargetLanguage"),
    listenBtn: document.getElementById("listenBtn"),
    speechOutput: document.getElementById("speechOutput"),
    speechStatusBar: document.getElementById("speechStatusBar"),
    speechVisualizer: document.getElementById("speechVisualizer"),

    // Theme
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon")
};

// ---------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------
function init() {
    populateLanguages(elements.targetLanguage);
    populateLanguages(elements.speechTargetLanguage);

    // Set defaults (Telugu as requested)
    elements.targetLanguage.value = "te";
    elements.speechTargetLanguage.value = "te";

    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function populateLanguages(selectElement) {
    selectElement.innerHTML = "";
    for (const code in LANGUAGES) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = LANGUAGES[code];
        selectElement.appendChild(option);
    }
}

// ---------------------------------------------------------
// THEME HANDLING
// ---------------------------------------------------------
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    elements.themeIcon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
    localStorage.setItem('theme', theme);
}

elements.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
});

// ---------------------------------------------------------
// TRANSLATION LOGIC
// ---------------------------------------------------------
async function translateText(text, targetLang) {
    if (!text) return "";

    try {
        let url;
        if (API_KEY) {
            url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}&q=${encodeURIComponent(text)}&target=${targetLang}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            return data.data.translations[0].translatedText;
        } else {
            // Free endpoint (unofficial)
            url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const res = await fetch(url);
            const data = await res.json();
            // data[0] contains array of translated sentences
            return data[0].map(part => part[0]).join("");
        }
    } catch (error) {
        console.error("Translation Error:", error);
        throw error;
    }
}

elements.translateBtn.addEventListener("click", async () => {
    const text = elements.inputText.value.trim();
    if (!text) {
        showStatus(elements.textStatusBar, "Please enter text to translate.", true);
        return;
    }

    setLoading(true);
    try {
        const result = await translateText(text, elements.targetLanguage.value);
        elements.outputText.value = result;
        showStatus(elements.textStatusBar, "Translation complete.");
    } catch (err) {
        showStatus(elements.textStatusBar, "Error: " + err.message, true);
    } finally {
        setLoading(false);
    }
});

function showStatus(element, message, isError = false) {
    if (message === "Translation complete." || message === "PDF Downloaded!") {
        element.innerHTML = `<span class="status-dot"></span> ${message}`;
        element.style.color = "var(--text-main)";
    } else {
        element.textContent = message;
        element.style.color = isError ? "#ef4444" : "var(--text-muted)";
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        elements.translateBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Translating...';
        elements.translateBtn.disabled = true;
    } else {
        elements.translateBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Translate';
        elements.translateBtn.disabled = false;
    }
}

// ---------------------------------------------------------
// FILE HANDLING
// ---------------------------------------------------------
elements.fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    elements.fileNameDisplay.style.display = "block";
    elements.fileNameDisplay.textContent = `Selected: ${file.name}`;
    elements.inputText.value = "Extracting text...";
    elements.inputText.disabled = true;

    try {
        let text = "";
        if (file.type === "text/plain") {
            text = await file.text();

        } else if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            // pdfjsLib is loaded in global scope
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const maxPages = Math.min(pdf.numPages, 10); // Limit to 10 pages for performance

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(" ") + "\n\n";
            }
            if (pdf.numPages > 10) text += "\n[...Truncated after 10 pages...]";

        } else if (file.name.endsWith(".docx")) { // Basic check for docx
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;

        } else {
            throw new Error("Unsupported file format.");
        }

        elements.inputText.value = text;
        showStatus(elements.textStatusBar, "Text extracted. Ready to translate.");

    } catch (err) {
        console.error(err);
        elements.inputText.value = "";
        showStatus(elements.textStatusBar, "Error extracting text: " + err.message, true);
    } finally {
        elements.inputText.disabled = false;
    }
});

// ---------------------------------------------------------
// CLIPBOARD & DOWNLOAD
// ---------------------------------------------------------
elements.copyBtn.addEventListener("click", () => {
    const text = elements.outputText.value;
    if (!text) return;
    navigator.clipboard.writeText(text);
    showStatus(elements.textStatusBar, "Copied to clipboard!");
    setTimeout(() => showStatus(elements.textStatusBar, ""), 2000);
});

elements.downloadBtn.addEventListener("click", () => {
    const text = elements.outputText.value;
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translated_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

elements.downloadPdfBtn.addEventListener("click", () => {
    const text = elements.outputText.value;
    if (!text) {
        showStatus(elements.textStatusBar, "No text to download.", true);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Split text to fit page
    const splitText = doc.splitTextToSize(text, 180);

    // Check if we need to add a font that supports non-Latin characters (simplified for this demo)
    // Note: Standard jsPDF fonts support Latin. For others, custom fonts are needed.
    // We will stick to standard for now, but user should know this limitation for some languages.

    doc.text(splitText, 10, 10);
    doc.save(`translated_${new Date().toISOString().slice(0, 10)}.pdf`);

    showStatus(elements.textStatusBar, "PDF Downloaded!");
});

// ---------------------------------------------------------
// SPEECH RECOGNITION
// ---------------------------------------------------------
let recognition;
let isListening = false;

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US"; // Input language

    recognition.onstart = () => {
        isListening = true;
        elements.listenBtn.innerHTML = '<ion-icon name="mic"></ion-icon> Stop Listening';
        elements.listenBtn.classList.replace('btn-primary', 'btn-danger');
        elements.speechVisualizer.parentElement.classList.add('speech-active');
        showStatus(elements.speechStatusBar, "Listening...");
    };

    recognition.onend = () => {
        isListening = false;
        elements.listenBtn.innerHTML = '<ion-icon name="mic-outline"></ion-icon> Start Listening';
        elements.listenBtn.classList.replace('btn-danger', 'btn-primary');
        elements.speechVisualizer.parentElement.classList.remove('speech-active');
        showStatus(elements.speechStatusBar, "Stopped.");
    };

    recognition.onresult = async (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript) {
            elements.speechOutput.value = `Heard: "${finalTranscript}"\nTranslating...`;

            try {
                const translated = await translateText(finalTranscript, elements.speechTargetLanguage.value);
                elements.speechOutput.value = translated;

                // Speech Synthesis (Text to Speech)
                speakText(translated, elements.speechTargetLanguage.value);
            } catch (err) {
                elements.speechOutput.value += "\n(Translation failed)";
            }
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech error", event);
        if (event.error === 'no-speech') return;
        showStatus(elements.speechStatusBar, "Error: " + event.error, true);
        stopListening();
    };
} else {
    elements.listenBtn.disabled = true;
    elements.listenBtn.textContent = "Speech API Not Supported";
}

function stopListening() {
    if (recognition && isListening) {
        recognition.stop();
    }
}

elements.listenBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (isListening) {
        stopListening();
    } else {
        recognition.start();
    }
});

function speakText(text, lang) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop previous
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.speak(utter);
}

// Run Init
init();
