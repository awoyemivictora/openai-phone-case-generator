// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const https = require("https");
// const fs = require("fs");
// const { generateImage } = require("../openAiImageGeneration");
// const {
//   uploadImageToPrintify,
//   createPrintifyProduct,
//   getBlueprints,
//   getPrintProviders,
//   getVariants,
// } = require("../printifyApi");

// const app = express();
// app.use(cors());
// app.use(express.json());


// // To Load SSL certicate files over HTTPS
// // const sslOptions = {
// //     key: fs.readFileSync("private.key.pem"),
// //     cert: fs.readFileSync("certificate.crt"),
// //     ca: fs.readFileSync("certificate.pem"),
// //   };

// // Route to generate image and create product in Printify
// app.post("/create-product", async (req, res) => {
//   const { prompt, productDetails } = req.body; // 'productDetails' should include the necessary product info like blueprint, print_provider_id, etc.

//   try {
//     // Step 1: Generate image using OpenAI
//     const imageResult = await generateImage(prompt);
//     if (!imageResult.success) {
//       return res
//         .status(500)
//         .json({ eror: "Image generation failed", details: imageResult.error });
//     }

//     const imageUrl = imageResult.url;
//     console.log("Generated image URL:", imageUrl);

//     // Step 2: Upload image to Printify
//     const uploadedImage = await uploadImageToPrintify(imageUrl);
//     const imageId = uploadedImage.id; // Extract the image ID from the response

//     // Step 3: Fetch blueprints and print providers
//     const blueprints = await getBlueprints();
//     const printProviders = await getPrintProviders(productDetails.blueprint_id);

//     // Ensure valid data
//     if (!printProviders || printProviders.length === 0) {
//       return res
//         .status(400)
//         .json({ error: "No print providers found for this blueprint." });
//     }

//     // Assuming you have valid blueprint and print provider
//     const selectedPrintProvider = printProviders[0]; // Adjust logic to select the appropriate provider
//     const variants = await getVariants(
//       productDetails.blueprint_id,
//       selectedPrintProvider.id
//     );

//     // Prepare product data
//     const productData = {
//       title: "Custom AI-Genereted Phone Case",
//       description: "A phone case with AI-generated artwork.",
//       blueprint_id: productDetails.blueprint_id,
//       print_provider_id: selectedPrintProvider.id,
//       variants: variants,
//       print_areas: [
//         {
//           variant_ids: variants.map((v) => v.id),
//           placeholders: [
//             {
//               position: "front",
//               images: [
//                 {
//                   id: imageId,
//                   x: 0,
//                   y: 0,
//                   scale: 1,
//                   angle: 0,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     };
//     console.log(productData);

//     // Step 4: Create product in Printify
//     const result = await createPrintifyProduct(productData);
//     res.json(result);
//   } catch (error) {
//     console.error("Error in creating product:", error);
//     res
//       .status(599)
//       .json({ error: "Failed to create product", details: error.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // TO RUN OVER HTTPS
// // const PORT = process.env.PORT || 5000;
// // https.createServer(sslOptions, app).listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });



const express = require("express");
const { generateImage } = require("../openAiImageGeneration");
const { uploadImageToPrintify, createPrintifyProduct } = require("../printifyApi");

const app = express();
app.use(express.json());

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
