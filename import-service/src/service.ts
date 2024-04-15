import csvParser from "csv-parser";
import { getObject, getSignedUrl, moveObject, putObject } from "./aws-service";
import { Product, Response, Stock } from "./model";

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

export const ImportService = {
    uploadFile: async (event: any): Promise<Response> => {
        try {
            console.log("Request => ", event);
            const fileName = event.pathParameters["fileName"];
            const requestBody = event.body;
            const fileData = Buffer.from(requestBody, 'base64')
            await putObject(fileName, fileData)
            const signedUrl = getSignedUrl(fileName)
            return handleSuccess({ signedUrl });
        } catch (error) {
            return handleError(error)
        }
    },

    importFileParser: async (event: any): Promise<Response> => {
        try {
            console.log("Event => ", event);
            const bucket = event.Records[0].s3.bucket.name;
            const key = event.Records[0].s3.object.key;
            const params = {
                Bucket: bucket,
                Key: key,
            };
            const doc = await getObject(params);
            await moveObject(key)
            return handleSuccess(doc);
        } catch (error) {
            return handleError(error)
        }
    },


}



