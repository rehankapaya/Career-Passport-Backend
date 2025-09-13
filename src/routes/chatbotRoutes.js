const express = require("express");
const axios = require("axios");
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT = `
You are an AI Career Guidance Assistant. 
Your role is to suggest trending career paths based on the user's query. 

Provide guidance on:
- In-demand skills
- Career growth potential
- Related industries
- Future trends
- Suggested learning resources

Always be helpful, concise, and motivational.
`;

router.get('/generate', async (req, res) => {
    const { prompt } = req.query; 
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required in query string, e.g. /generate?prompt=AI careers' });
    }

    try {
        const contextualPrompt = `${SYSTEM_PROMPT}

User question: ${prompt}

Provide trending career suggestions with future outlook.`;

        const result = await model.generateContent(contextualPrompt);
        const response = result.response.text();

        return res.json({ response });

    } catch (error) {
        console.error('Career chatbot error:', error.message);
        return res.status(500).json({
            error: 'Something went wrong. Please try again later!'
        });
    }
});

module.exports = router;
