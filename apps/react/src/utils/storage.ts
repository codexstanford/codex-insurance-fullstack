const AFTER_LOGIN_ACTION_KEY = "afterLoginAction";

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
