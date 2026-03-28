const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔒 Put your Discord webhook URL in an environment variable
const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post("/send", async (req, res) => {
    const { name, gen, mutation } = req.body;

    const payload = {
        content: "@everyone",
        embeds: [
            {
                title: `# 🏷️ [${mutation}] ${name}`,
                description: `## 💸 Generation: $${gen}`,
                color: 16711685,
                fields: [
                    { name: "🐾 Other Brainrots", value: "```None```" },
                    { name: "Timestamp", value: `<t:${Math.floor(Date.now()/1000)}:f>` }
                ]
            }
        ]
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        res.send("Sent via webhook!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to send message");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
