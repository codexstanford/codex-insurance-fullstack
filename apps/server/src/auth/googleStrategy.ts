//@ts-ignore that it's not typed
import GoogleStrategy from "passport-google-oidc";
import { Profile } from "passport";
import getOrCreateSSOUser from "../utils/getOrCreateSSOUser";
import { ROUTES } from "common";

// https://www.passportjs.org/tutorials/google
// https://www.passportjs.org/packages/passport-google-oidc/

/** "Subset" because it'll have to be prefixed with /api/auth to form the full path. */
export const SUBSET_GOOGLE_REDIRECT = "/redirect/google";

export const createGoogleStrategy = () => {
  const clientID = process.env["GOOGLE_CLIENT_ID"],
    clientSecret = process.env["GOOGLE_CLIENT_SECRET"];

  if (!clientID || !clientSecret) {
    console.error("Missing env var GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    throw new Error();
  }

  return new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: ROUTES.API_AUTH + SUBSET_GOOGLE_REDIRECT,
      scope: ["profile"],
    },
    function verify(
      _: string,
      profile: Profile,
      cb: (
        err: Error | null,
        user?: { id: number; displayName: string | null },
      ) => void,
    ) {
      getOrCreateSSOUser("google", profile)
        .catch((err) => cb(err))
        .then((user) => {
          if (!user) {
            return cb(new Error("User creation failed"));
          }
          cb(null, user);
        });
    },
  );
};
