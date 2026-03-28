const express = require("express");

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN; // Bot token
const CHANNEL_ID = process.env.CHANNEL_ID; // Channel to send in

app.post("/send", async (req, res) => {
    try {
        const { name, gen, mutation } = req.body;

        if (!TOKEN || !CHANNEL_ID) {
            return res.status(500).send("Missing TOKEN or CHANNEL_ID");
        }

        const payload = {
            content: "@everyone",
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

        const response = await fetch(
            `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bot ${TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const text = await response.text();

        console.log("Discord status:", response.status);
        console.log("Discord response:", text);

        if (!response.ok) {
            return res.status(500).send("Discord rejected message");
        }

        res.send("✅ Sent via bot!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(3000, () => {
    console.log("🤖 Bot server running on port 3000");
});
