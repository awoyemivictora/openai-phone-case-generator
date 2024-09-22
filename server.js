require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateImage } = require('./openAiImageGeneration');
const { createPrintifyProduct } = require('./printifyApi');


const app = express();
app.use(cors());
app.use(express.json());


// Route to generate image using OpenAI
app.post('/generate-image', async (req, res) => {
    const { prompt } = req.body;
    const result = await generateImage(prompt);
    res.json(result);
});


// Route to create product in Printify
app.post('/create-product', async (req, res) => {
    const productData = req.body;
    try {
        const result = await createPrintifyProduct(productData);
        res.json(result);
    } catch (error) {
        res.status(500).send({ error: 'Failed to create product' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



