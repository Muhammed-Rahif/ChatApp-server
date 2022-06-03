import {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
} from "../controllers/users";
import { UserDataType } from "../types/user";

const resolvers = {
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
