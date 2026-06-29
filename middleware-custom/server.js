const express = require("express");

const app = express();
const PORT = 3000;

function usernameMiddleware(req, res, next) {
    req.username = req.header("X-Username") || null;
    next();
}

function jsonArrayMiddleware(req, res, next) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            const parsed = JSON.parse(body);

            if (!Array.isArray(parsed)) {
                return res.status(400).send("Body must be a JSON array.");
            }

            if (!parsed.every((item) => typeof item === "string")) {
                return res.status(400).send("Array must contain only strings.");
            }

            req.body = parsed;
            next();
        } catch {
            res.status(400).send("Invalid JSON.");
        }
    });
}

app.use(usernameMiddleware);

app.post("/", jsonArrayMiddleware, (req, res) => {
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