"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const chatArea = document.querySelector('.chat-area');
const inputField = document.querySelector('.chat-input textarea');
const sendButton = document.querySelector('.chat-input button');
const typingIndicator = document.querySelector('.typing-indicator');

// ✅ API URL
const apiURL = ''; //your api goes here

sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        const userMessage = inputField.value.trim();
        inputField.value = '';
        inputField.style.height = 'auto';

        if (!userMessage) return;

        displayMessage(userMessage, 'user-message');
        showTypingIndicator();

        try {
            const response = yield fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage }) // ✅ Send user message
            });

            if (!response.ok) {
                const errorText = yield response.text();
                console.error("API Error Response Text:", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = yield response.json();
            console.log("Parsed API Data:", data); // Log the parsed data
            const botResponse = data.result || "Sorry, I didn't get a valid response.";
            displayMessage(botResponse, 'bot-message');

        } catch (error) {
            console.error("Error fetching bot response:", error);
            // Improved error message display
            let errorMessage = "Error: Could not retrieve response.";
            if (error instanceof Error) {
                errorMessage += ` ${error.message}`;
            } else if (typeof error === 'string') {
                errorMessage += ` ${error}`;
            }
            displayMessage(errorMessage, 'bot-message error-message');
        } finally {
            hideTypingIndicator();
        }
    });
}

function displayMessage(message, cssClass) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', cssClass);

    const messageText = document.createElement('p');
    messageText.textContent = message;

    messageElement.appendChild(messageText);
    chatArea.appendChild(messageElement);
    scrollToBottom();
}

function showTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }
}

function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

inputField.addEventListener('input', () => {
    inputField.style.height = 'auto';
    inputField.style.height = `${inputField.scrollHeight}px`;
});

document.addEventListener('DOMContentLoaded', () => {
    displayMessage("Welcome to the ProSpine Chatbot! How can I help you today?", 'bot-message');
});
