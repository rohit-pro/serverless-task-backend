import { PRODUCTS } from "../src/products";
import { ProductService } from "../src/service";

describe("ProductService", () => {

    describe("getProductsList", () => {
        test("should return products list with status code 200", async () => {
            const mockData = PRODUCTS;
            const result = await ProductService.getProductsList();
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify(mockData)
            });
        });
    });

    describe("getProductsById", () => {
        test("should return product details with status code 200 if product exists", async () => {
            const event = { pathParameters: { productId: PRODUCTS[0].id } }; // Mock event object with path parameter
            const result = await ProductService.getProductsById(event);
            expect(result).toEqual({
                statusCode: 200,
                body: JSON.stringify(PRODUCTS[0])
            });
        });

        test("should return 'Product not found' message with status code 404 if product does not exist", async () => {
            const event = { pathParameters: { productId: "3" } }; // Mock event object with path parameter
            const result = await ProductService.getProductsById(event);
            expect(result).toEqual({
                statusCode: 404,
                body: JSON.stringify({ message: "Product not found" })
            });
        });
    });
});

