import * as AWS from 'aws-sdk';
import { S3Client } from '@aws-sdk/client-s3';

import { CONFIG } from './config';
import { getParsed } from './csv-parser';

const credentials = {
    accessKeyId: CONFIG.ACCESS_KEY,
    secretAccessKey: CONFIG.SECRET_ACCESS_KEY,
};

const region = CONFIG.REGION;

const client = new S3Client({
    credentials,
    region
})

const s3 = new AWS.S3({
    credentials,
    region,
});


const bucketName = CONFIG.BUCKET;
export const putObject = (fileName: string, fileData: Buffer) => {
    const params = { Bucket: bucketName, Key: `uploaded/${fileName}`, Body: fileData, ACL: null };
    return s3.putObject(params).promise();
};

export const getSignedUrl = (fileName: string) => {
    const params = { Bucket: bucketName, Key: `uploaded/${fileName}`, Expires: 1800 };
    return s3.getSignedUrl('getObject', params);
};

export const moveObject = async (fileName: string) => {
    try {
        const sourceFolder = 'uploaded/'
        const destinationFolder = 'parsed/';
        const objects = await s3.listObjectsV2({ Bucket: bucketName, Prefix: sourceFolder }).promise();
        for (const object of objects.Contents) {
            if (object.Key === fileName) {
                const sourceKey = object.Key;
                const destinationKey = sourceKey.replace(sourceFolder, destinationFolder);
                await s3.copyObject({ Bucket: bucketName, CopySource: `${bucketName}/${sourceKey}`, Key: destinationKey }).promise();
                await s3.deleteObject({ Bucket: bucketName, Key: sourceKey }).promise();
                console.log(`Moved object from ${sourceKey} to ${destinationKey}`);
            }
        }
    } catch (err) {
        console.error('Error moving objects:', err);
    }
}

export const getObject = async (params: {
    Bucket: string,
    Key: string
}) => {
    try {
        const stream = s3.getObject(params).createReadStream();
        return getParsed(stream)
    } catch (error) {
        return null
    }

}