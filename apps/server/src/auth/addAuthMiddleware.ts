import { Express } from "express";
import session from "express-session";
import connectsqlite3 from "connect-sqlite3";
import passport from "passport";
import cookieParser from "cookie-parser";
import { createGoogleStrategy } from "./googleStrategy";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare global {
  namespace Express {
    interface User {
      id: number;
      displayName: string | null;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                            Configuring passport                            */
/* -------------------------------------------------------------------------- */

function configurePassport() {
  passport.serializeUser((user, cb) => {
    // console.log("serializeUser", user);
    process.nextTick(() => {
      cb(null, user);
    });
  });

  passport.deserializeUser((user, cb) => {
    // console.log("deserializeUser", user);
    process.nextTick(() => {
      return cb(null, user as Express.User);
    });
  });

  passport.use(createGoogleStrategy);
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
