import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/users";
import { UserDataType } from "../types/user";
import { ErrorType } from "../types/error";
import { RECEIVE_MESSAGE } from "../constants/events";
import { MessageType } from "../types/message";
import { PubSub } from "graphql-subscriptions";

const resolvers = {
  Subscription: {
    getMessages: {
      subscribe: (_: any, __: any, { pubsub }: { pubsub: PubSub }) =>
        pubsub.asyncIterator(RECEIVE_MESSAGE),
    },
  },
  Query: {
    getAllUsers,
    getUserById: (_: any, { id }: any) => getUser(id),
    getUserByEmail: (_: any, { email }: any) => getUserByEmail(email),
  },
  Mutation: {
    createUser: (_: any, userData: UserDataType) => {
      createUser(userData);
    },
    deleteUser: (_: any, { id }: any) => deleteUser(id),

    sendMessage: (
      _: any,
      { content, date, fromId, id, toId }: MessageType,
      { pubsub }: { pubsub: PubSub }
    ): MessageType => {
      pubsub.publish(RECEIVE_MESSAGE, {
        content,
        fromId,
        id,
        toId,
      });

      return { content, date, fromId, id, toId };
    },
  },
  IfUser: {
    __resolveType: (obj: UserDataType | ErrorType) => {
      if (obj.hasOwnProperty("statusCode")) return "ErrorType";

      if (obj.hasOwnProperty("id")) return "UserData";

      return null;
    },
  },
};

export default resolvers;
