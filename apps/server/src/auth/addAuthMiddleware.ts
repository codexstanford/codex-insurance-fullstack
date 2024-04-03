import { SessionUser } from "common";
import connectsqlite3 from "connect-sqlite3";
import cookieParser from "cookie-parser";
import { Express } from "express";
import session from "express-session";
import passport from "passport";
import { createGoogleStrategy } from "./googleStrategy";
import { createDummyStrategy } from "./dummyStrategy";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare global {
  namespace Express {
    interface User extends SessionUser {}
  }
}

/* -------------------------------------------------------------------------- */
/*                            Configuring passport                            */
/* -------------------------------------------------------------------------- */

function configurePassport() {
  // Convert user retrieved from db to session user
  passport.serializeUser((dbUser, cb) => {
    process.nextTick(() => {
      // This is intentional done explicitly without using the spread operator
      // to ensure no unexpected fields are added to the session user
      cb(null, {
        id: dbUser.id,
        displayName: dbUser.displayName,
        givenName: dbUser.givenName,
        familyName: dbUser.familyName,
        email: dbUser.email,
        photoUrl: dbUser.photoUrl,
      } satisfies SessionUser);
    });
  });

  passport.deserializeUser((sessionUser: SessionUser, cb) => {
    process.nextTick(() => {
      return cb(null, sessionUser);
    });
  });

  passport.use(createGoogleStrategy());

  passport.use(createDummyStrategy());
}

/* -------------------------------------------------------------------------- */
/*                               Implementation                               */
/* -------------------------------------------------------------------------- */

export default function addAuthMiddleware(app: Express) {
  /* --------------------------- Configure passport --------------------------- */

  configurePassport();

  /* ----------------------------- Session support ---------------------------- */

  app.use(cookieParser());

  const SQLiteStore = connectsqlite3(session);

  let secret = process.env.SESSION_SECRET;

  if (!secret) {
    console.warn("No SESSION_SECRET set, using default");
    secret = "rD34KE6UmV7V";
  }

  app.use(
    session({
      secret,
      resave: false,
      saveUninitialized: false,
      // @ts-ignore
      store: new SQLiteStore({ db: "sessions.db", dir: "./var" }),
    }),
  );

  /* ------------------------- Add passport middleware ------------------------ */

  app.use(passport.authenticate("session"));
}
