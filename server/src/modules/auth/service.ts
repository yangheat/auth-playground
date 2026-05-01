import { AuthModel } from "./model"

const testUser = {
  username: "test",
  password:
    "$argon2id$v=19$m=65536,t=2,p=1$292kuacxOTrrlwxQm/rafWt55NKadhQASNiFQsFEFm0$pcZ7A5DCd1C3vuZHgAjBCOikMV5zWdcPZm1aOr1pCXM",
};

export abstract class Auth {
  static async verifyCredentials({ username, password }: AuthModel['credentials']) {
    if (
      username !== testUser.username ||
      !(await Bun.password.verify(password, testUser.password))
    ) {
      return false
    }

    return true
  }
}