import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utils/classNames";
import Container from "./Container";
import Heading from "./Heading";
import { Link } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ResourceListItem } from "../types/resourceListItem";

export default function ResourceList({
  heading,
  items = [],
  linkToOverivew = "#",
  linkAddNewTo = "#",
  expanded = false,
}: {
  heading: string;
  items?: ResourceListItem[];
  linkToOverivew?: string;
  linkAddNewTo?: string;
  expanded?: boolean;
}) {
  return (
    <Container makeGutter={true} className="relative">
      {!expanded && (
        <div className="flex flex-row gap-3 items-center">
          <Heading level={expanded ? 1 : 2}>{heading}</Heading>
          <Link to={linkToOverivew} className="font-semibold text-xl ml-auto">
            {items.length === 0 && <>See page</>}
            {items.length > 0 && <>See all ({items.length})</>}
          </Link>
        </div>
      )}
      <div
        className={classNames(
          "flex gap-3 w-full",
          [!expanded, "overflow-x-scroll flex-row"],
          [expanded, "flex-wrap"],
        )}
      >
        <ResourceCard isAddNewCard={true} linkTo={linkAddNewTo} />
        {items.map((item) => (
          <ResourceCard
            label={item.label}
            linkTo={linkToOverivew + "/" + item.id}
          />
        ))}
      </div>
    </Container>
  );
}

function ResourceCard({
  isAddNewCard = false,
  label = "Unnamed",
  linkTo = "#",
}: {
  isAddNewCard?: boolean;
  label?: string;
  linkTo?: string;
}) {
  return (
    <>
      <Link
        to={linkTo}
        className={classNames(
          "flex gap-3 flex-col border-2 hover:bg-gray-100 rounded-lg p-3 h-32 w-72 flex-shrink-0",
          [!isAddNewCard, "bg-gray-200"],
          [
            isAddNewCard,
            "justify-center items-center border-gray-200 text-gray-400",
          ],
        )}
      >
        {isAddNewCard && <PlusCircleIcon className="w-8 h-8" />}
        {!isAddNewCard && (
          <div className={classNames("flex gap-3 flex-row items-center")}>
            <h3 className="text-gray-600 font-semibold mr-auto">{label}</h3>
            <button>
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </Link>
    </>
  );
}
