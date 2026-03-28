import express from "express";
import { V2ComponentBuilder, V2TextDisplayBuilder } from "v2componentsbuilder";

const app = express();
app.use(express.json());

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.post("/send", async (req, res) => {
    try {
        const { name, gen, mutation } = req.body;

        if (!TOKEN || !CHANNEL_ID) {
            return res.status(500).send("Missing TOKEN or CHANNEL_ID");
        }

        // 🧪 Build Components V2
        const components = new V2ComponentBuilder().addComponents([
            new V2TextDisplayBuilder("Meowl Notifier: Test Log"),

            new V2TextDisplayBuilder(
                `# 🐱 Meowl Notifier\n\n` +
                `🏷️ **[${mutation}] ${name}**\n` +
                `💸 Generation: $${gen}\n\n` +
                `🐾 **Other Brainrots**\n` +
                "```None```\n\n" +
                `Meowl Notifier | <t:${Math.floor(Date.now()/1000)}:f>`
            )
        ]);

        const payload = {
            content: "@everyone",
            components: components.toJSON().components
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

        console.log("Status:", response.status);
        console.log("Response:", text);

        res.status(response.status).send(text);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(3000, () => {
    console.log("🚀 V2 bot server running on port 3000");
});
