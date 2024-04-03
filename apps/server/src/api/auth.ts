import express, { Router } from "express";
import passport from "passport";
import { SUBSET_GOOGLE_REDIRECT } from "../auth/googleStrategy";
import { ROUTES } from "common";

// IMPORTANT NOTE
// All routes specifed here will be prefixed with /api/auth.
// So keep in mind not to repeat the /api/auth part in the routes here.

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
    res.redirect(ROUTES.DASHBOARD);
  },
);

/* ---------------------------------- Dummy --------------------------------- */

authRouter.post(
  ROUTES.SUBSET_LOGIN_DUMMY,
  (req, _, next) => {
    console.log(req.body);
    next();
  },
  passport.authenticate("local", {
    failureRedirect: ROUTES.LOGIN,
    failureMessage: true,
  }),
  (_, res) => {
    res.redirect(ROUTES.DASHBOARD);
  },
);

/* --------------------------------- Logout --------------------------------- */

authRouter.get(ROUTES.SUBSET_LOGUT, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(ROUTES.INDEX);
  });
});

export default authRouter;
