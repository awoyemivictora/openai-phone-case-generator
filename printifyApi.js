const axios = require("axios");
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Bypass SSL certificate verification
});


async function uploadImageToPrintify(imageUrl) {
  const apiToken = process.env.PRINTIFY_API_KEY;

  try {
    const response = await axios.post(
      "https://api.printify.com/v1/uploads/images.json",
      {
        file_name: "generated_image.png", // Adjust based on logic
        url: imageUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        httpsAgent, // Use the HTTPS agent with the disabled verification
      }
    );
    return response.data; // This will include the image ID needed for product creation
  } catch (error) {
    console.error(
      "Error uploading image to Printify:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function createPrintifyProduct(productData) {
  const apiToken = process.env.PRINTIFY_API_KEY;
  const shopId = process.env.PRINTIFY_SHOP_ID;

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
        httpsAgent, // Use the HTTPS agent with the disabled verification
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

// Functions to get blueprints and print providers
async function getBlueprints() {
  const apiToken = process.env.PRINTIFY_API_KEY;

  try {
    const response = await axios.get(
      "https://35.225.201.18:3004/printify/catalog/blueprints",
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        httpsAgent, // Use the HTTPS agent with the disabled verification
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching blueprints:", error.message);
    throw error;
  }
}

async function getPrintProviders(blueprintId) {
  const apiToken = process.env.PRINTIFY_API_KEY;

  try {
    const response = await axios.get(
      `https://35.225.201.18:3004/printify/blueprints/${blueprintId}/printProviders`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        httpsAgent, // Use the HTTPS agent with the disabled verification
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching print providers:", error.message);
    throw error;
  }
}

async function getVariants(blueprintId, printProviderId) {
  const apiToken = process.env.PRINTIFY_API_KEY;

  try {
    const response = await axios.get(
      `https://35.225.201.18:3004/printify/blueprints/${blueprintId}/printProviders/${printProviderId}/variants`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        httpsAgent, // Use the HTTPS agent with the disabled verification
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching variants:", error.message);
    throw error;
  }
}

// Export all functions
module.exports = {
  uploadImageToPrintify,
  createPrintifyProduct,
  getBlueprints,
  getPrintProviders,
  getVariants,
};
