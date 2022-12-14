const { buildSchema } = require("graphql");

//--------------------------------------

// module.exports = buildSchema(`

// type RootQuery {
//     hello: String
// }

// schema {
//         query: RootQuery
//     }
// `)

//---------------------------------------

// module.exports = buildSchema(`
// type TestData {
//     text: String!
//     views: Int!
// }

// type RootQuery {
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
    title: String!
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
    password: String
    status: String!
    posts: [Post!]!
}

type PostData {
    posts: [Post!]!
    totalPosts: Int!
}

input UserInputData {
    email: String!
    name: String!
    password: String!
}

input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
}

type RootMutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
    updatePost(id: ID!, postInput: PostInputData) : Post!
    deletePost(id: ID!): ID!
    updateUserStatus(status: String !): String!
}

type AuthenticationData {
    token: String!
    userId: String!
}

type RootQuery {
    login(email:String!, password: String!): AuthenticationData!
    getAllPosts(page: Int!): PostData!
    getOnePost(id: ID!): Post!
    getUserStatus: String!

}


schema {
    query: RootQuery
    mutation: RootMutation
}
`);
