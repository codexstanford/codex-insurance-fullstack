import { useNavigate } from "react-router-dom";
import { SITUATIONS } from "../consts/situations.const";
import Searchbox from "./Searchbox";
import { ROUTES } from "common";

export default function SearchboxClaimReason({
  placeholder,
}: {
  placeholder?: string;
}) {
  const navigate = useNavigate();

  return (
    <Searchbox
      options={SITUATIONS}
      // TODO Redirect to service form that was actually selected
      onChange={(situation) => {
        if (situation) navigate(ROUTES.SERVICE + "/" + situation);
      }}
      resetAfterChange={true}
      placehoder={placeholder}
    />
  );
}
