const axios = require("axios");

async function createPrintifyProduct(productData) {
  const apiToken = process.env.PRINTIFY_API_KEY;

  try {
    const response = await axios.post(
      "https://api.printify.com/v1/shops/{shop_id}/products.json",
      productData,
      {
        headers: { Authorization: `Bearer ${apiToken}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating product in Printify:", error);
    throw error;
  }
}

module.exports = { createPrintifyProduct };
