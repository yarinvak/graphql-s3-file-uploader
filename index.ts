import {ApolloServer} from "apollo-server";
import {typeDefs} from "./schema/schema";
import {uploadFile} from "./schema/upload-file-resolver";
import dotenv from 'dotenv';

dotenv.config();

const resolvers = {
    Mutation: {
        uploadFile: uploadFile
    }
};

const server = new ApolloServer({typeDefs, resolvers});
server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
});