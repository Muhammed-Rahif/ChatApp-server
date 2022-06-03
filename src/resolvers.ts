import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  getUserByEmail,
} from "../controllers/users";
import { UserDataType } from "../types/user";
import { ErrorType } from "../types/error";
import { ON_MESSAGE } from "../constants/events";
import { MessageType } from "../types/message";

const resolvers = {
  Subscription: {
    onMessage: {
      subscribe: (_: any, __: any, { pubsub }: any) => {
        pubsub.asyncIterator(ON_MESSAGE);
      },
    },
  },
  Query: {
    getAllUsers,
    getUserById: (_: any, { id }: any) => getUser(id),
    getUserByEmail: (_: any, { email }: any) => getUserByEmail(email),
  },
  Mutation: {
    createUser: (_: any, userData: UserDataType) => createUser(userData),
    deleteUser: (_: any, { id }: any) => deleteUser(id),

    // sendMessage: (_: any, { content }: MessageType) => {},
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
