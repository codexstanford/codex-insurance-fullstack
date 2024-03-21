//@ts-ignore
import GoogleStrategy from "passport-google-oidc";
import { Profile } from "passport";
import getOrCreateSSOUser from "../utils/findOrCreateSSOUser";

// https://www.passportjs.org/packages/passport-google-oidc/
// https://www.passportjs.org/tutorials/google

export const GOOGLE_REDIRECT_URL = "/redirect/google";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env["GOOGLE_CLIENT_ID"],
    clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
    callbackURL: "/api/auth" + GOOGLE_REDIRECT_URL,
    scope: ["profile"],
  },
  function verify(
    issuer: string,
    profile: Profile,
    cb: (
      err: Error | null,
      user?: { id: number; displayName: string | null },
    ) => void,
  ) {
    getOrCreateSSOUser(issuer, profile)
      .catch((err) => cb(err))
      .then(() => {
        console.log(profile);
        cb(null, { id: 999, displayName: profile.displayName });
      });
  },
);
