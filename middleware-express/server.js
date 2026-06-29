const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

function usernameMiddleware(req, res, next) {
    req.username = req.header("X-Username") || null;
    next();
}

function validateArrayMiddleware(req, res, next) {
    const body = req.body;

    if (!Array.isArray(body)) {
        return res.status(400).send("Body must be a JSON array.");
    }

    if (!body.every((item) => typeof item === "string")) {
        return res.status(400).send("Array must contain only strings.");
    }

    next();
}

app.use(usernameMiddleware);

app.post("/", validateArrayMiddleware, (req, res) => {
    const username = req.username;
    const subjects = req.body;

    const authMessage = username
        ? `You are authenticated as ${username}.`
        : "You are not authenticated.";

    let subjectMessage;

    if (subjects.length === 0) {
        subjectMessage = "You have requested information about 0 subjects.";
    } else if (subjects.length === 1) {
        subjectMessage = `You have requested information about 1 subject: ${subjects[0]}.`;
    } else {
        subjectMessage = `You have requested information about ${subjects.length} subjects: ${subjects.join(", ")}.`;
    }

    res.send(`${authMessage}\n\n${subjectMessage}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});