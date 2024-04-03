import { Strategy as LocalStrategy } from "passport-local";
import getOrCreateSSOUser from "../utils/getOrCreateSSOUser";

// https://www.passportjs.org/packages/passport-local/

export const createDummyStrategy = () => {
  return new LocalStrategy((username, _, cb) => {
    getOrCreateSSOUser("dummy", {
      provider: "dummy",
      id: username,
      displayName: username,
    })
      .catch((err) => cb(err))
      .then((user) => {
        if (!user) {
          cb(new Error("User creation failed"));
          return;
        }
        cb(null, user);
      });
  });
};
