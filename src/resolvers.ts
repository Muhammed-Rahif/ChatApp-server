import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
} from "../controllers/users";
import { UserDataType } from "../types/user";
import { ErrorType } from "../types/error";
import { ON_MESSAGE } from "../constants/events";

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
    getUserById: (_: any, { id }: any, __: any) => getUser(id),
  },
  Mutation: {
    createUser: (_: any, userData: UserDataType) => createUser(userData),
    deleteUser: (_: any, { id }: any) => deleteUser(id),
  },
  DeletedUser: {
    __resolveType: (obj: UserDataType | ErrorType) => {
      if (obj.hasOwnProperty("statusCode")) return "ErrorType";

      if (obj.hasOwnProperty("id")) return "UserData";

      return null;
    },
  },
};

export default resolvers;
