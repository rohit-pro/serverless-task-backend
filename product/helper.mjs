import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

const filePath = 'products.json';

export const readJsonFile = async () => {
    try {
        const data = await readFileAsync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        throw (error);
    }
}