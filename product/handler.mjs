import { readJsonFile } from "./helper.mjs";

export const getProductsList = async (event) => {
  try {
    const data = await readJsonFile()
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.log("ERROR:->", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong" })
    };
  }
};

export const getProductsById = async (event) => {
  try {
    const data = await readJsonFile();
    const id = event.pathParameters["productId"];
    const productDetails = data.find((product) => product.productId === id);
    return {
      statusCode: productDetails ? 200 : 404,
      body: JSON.stringify(
        productDetails ?? { message: "Product not found" }
      )
    };
  } catch (error) {
    console.log("ERROR:->", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Something went wrong" })
    };
  }
}


