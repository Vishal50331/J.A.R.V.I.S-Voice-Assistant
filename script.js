function startListening() {
    const status = document.getElementById("status");
    const input = document.getElementById("userInput");
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        status.textContent = "VOICE INPUT UNSUPPORTED IN THIS BROWSER";
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    status.textContent = "LISTENING…";

    recognition.onresult = (event) => {
        input.value = event.results[0][0].transcript;
        status.textContent = "VOICE INPUT RECEIVED";
    };

    recognition.onerror = (event) => {
        const messages = {
            "not-allowed": "MICROPHONE PERMISSION DENIED",
            "service-not-allowed": "SPEECH SERVICE BLOCKED",
            "no-speech": "NO SPEECH DETECTED; TRY AGAIN",
            "audio-capture": "NO MICROPHONE FOUND"
        };

        status.textContent =
            messages[event.error] || `VOICE ERROR: ${event.error}`;
    };

    recognition.onend = () => {
        if (status.textContent === "LISTENING…") {
            status.textContent = "SYSTEM ONLINE";
        }
    };

    try {
        recognition.start();
    } catch (error) {
        status.textContent = `VOICE ERROR: ${error.message}`;
    }
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const message = input.value.trim();

    if (!message) {
        input.focus();
        return;
    }

    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.textContent = `You: ${message}`;
    chatBox.appendChild(userMessage);

    const normalizedMessage = message.toLowerCase();
    let reply;

    if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi")) {
        reply = "Hello! How can I help you?";
    } else if (normalizedMessage.includes("time")) {
        reply = `The time is ${new Date().toLocaleTimeString()}.`;
    } else if (normalizedMessage.includes("your name")) {
        reply = "I am JARVIS, your personal assistant.";
    } else {
        reply = `I heard you say, "${message}"`;
    }

    const jarvisMessage = document.createElement("div");
    jarvisMessage.className = "message bot";
    jarvisMessage.textContent = `JARVIS: ${reply}`;
    chatBox.appendChild(jarvisMessage);

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();

        const spokenReply = new SpeechSynthesisUtterance(reply);
        spokenReply.lang = "en-US";
        window.speechSynthesis.speak(spokenReply);
    }

    input.value = "";
    input.focus();
    chatBox.scrollTop = chatBox.scrollHeight;
}