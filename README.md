# graphql-s3-file-uploader

an example of a graphql service that receives files upload using mutlipart request, and sends them to an aws s3 bucket.

## Usage
run ``npm i``, and then `npm run start`.

You can alter the graphql schema using `schema.ts` file.

Also, create your own `.env` file, and supply it your aws credentials.

## Uploading files

You can view `request-example.txt` file to see how the http request should look like in order to use it.

If using postman, create a new POST request, with a `Content-Type = multipart/form-data` header.

The body should be of type `form-data`, and include 3 key-values:

- `operations`: contains the graphql query inside a json. For example:
```json
{"query": "mutation($file: Upload!, $metadata: FileMetadata){ uploadFile(file: $file, metadata: $metadata){filename, mimetype, metadata{referenceName, region} url} }", "variables": {"metadata": {"referenceName": "m-11", "region": "israel"}}}
```
- `map`: contains the mapping for the variables. 
```json
{"0": ["variables.file"]}
```
it says put inside variables.file (the graphql var) the value of key 0.

- `0`:  change the type to file, and put here the file you wish to upload. It will be mapped to the file variable of the graphql query.