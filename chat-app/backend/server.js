const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const messages = [
    {
        username: "System",
        message: "Welcome to Onur's Chat App!",
        timestamp: Date.now(),
    },
];

app.get("/messages", (req, res) => {
    res.json(messages);
});

app.post("/messages", (req, res) => {
    const { username, message } = req.body;

    if (!username.trim() || !message.trim()) {
        return res.status(400).json({
            error: "Username and message cannot be empty.",
        });
    }

    const newMessage = {
        username: username.trim(),
        message: message.trim(),
        timestamp: Date.now(),
    };

    messages.push(newMessage);

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});