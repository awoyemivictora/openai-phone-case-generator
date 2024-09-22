const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Store your OpenAI API key in the .env file
});

const openai = new OpenAIApi(configuration);

async function generateImage(prompt) {
    try {
        const response = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });
        return { success: true, url: response.data.data[0].url };
    } catch (error) {
        console.error("Error generating image:", error);
        return { success: false, error: error.message };
    }
}

module.exports = { generateImage };


