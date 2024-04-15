export type Product = {
    description: string,
    id: string,
    price: number,
    title: string
}

export type Response = {
    statusCode: number,
    body: string
}

export type Stock = {
    product_id: string,
    count: number
}