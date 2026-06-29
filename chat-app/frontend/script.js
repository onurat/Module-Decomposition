const server = "http://127.0.0.1:3000";

const messagesDiv = document.getElementById("messages");
const form = document.getElementById("chat-form");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const status = document.getElementById("status");

async function loadMessages() {
    const response = await fetch(`${server}/messages`);
    const messages = await response.json();

    messagesDiv.innerHTML = "";

    for (const message of messages) {
        const p = document.createElement("p");

        const time = new Date(message.timestamp).toLocaleTimeString();

        p.innerHTML = `<strong>${message.username}</strong> <small>${time}</small><br>${message.message}`;

        messagesDiv.appendChild(p);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(`${server}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usernameInput.value,
                message: messageInput.value,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        status.textContent = "Message sent!";
        status.style.color = "green";

        messageInput.value = "";

        loadMessages();
    } catch (error) {
        status.textContent = error.message;
        status.style.color = "red";
    }
});

loadMessages();

setInterval(loadMessages, 1000);