import jsonfile from "jsonfile";
import { DB_PATH } from "../constants";
import { v4 } from "uuid";
import { UserDataType } from "../types/user";

export function getAllUsers(): UserDataType[] {
  const users: UserDataType[] = jsonfile.readFileSync(`.${DB_PATH}`);

  return users;
}

export function getUser(id: typeof v4): UserDataType | null {
  const users: UserDataType[] = jsonfile.readFileSync(`.${DB_PATH}`);

  const user: UserDataType | null =
    users.find((users) => users.id == id) || null;

  return user;
}

export function createUser(newUserData: UserDataType) {
  newUserData.id = v4();

  const existingUsers: UserDataType[] = jsonfile.readFileSync(`.${DB_PATH}`);
  existingUsers.push(newUserData);

  jsonfile.writeFileSync(`.${DB_PATH}`, existingUsers);

  return newUserData;
}

export function deleteUser(id: typeof v4): UserDataType | ErrorType {
  const users: UserDataType[] = jsonfile.readFileSync(`.${DB_PATH}`);

  let userIndex = users.findIndex((userData) => userData.id == id);

  let deletedUser: UserDataType | ErrorType = {
    statusCode: 404,
    message: "User not found",
  };

  if (userIndex !== -1) {
    deletedUser = users.splice(userIndex, 1)[0];
    jsonfile.writeFileSync(`.${DB_PATH}`, users);
  }

  return deletedUser;
}
