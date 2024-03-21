import express, { Router } from "express";
import passport from "passport";
import { GOOGLE_REDIRECT_URL } from "../auth/googleStrategy";

// https://expressjs.com/en/4x/api.html#router
const authRouter: Router = express.Router();

/* --------------------------------- Goolge --------------------------------- */

authRouter.get("/login/google", passport.authenticate("google"));

authRouter.get(
  GOOGLE_REDIRECT_URL,
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (_, res) => {
    console.log("Sucessful login!");
    res.redirect("/");
  },
);

/* --------------------------------- Logout --------------------------------- */

authRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

authRouter.get("/session", (req, res) => {
  res.send(req.isAuthenticated());
});

export default authRouter;
