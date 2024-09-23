const axios = require("axios");

async function createPrintifyProduct(productData) {
  const apiToken = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID; // Ensure shop ID is stored in environment variables

  if (!shopId) {
    throw new Error("Shop ID is not defined in environment variables.");
  }

  try {
    const response = await axios.post(
      `https://api.printify.com/v1/shops/${shopId}/products.json`, // Correctly interpolate shopId here
      productData,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating product in Printify:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { createPrintifyProduct };
