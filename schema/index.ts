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
    onMessage: UserData!
  }
`;

export default typeDefs;
