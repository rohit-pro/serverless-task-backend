import { ImportService } from "./service";

export const importProductsFile = async (event: any) => {
    return await ImportService.uploadFile(event)
};

export const importFileParser = async (event: any) => {
    return await ImportService.importFileParser(event)
};


