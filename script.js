const messagesContainer = document.getElementById("messages");
const userMessageInput = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.getElementById("chatContainer");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const micBtn = document.getElementById("micBtn");

const API_KEY = 'AIzaSyB0kiQ_0MFHpSPo44gN-vVpnO7Fhe-50H8';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Configuração do reconhecimento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
} else {
    console.error('Reconhecimento de voz não suportado neste navegador');
}

const handleMicrophone = () => {
    if (!recognition) {
        alert('Seu navegador não suporta reconhecimento de voz');
        return;
    }

    micBtn.classList.add('recording');
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userMessageInput.value = transcript;
        micBtn.classList.remove('recording');
        sendMessage();
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento:', event.error);
        micBtn.classList.remove('recording');
        alert('Erro ao capturar áudio. Por favor, tente novamente.');
    };

    recognition.onend = () => {
        micBtn.classList.remove('recording');
    };
};

const changeTheme = (isDarkMode) => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

const savedTheme = localStorage.getItem('theme');
changeTheme(savedTheme === 'dark');

const addMessage = (content, isUser) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isUser ? "user" : "ai");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");
    contentDiv.innerText = content;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

const sendMessage = async () => {
    const message = userMessageInput.value.trim();
    if (message) {
        addMessage(message, true);
        userMessageInput.value = '';

        let aiResponse = '';

        if (message.toLowerCase().includes('qual é o seu nome')) {
            aiResponse = "Meu nome é Ruby, estou sendo desenvolvido pela equipe Ruby.";
        } else if (
            message.toLowerCase().includes('quem te criou') || 
            message.toLowerCase().includes('quem desenvolveu') || 
            message.toLowerCase().includes('quem fez você') ||
            message.toLowerCase().includes('como você foi feito') ||
            message.toLowerCase().includes('desenvolvedor') ||
            message.toLowerCase().includes('foi desenvolvido')
        ) {
            aiResponse = "Fui desenvolvido pela equipe Ruby.";
        } else if (message.toLowerCase().includes('cazamba')) {
            aiResponse = "A Cazamba possibilita uma total flexibilização de formatos, em tamanho e recursos. Desta forma é o anunciante quem determina como veicular a peça e quais interações ela terá com o usuário. Gerando assim um maior engajamento com o público desejado.";
        } else if (message.toLowerCase().includes('formatos customizados e de alto impacto')) {
            aiResponse = "A Cazamba possibilita uma total flexibilização de formatos, em tamanho e recursos. Desta forma é o anunciante quem determina como veicular a peça e quais interações ela terá com o usuário. Gerando assim um maior engajamento com o público desejado.";
        } else {
            try {
                const response = await axios.post(API_URL, {
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                }, {
                    params: {
                        key: API_KEY
                    }
                });

                aiResponse = response.data.candidates[0].content.parts[0].text;
            } catch (error) {
                console.error('Erro ao chamar a API do Gemini:', error);
                aiResponse = "Desculpe, ocorreu um erro ao processar sua mensagem.";
            }
        }

        addMessage(aiResponse, false);
    }
};

// Event Listeners
sendBtn.addEventListener("click", sendMessage);
userMessageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

toggleModeBtn.addEventListener("click", () => {
    const isDarkMode = document.body.classList.contains("dark-mode");
    changeTheme(!isDarkMode);
});

micBtn.addEventListener("click", handleMicrophone);