import React from "react";

// This context is provided by EpilogForms and is consumed by Constraints

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type IsConstraintLockedRecord = Record<string, boolean>;

export type ConstraintContext_Data = {
  getIsLocked: (constraintId: string) => boolean;
  onClickLock: (constraintId: string) => void;
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

export const createConstraintContextData = <T extends IsConstraintLockedRecord>(
  isLockedRecord: T,
  setIsLockedRecord: (isLockedRecord: T) => void,
) =>
  ({
    getIsLocked: (constraintId: string) => !!isLockedRecord[constraintId],
    onClickLock: (constraintId: string) => {
      if (isLockedRecord[constraintId] === false) return; // User can only unlock
      setIsLockedRecord({
        ...isLockedRecord,
        [constraintId]: !isLockedRecord[constraintId],
      });
    },
  }) satisfies ConstraintContext_Data;

export const ConstraintContext = React.createContext<
  ConstraintContext_Data | undefined
>(undefined);
