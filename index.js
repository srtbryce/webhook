const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔒 PUT THESE IN ENV VARIABLES LATER
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.post("/send", async (req, res) => {
    const { name, gen, mutation } = req.body;

    const payload = {
        content: "@everyone",
        components: [
            {
                type: 10,
                content: "Meowl Notifier: Live Log"
            },
            {
                type: 17,
                accent_color: 16711685,
                components: [
                    {
                        type: 10,
                        content: "# Meowl Notifier"
                    },
                    {
                        type: 14
                    },
                    {
                        type: 9,
                        components: [
                            {
                                type: 10,
                                content: `# 🏷️ [${mutation}] ${name}\n## 💸 Generation: $${gen}\n`
                            }
                        ]
                    },
                    {
                        type: 14
                    },
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

    await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
        method: "POST",
        headers: {
            "Authorization": `Bot ${BOT_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    res.send("sent");
});

app.listen(3000, () => console.log("Server running"));
