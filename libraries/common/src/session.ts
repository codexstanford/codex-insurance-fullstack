export interface SessionUser {
  id: number;
  displayName: string | null;
}

/**
 * If the user is logged in, the session user will be stored client side
 * in the field specified here of the window object. */
export const CLIENT_SESSION_USER_WINDOW_FIELD = "sessionUser";
