const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post("/send", async (req, res) => {
    const { name, gen, mutation } = req.body;

    const payload = {
        content: "@everyone",
        flags: 32768,
        components: [
            {
                type: 10,
                content: "Meowl Notifier: Test Log"
            },
            {
                type: 17,
                accent_color: 16711685,
                components: [
                    { type: 10, content: "# Meowl Notifier" },
                    { type: 14 },
                    {
                        type: 9,
                        components: [
                            {
                                type: 10,
                                content: `# 🏷️ [${mutation}] ${name}\n## 💸 Generation: $${gen}\n`
                            }
                        ],
                        accessory: {
                            type: 11,
                            media: { url: "attachment://unknown.png" } // optional
                        }
                    },
                    { type: 14 },
                    { type: 10, content: "🐾 **Other Brainrots**" },
                    { type: 10, content: "```None```" },
                    {
                        type: 10,
                        content: `Meowl Notifier | <t:${Math.floor(Date.now()/1000)}:f>`
                    }
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
        res.send("Sent via webhook with components!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to send message");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
