/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */

export const API = "/api";

export const API_AUTH = API + "/auth";

/** "Subset", because it'll have to be prefixed with /api/auth to form the full path. */
export const SUBSET_LOGIN_GOOGLE = "/login/google";
export const API_AUTH_LOGIN_GOOGLE = API_AUTH + SUBSET_LOGIN_GOOGLE;

/** "Subset", because it'll have to be prefixed with /api to form the full path. */
export const SUBSET_LOGUT = "/logout";
export const API_AUTH_LOGUT = API + SUBSET_LOGUT;

/* -------------------------------------------------------------------------- */
/*                                   CLIENT                                   */
/* -------------------------------------------------------------------------- */

export const INDEX = "/";

export const LOGIN = "/login";
