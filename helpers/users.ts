import axios from "axios";
import { RANDOM_USER_API } from "../constants";

// get dummy user data from "https://randomuser.me/api"
export function getRandomUsers(count = 8) {
  return new Promise<any[]>((resolve, reject) => {
    axios
      .get(`${RANDOM_USER_API}?results=${count}`)
      .then((response) => resolve(response.data.results))
      .catch(reject);
  });
}
