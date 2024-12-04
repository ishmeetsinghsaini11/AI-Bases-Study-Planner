require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyCGAn3RhqA8403v-1wa3OK3ghvYIkvEZKc");

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/plan', async (req, res) => {
    try {
        const { subjects, studyHours, goals } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Act as an expert study planner and create a detailed study schedule based on the following information:
        Subjects: ${subjects.join(', ')}
        Available study hours per day: ${studyHours}
        Goals: ${goals}
        
        Please provide:
        1. A daily schedule breakdown
        2. Priority order of subjects
        3. Recommended study techniques
        4. Break times
        5. Tips for maintaining focus`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ schedule: text });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate study plan' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
