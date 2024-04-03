import { PRODUCTS } from '../src/products';
import { ProductService } from '../src/service';

const addProduct = async () => {
    const data = await Promise.all(PRODUCTS.map(product => ProductService.createProduct({ body: JSON.stringify(product) })));
    console.log("data");
}
addProduct()