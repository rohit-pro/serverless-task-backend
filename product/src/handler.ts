import { ProductService } from "./service";

export const getProductsList = async (event: any) => {
    return await ProductService.getProductsList(event)
};


export const getProductsById = async (event: any) => {
    return await ProductService.getProductsById(event)
}

export const createProduct = async (event: any) => {
    return await ProductService.createProduct(event)
}