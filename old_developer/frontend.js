// import { generateImage } from 'backend/OpenAiImageGeneration';
// import { productApi, uploadImageforCorrectDimension } from "backend/newBackend";
// import wixLocation from 'wix-location';
// import wixWindowFrontend from 'wix-window-frontend';
// import { local } from 'wix-storage-frontend';


// $w.onReady(() => {
// 	let generatedImageUrl = '';

// 	// When the user clicks "Generate Design" button
// 	$w("#generateDesignBtn").onClick(async () => {
// 		const userInput = $w('#input1').value;
// 		if (!userInput) {
// 			$w("#status").text = "Please enter a design prompt.";
// 			return;
// 		}

// 		showLoader();
// 		$w("#status").text = "Generating design...";

// 		const response = await generateImage(userInput); // Call backend function to generate image using OpenAI
// 		if (response?.success) {
// 			generatedImageUrl = response.url;
// 			showGeneratedImage(generatedImageUrl); // Show image to user
// 			createProduct(generatedImageUrl); // Create product in Printify
// 		} else {
// 			$w("#status").text = "Failed to generate image. Please try again.";
// 		}
// 		hideLoader();
// 	});

// 	const showGeneratedImage = (imageUrl) => {
// 		$w("#image1").src = imageUrl;
// 		$w("#image1").show();
// 		$w("#shopNow").show(); // Show 'Shop Now' button after successful generation
// 	};

// 	// Create the product on Printify
// 	const createProduct = async (imageUrl) => {
// 		showLoader();
// 		const product = await getProductFromPreviousPage(); // Get product data for the selected device
// 		const dimensionedData = await uploadImageforCorrectDimension(imageUrl, product.width, product.height); // Adjust image dimensions

// 		if (dimensionedData?.error) {
// 			$w("#status") = `Erro: ${dimensionedData.error}`;
// 			hideLoader();
// 			return;
// 		}

// 		product.imageUrl =dimensionedData.imageUrl;
// 		const createResponse = await productApi(product); // Crate product in Printify
// 		if (createResponse?.product) {
// 			local.setItem("GeneratedImgUrl", createResponse.productImages[0]);
// 			local.item("productId", createResponse.productId);
// 			$w("#status").text = "Product ready! Click 'Shop Now' to complete your purchase.";
// 		} else {
// 			$w("#status").text = "Failed to create product in Printify. Please try again.";
// 		}
// 		hideLoader();
// 	};

// 	// Redirect user to Printify purchase page
// 	$w("#shopNow").onClick(() => {
// 		const productId = local.getItem("productId");
// 		wixLocation.to(`https://printify.com/products/${productId}/buy`); // Redirect to Printify checkout page
// 	});

// 	const showLoader = () => {
// 		$w("#loader").show();
// 		$w("#loader").expand();
// 		$w("#status").show();
// 	};

// 	const hideLoader = () => {
// 		$w("#loader").hide();
// 		$w("#loader").collapse();
// 		$w("#status").hide();
// 	};

// 	const getProductFromPreviousPage = () => {
// 		const product = JSON.parse(local.getItem("product")); // Get stored product details
// 		return product;
// 	};
// });



import { generateImage, uploadImageforCorrectDimension } from 'backend/OpenAiImageGeneration'
import { productApi, saveForMailing, publishProduct } from "backend/newBackend"
import wixLocation from 'wix-location';
import wixWindowFrontend from "wix-window-frontend";

import { local } from 'wix-storage-frontend';
const baseUrl = 'https://imageurl-69om.onrender.com';
let retry = 0
$w.onReady(function () {
    // wixWindowFrontend.openLightbox("LightboxName");
    // const isProductAvailable = getProductFromPreviousPage("")
    // if (!isProductAvailable?.variantId) {
    //     wixLocation.to(`/sizeselection`);
    // }
    // global variable
    let imageUrl = ""
    // console.log("wixLocation.query.type", wixLocation?.query?.type)
$w("#button2").onClick(async () => {
          wixWindowFrontend.openLightbox("Select Device");
    })

    $w('#image1').src = "";

    $w("#button1").onClick(async () => {
        if ($w('#input1').value == "") {
            return;
        }
        buttonOneClicked($w('#input1').value)
    })
    const buttonOneClicked = async (input) => {

        hideImage()
        showLoader();
        $w("#status").text = "Generating Image..."
        const response = await generateImage(input);
        console.log("response on Page", response)
        if (response?.success) {
            // $w('#image1').src = response.url;
            imageUrl = response.url;

            // $w("#createProduct").show();
            setTimeout(() => {
                createProductAuto(response.url)
            }, 4000)

        } else {
            buttonOneClicked(input);
        }

    }
    $w('#shopNow').onClick(() => {
        wixLocation.to(`/yourvision`);
    })

    const createProductAuto = async (imageUrl) => {
        try {
            showLoader();
            const product = await getProductFromPreviousPage('');
            console.log("product",product)
            const data = await uploadImageforCorrectDimension(imageUrl, product.width, product.height)
            if (data?.error) {
                throw data?.error
            }
            // const newProduct = await getProductFromPreviousPage(`${baseUrl}/uploadfile/imageURL?imageName=${data.imageName}`);
            product.imageUrl = `${baseUrl}/uploadfile/imageURL?imageName=${data.imageName}`
            console.log("newProduct", product)
            createProductAtPrintify(product)
        } catch (err) {
            console.log("createProductAuto error", err)
            setTimeout(() => {
                createProductAuto(imageUrl)
            }, 2000);

        }
    }

});

const createProductAtPrintify = (product) => {
    console.log("product", product)
    productApi(product).then((res) => {
        console.log("createProductAtPrintify", res)
        showImage(res?.productImages[0])
        // $w('#image1').src = res?.productImages[0];
        let saveImageId = local.setItem("GeneratedImgUrl", res?.productImages[0]);
        let saveTitle = local.setItem("title", res?.title);
        let saveProductId = local.setItem("productId", res.productId);

        // console.log(res?.productImages[0])
        $w('#shopNow').show()
        hideLoader()

    }).catch((e) => {

        setTimeout(() => {
            createProductAtPrintify(product)
        }, 1000);
        console.log("createProductAtPrintify", "retrying");
    })
}

const showLoader = () => {
    $w("#loader").show()
    $w("#loader").expand();
    // hideUButtons();
    $w("#extraStatus").show();
    $w("#extraStatus").expand();
    $w("#image1").expand();
    $w("#button1").disable();

}
const hideLoader = () => {
    $w("#loader").hide()
    $w("#loader").collapse();
    // displayUButtons();
    $w("#button1").enable();
    $w("#extraStatus").hide();
    $w("#extraStatus").collapse();
}
const getProductFromPreviousPage = (url) => {
    const product = local.getItem("product");
    const parsedProduct = JSON.parse(product);
    console.log("parsedProduct", parsedProduct)
    return { ...parsedProduct, imageUrl: url }
}

const showAlert = (title = "Alert", message) => {
    if (message != "") {
        $w('#alertTitle').text = title;
        $w('#alertMsg').text = message;
        $w('#alertBox').expand();
        $w('#alertBox').show();

    }
    setTimeout(() => {
        $w('#alertBox').collapse();
        $w('#alertBox').hide();
    }, 3000)
}
const showImage = (url) => {
    $w('#image1').src = url;
    $w('#image1').show()
    $w('#shopNow').show()
}
const hideImage = (url) => {
    $w('#image1').src = '';
    $w('#image1').hide()
    $w('#shopNow').hide()
}

// $w("#createProduct").onClick(async () => {
//     try {
//         showLoader();
//         const product = await getProductFromPreviousPage('');
//         const data = await uploadImageforCorrectDimension(imageUrl, product.width, product.height)
//         if(data?.error){
//             showAlert("Error",data?.message)
//             hideLoader()
//             return
//         }
//         const newProduct = await getProductFromPreviousPage(`${baseUrl}/uploadfile/imageURL?imageName=${data.imageName}`);
//         console.log("newProduct",newProduct)
//         createProductAtPrintify(newProduct)
//     } catch (err) {
//         console.log(err)
//         hideLoader();
//     }
// })