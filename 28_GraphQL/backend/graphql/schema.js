const { buildSchema } = require("graphql");

// module.exports = buildSchema(`
// type TestData {
//     text: String!
//     views: Int!
// }
// type RootQuery{
//     hello: TestData!
// }

// schema {
//         query: RootQuery
//     }
// `);

//----------------------------------------

module.exports = buildSchema(`

type Post {
    _id: ID!
    title: Stirng!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
}

type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    status: Stirng!
    posts: [Posts!]!
}


input UserInputData {
    email: String!
    name: String!
    password: String!
}
type RootMutation { 
    createUser(userInput: UserInputData): User!

}
schema {
        mutation: RootMutation
    }
`);
