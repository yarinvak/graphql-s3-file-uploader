import {gql} from 'apollo-server';

const typeDefs = gql`
    type File{
        filename: String!
        mimetype: String!
        encoding: String!
        url: String!
        metadata: Metadata
    }
    
    type Metadata{
        referenceName: String
        region: String
    }
    
    type Query{
        files: [File]
    }
    
    input FileMetadata{
        referenceName: String
        region: String
    }
    
    type Mutation{
        uploadFile(file: Upload!, metadata: FileMetadata): File!
    }
`;

export {typeDefs};