import * as fs from "fs";

const aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new aws.S3();

let uploadToS3 = async (filePath, filename, mimetype) => {
    return fs.readFile(filePath, async (err, data) => {
        if (err) throw err;
        const params = {
            Bucket: 'graphql-files', // pass your bucket name
            Key: filename, // file will be saved as testBucket/contacts.csv
            Body: data,
            ContentType: mimetype,
            ContentDisposition: 'inline',
            ACL: 'public-read'
        };
        await s3.upload(params, function (s3Err, data) {
            if (s3Err) throw s3Err;
            console.log(`File uploaded successfully at ${data.Location}`)
        });
    });
};

let validateFile = function (mimetype: any) {
    const supportedTypes = ["application/pdf", "text/plain", "image/jpeg"];
    if (supportedTypes.indexOf(mimetype) == -1) {
        throw Error("unsupported mimetype of file");
    }
};

let handleFileData = function (buffer: Array<any>, filename: string, mimetype: string) {
    let data = Buffer.concat(buffer);
    fs.writeFile(`temp/${filename}`, data, {flag: 'w'}, async (err) => {
            if (err) {
                throw err;
            }
            console.log("file saved temporarily");
            try {
                await uploadToS3(`temp/${filename}`, filename, mimetype);
                console.log("successfully uploaded");
            }
            catch (err){
                console.log(err);
            }
        }
    );
};

const uploadFile = async (parent, {file, metadata}) => {
    const {stream, filename, mimetype, encoding} = await file;
    await metadata;
    validateFile(mimetype);

    let buffer: Array<any> = [];

    stream.on('ready', () => {
        console.log("stream is ready");
    });

    stream.on('data', function (chunk) {
        buffer.push(chunk);
    });

    stream.on('end', () => {
        console.log("stream is closed");
        handleFileData(buffer, filename, mimetype);
    });

    return {filename, mimetype, encoding, metadata};
};

export {uploadFile};