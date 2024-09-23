// getShopIDs.js

require('dotenv').config(); // Load environment variables
const axios = require('axios');

async function getShops() {
  const apiToken = process.env.PRINTIFY_API_KEY; // Get Printify API Key from .env

  if (!apiToken) {
    console.error('Printify API Key is missing.');
    return;
  }

  try {
    const response = await axios.get('https://api.printify.com/v1/shops.json', {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    console.log('Shop IDs:', response.data);
  } catch (error) {
    console.error('Error fetching shops:', error.response ? error.response.data : error.message);
  }
}

getShops();
