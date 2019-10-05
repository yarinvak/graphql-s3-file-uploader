const as = require('awaitify-stream');

const aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new aws.S3();

let uploadToS3 = async (data: Buffer, filename: string, mimetype: string) => {
    const params = {
        Bucket: 'graphql-files', // pass your bucket name
        Key: filename, // file will be saved as testBucket/contacts.csv
        Body: data,
        ContentType: mimetype,
        ContentDisposition: 'inline',
        ACL: 'public-read'
    };
    return s3.upload(params).promise();
};

let validateFile = function (mimetype: any) {
    const supportedTypes = ["application/pdf", "text/plain", "image/jpeg"];
    if (supportedTypes.indexOf(mimetype) == -1) {
        throw Error("unsupported mimetype of file");
    }
};

let handleFileData = async function (buffer: Array<any>, filename: string, mimetype: string) {
    let data = Buffer.concat(buffer);
    return uploadToS3(data, filename, mimetype);
};

const uploadFile = async (parent, {file, metadata}) => {
    const {stream, filename, mimetype, encoding} = await file;
    await metadata;
    validateFile(mimetype);
    let buffer: Array<any> = [];
    let reader = as.createReader(stream);

    let chunk;
    while (null !== (chunk = await reader.readAsync())) {
        buffer.push(chunk);
    }

    try {
        let res = await handleFileData(buffer, filename, mimetype);
        console.log(`File uploaded successfully at ${res.Location}`)
    }
    catch (err) {
        console.log(err);
    }

    return {filename, mimetype, encoding, metadata};
};

export {uploadFile};