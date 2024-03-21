import express, { Router } from "express";
import passport from "passport";
import { SUBSET_GOOGLE_REDIRECT } from "../auth/googleStrategy";
import { ROUTES } from "common";

// https://expressjs.com/en/4x/api.html#router
const authRouter: Router = express.Router();

/* --------------------------------- Goolge --------------------------------- */

authRouter.get(ROUTES.SUBSET_LOGIN_GOOGLE, passport.authenticate("google"));

authRouter.get(
  SUBSET_GOOGLE_REDIRECT,
  passport.authenticate("google", {
    failureRedirect: ROUTES.LOGIN,
    failureMessage: true,
  }),
  (_, res) => {
    res.redirect(ROUTES.INDEX);
  },
);

/* --------------------------------- Logout --------------------------------- */

authRouter.get(ROUTES.SUBSET_LOGUT, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// TODO Remove, only for testing purposes
authRouter.get("/session", (req, res) => {
  res.send(req.isAuthenticated());
});

export default authRouter;
