import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    getAllUsers: [UserData!]!
    getUserById(id: ID!): UserData
    getUserByEmail(email: String!): IfUser
  }

  type Mutation {
    createUser(
      name: String!
      profileImageUrl: String!
      email: String!
    ): UserData!

    deleteUser(id: ID!): IfUser

    sendMessage(
      content: String
      date: String
      fromId: String
      id: String
      toId: String
    ): MessageData
  }

  type UserData {
    id: ID!
    name: String!
    profileImageUrl: String!
    email: String!
  }

  type ErrorType {
    statusCode: Int!
    message: String!
  }

  union IfUser = UserData | ErrorType

  type Subscription {
    getMessages: MessageData!
  }

  type MessageData {
    content: String
    id: String
    fromId: String
    date: String
    toId: String
  }
`;

export default typeDefs;
