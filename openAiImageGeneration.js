// // const { Configuration, OpenAIApi } = require('openai');  // Official imports
// // require('dotenv').config();  // Load environment variables from .env file

// // const configuration = new Configuration({
// //   apiKey: process.env.OPENAI_API_KEY,  // Make sure .env has this key
// // });

// // const openai = new OpenAIApi(configuration);

// // New
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
// });

// // Example function to generate an image based on a prompt
// const generateImage = async (prompt) => {
//   try {
//     const response = await openai.images.generate({
//       prompt: prompt,  // Text prompt for image generation
//       n: 1,  // Number of images to generate
//       size: "1024x1024",  // Image dimensions
//     });

//     return {
//       success: true,
//       url: response.data.data[0].url,  // URL of the generated image
//     };
//   } catch (error) {
//     console.error("Error generating image:", error.message);
//     return {
//       success: false,
//       error: error.message,
//     };
//   }
// };

// module.exports = { generateImage };


// Importing OpenAI (adjust import based on your setup)
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

// Example function to generate an image based on a prompt
const generateImage = async (prompt) => {
  try {
    const response = await openai.images.generate({
      prompt: prompt,  // Text prompt for image generation
      n: 1,  // Number of images to generate
      size: "1024x1024",  // Image dimensions
    });

    return {
      success: true,
      url: response.data.data[0].url,  // URL of the generated image
    };
  } catch (error) {
    console.error("Error generating image:", error);  // Log the entire error for better debugging
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = { generateImage };
