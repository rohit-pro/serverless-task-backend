import { publishToSns, putItem, queryItems, scanItems } from "./aws-service";
import { CONFIG } from "./config";
import { Product, Response, Stock } from "./model";
import { v4 as uuid } from 'uuid';

const handleError = (error, statusCode = 500) => {
    console.log("ERROR:->", error);
    return {
        statusCode: statusCode,
        body: JSON.stringify({ message: "Something went wrong", error })
    };
}

const handleSuccess = (data, statusCode = 200) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(data)
    };
}

const getProductQueryItems = (id: string) => {
    return {
        TableName: CONFIG.PRODUCT_TABLE,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: { ':id': id }
    }
}

const getStockQueryItems = (id: string) => {
    return {
        TableName: CONFIG.STOCK_TABLE,
        KeyConditionExpression: 'product_id = :product_id',
        ExpressionAttributeValues: { ':product_id': id }
    }
}

export const ProductService = {
    getProductsList: async (event: any): Promise<Response> => {
        try {
            console.log("Request => ", event);
            const products = await scanItems(CONFIG.PRODUCT_TABLE) as Product[];
            const stocks = await scanItems(CONFIG.STOCK_TABLE) as Stock[];
            return handleSuccess(ProductService.getStockWiseProducts(products, stocks));
        } catch (error) {
            return handleError(error)
        }
    },

    getStockWiseProducts: (products: Product[], stocks: Stock[]) => {
        return products.map(product => ({
            ...product,
            count: stocks.find(stock => stock.product_id === product.id)?.count || 0
        }))
    },

    getProductsById: async (event: any): Promise<Response> => {
        try {
            console.log("Request => ", event);
            console.log("Path Parameters => ", event.pathParameters);
            const id = event.pathParameters["productId"];
            const products = await queryItems(getProductQueryItems(id));
            const stocks = await queryItems(getStockQueryItems(id))
            const stockCount = stocks.length ? stocks[0].count : 0;
            return handleSuccess((products.length) ? { ...products[0], count: stockCount } : { message: "Product not found" });
        } catch (error) {
            return handleError(error)
        }
    },

    createProduct: async (event: any): Promise<Response> => {
        try {
            console.log("Request => ", event);
            console.log("Payload => ", event.body);
            const { title, description, price, count } = JSON.parse(event.body);
            const error = ProductService.validatePayload(title, description, price, count);
            if (Object.keys(error).length)
                return handleError(error, 400)

            const product = { id: uuid(), title, description, price };
            await putItem(CONFIG.PRODUCT_TABLE, product)
            await putItem(CONFIG.STOCK_TABLE, { product_id: product.id, count })
            return handleSuccess({ message: "Product added Successfully" }, 201);
        } catch (error) {
            return handleError(error)
        }
    },

    validatePayload: (title: string, description: string, price: number, count: number) => {
        const error = {};
        if (!title) {
            error["title"] = "title is required";
        }
        if (!description) {
            error["description"] = "description is required";
        }
        if (typeof price !== 'number' || price <= 0) {
            error["price"] = "price should be grater than 0";
        }
        if (typeof count !== 'number' || count < 0) {
            error["count"] = "count should be 0 or grater than 0";
        }
        return error;
    },

    catalogBatchProcess: async (event: any) => {
        console.log("Request => ", event);
        const records = event.Records;
        for (const record of records) {
            const products = JSON.parse(record.body);
            for (const product of products) {
                product.price =  +product.price;
                product.count = +product.count;
                const error = ProductService.validatePayload(product.title, product.description, product.price, product.count);
                if (Object.keys(error).length)
                   console.log(error); 
                else {
                    product.id = uuid();
                    await putItem(CONFIG.PRODUCT_TABLE, product)
                    await putItem(CONFIG.STOCK_TABLE, { product_id: product.id, count: product.count })
                }
            }
          }
        await publishToSns();
        return handleSuccess({});
    }


}



