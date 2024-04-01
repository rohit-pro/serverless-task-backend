import { Product, Response } from "./model";
import { PRODUCTS } from "./products";

export const ProductService = {
    getProductsList: async (): Promise<Response> => {
        try {
            const data: Product[] = PRODUCTS
            return {
                statusCode: 200,
                body: JSON.stringify(data)
            };
        } catch (error) {
            console.log("ERROR:->", error);
            return {

                statusCode: 500,
                body: JSON.stringify({ message: "Something went wrong", error })
            };
        }
    },

    getProductsById: async (event: any): Promise<Response> => {
        try {
            const data: Product[] = PRODUCTS;
            const id = event.pathParameters["productId"];
            const productDetails: Product | undefined = data.find((product) => product.id === id);
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
                body: JSON.stringify({ message: "Something went wrong", error })
            };
        }
    }

}

