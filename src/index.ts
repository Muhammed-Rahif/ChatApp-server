import express from "express";
import jsonfile from "jsonfile";
import { DB_PATH } from "../constants";
import { getRandomUsers } from "../helpers/users";
import { UserDataType } from "../types/user";

const app = express();

// adding dummy user to db on server startup
getRandomUsers().then((randomUsers) => {
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
});

export default app;
