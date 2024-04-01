import { ProductService } from "./service";

export const getProductsList = async () => {
    return await ProductService.getProductsList()
};


export const getProductsById = async (event: any) => {
    return await ProductService.getProductsById(event)
}