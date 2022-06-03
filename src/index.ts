import express from "express";
import jsonfile from "jsonfile";
import { DB_PATH } from "../constants";
import { getRandomUsers } from "../helpers/users";
import { UserDataType } from "../types/user";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "../schema";
import resolvers from "./resolvers";
import { PubSub } from "graphql-subscriptions";
import { getAllUsers } from "../controllers/users";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

const app = express();
const httpServer = createServer(app);
const schema = makeExecutableSchema({ typeDefs, resolvers });

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

export const pubsub = new PubSub();

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if your ApolloServer serves at
  // a different path.
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  context: (req: Request, res: Response) => ({ req, res, pubsub }),
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      subscriptionEndpoint: "ws://localhost:4000/graphql",
    }),
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();
server.applyMiddleware({ app });
