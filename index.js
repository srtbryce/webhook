const express = require("express");

const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL;

app.post("/send", async (req, res) => {
    try {
        const { name, gen, mutation } = req.body;

        if (!WEBHOOK_URL) {
            console.error("Missing WEBHOOK_URL");
            return res.status(500).send("Webhook not set");
        }

        const payload = {
            content: "@everyone",
            // ⚠️ sometimes this flag breaks things, try with/without
            // flags: 32768,
            components: [
                {
                    type: 10,
                    content: "Meowl Notifier: Test Log"
                },
                {
                    type: 17,
                    accent_color: 16711685,
                    components: [
                        {
                            type: 10,
                            content: "# 🐱 Meowl Notifier"
                        },
                        { type: 14 },
                        {
                            type: 9,
                            components: [
                                {
                                    type: 10,
                                    content:
                                        `# 🏷️ [${mutation}] ${name}\n` +
                                        `## 💸 Generation: $${gen}`
                                }
                            ]
                        },
                        { type: 14 },
                        {
                            type: 10,
                            content: "🐾 **Other Brainrots**"
                        },
                        {
                            type: 10,
                            content: "```None```"
                        },
                        {
                            type: 10,
                            content: `Meowl Notifier | <t:${Math.floor(Date.now()/1000)}:f>`
                        }
                    ]
                }
            ]
        };

        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        console.log("Status:", response.status);
        console.log("Response:", text);

        res.status(response.status).send(text);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(3000, () => {
    console.log("🚀 Components V2 server running on port 3000");
});
