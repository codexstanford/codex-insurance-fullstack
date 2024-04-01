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
export const API_AUTH_LOGUT = API_AUTH + SUBSET_LOGUT;

export const SUBSET_USER_DATASET = "/userDataset";
export const API_USER_DATASET = API + SUBSET_USER_DATASET;

/* -------------------------------------------------------------------------- */
/*                                   CLIENT                                   */
/* -------------------------------------------------------------------------- */

export const INDEX = "/";

export const LOGIN = "/login";

export const SERVICE = "/service";

export const CLAIM = "/claim";

export const getClaimUrl = (claimId: string) => `${CLAIM}/${claimId}`;
