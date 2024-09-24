const express = require("express");
const cors = require("cors");
const { generateImage } = require("../openAiImageGeneration");
const {
  uploadImageToPrintify,
  createPrintifyProduct,
} = require("../printifyApi");

const app = express();
app.use(cors({ origin: 'https://www.abetterlife.info/' })); // Replace with your actual Wix site URL
app.use(express.json());

// Route to generate image and create product in Printify
// app.post("/create-product", async (req, res) => {
//   const { prompt, productDetails } = req.body;

//   // Validate incoming request
//   if (!prompt || !productDetails || !productDetails.blueprint_id) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     // Step 1: Generate image using OpenAI
//     const imageResult = await generateImage(prompt);
//     if (!imageResult.success) {
//       return res.status(500).json({
//         error: "Image generation failed",
//         details: imageResult.error,
//       });
//     }

//     const imageUrl = imageResult.url;
//     console.log("Generated image URL:", imageUrl);

//     // Step 2: Upload image to Printify
//     const uploadedImage = await uploadImageToPrintify(imageUrl);
//     const imageId = uploadedImage.id; // Extract the image ID from the response

//     // Validate product details
//     if (!productDetails.print_provider_id || !productDetails.variant_ids) {
//       return res.status(400).json({ error: "Missing print provider or variants" });
//     }

//     // Prepare product data
//     const productData = {
//       title: "Custom Phone Case",
//       blueprint_id: productDetails.blueprint_id,
//       print_provider_id: productDetails.print_provider_id,
//       print_areas: [
//         {
//           variant_ids: productDetails.variant_ids,
//           placeholders: [
//             {
//               position: "front",
//               images: [{ id: imageId }],
//             },
//           ],
//         },
//       ],
//     };

//     // Log product data for debugging
//     console.log("Product Data:", productData);

//     // Step 4: Create product in Printify
//     const result = await createPrintifyProduct(productData);
//     res.json(result);
//   } catch (error) {
//     console.error("Error in creating product:", error);
//     res.status(500).json({ error: "Failed to create product", details: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;



app.post("/create-product", async (req, res) => {
  const { prompt, productDetails } = req.body;

  try {
    const imageResult = await generateImage(prompt);
    if (!imageResult.success) {
      return res.status(500).json({ error: "Image generation failed" });
    }

    const imageUrl = imageResult.url;
    const uploadedImage = await uploadImageToPrintify(imageUrl);
    const imageId = uploadedImage.id;

    const productData = {
      title: "Custom Phone Case",
      blueprint_id: productDetails.blueprint_id,
      print_provider_id: productDetails.print_provider_id,
      print_areas: [
        {
          variant_ids: productDetails.variant_ids,
          placeholders: [
            {
              position: "front",
              images: [{ id: imageId }],
            },
          ],
        },
      ],
    };

    const result = await createPrintifyProduct(productData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
