import express from "express";
import jsonfile from "jsonfile";
import { DB_PATH } from "../constants";
import { getRandomUsers } from "../helpers/users";
import { UserDataType } from "../types/user";
import { ApolloServer } from "apollo-server";
import typeDefs from "../schema";
import resolvers from "./resolvers";
import { PubSub } from "graphql-subscriptions";
import { getAllUsers } from "../controllers/users";

// adding dummy user to db on server startup --- will remove later
getRandomUsers().then((randomUsers) => {
  if (getAllUsers().length === 0) {
    randomUsers = randomUsers.map((rndmUser) => {
      let userData: UserDataType = {
        name: `${rndmUser.name.first} ${rndmUser.name.last}`,
        id: rndmUser.login.uuid,
        email: rndmUser.email,
        profileImageUrl: rndmUser.picture.large,
      };

      return userData;
    });

    jsonfile.writeFileSync(`.${DB_PATH}`, randomUsers);
  }
});

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req: Request, res: Response) => ({ req, res, pubsub }),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
