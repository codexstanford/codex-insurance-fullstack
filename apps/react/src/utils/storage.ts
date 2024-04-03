const AFTER_LOGIN_ACTION_KEY = "afterLoginAction";
const DUMMY_USER_ID_KEY = "dummyUserKey";

export interface AfterLoginAction {
  redirectPath?: string;
  saveToUserDataset?: ReturnType<typeof definemorefacts>;
}

export const setAfterLoginAction = (action: AfterLoginAction | null) => {
  localStorage.setItem(AFTER_LOGIN_ACTION_KEY, JSON.stringify(action));
};

export const getAfterLoginAction = () => {
  const action = localStorage.getItem(AFTER_LOGIN_ACTION_KEY);
  if (action) {
    return JSON.parse(action) as AfterLoginAction;
  }
  return null;
};

export const getDummyUserId = () => {
  let dummyUserId = localStorage.getItem(DUMMY_USER_ID_KEY);
  if (!dummyUserId) {
    dummyUserId = "dummyUser_" + Math.random().toString(36).substring(7);
    localStorage.setItem(DUMMY_USER_ID_KEY, dummyUserId);
  }
  return dummyUserId;
};
