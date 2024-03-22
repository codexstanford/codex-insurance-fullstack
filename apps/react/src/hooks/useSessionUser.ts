import { CLIENT_SESSION_USER_WINDOW_FIELD, SessionUser } from "common";

export default function useSessionUser() {
  const sessionUser = (window as any)[CLIENT_SESSION_USER_WINDOW_FIELD] as
    | SessionUser
    | undefined;

  return sessionUser;
}
