import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    getAllUsers: [UserData!]!
    getUserById(id: ID!): UserData
  }

  type Mutation {
    createUser(
      name: String!
      profileImageUrl: String!
      email: String!
    ): UserData!
    deleteUser(id: ID!): DeletedUser
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

  union DeletedUser = UserData | ErrorType

  type Subscription {
    onMessage: UserData!
  }
`;

export default typeDefs;
