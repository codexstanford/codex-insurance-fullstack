import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { classNames } from "../utils/classNames";
import Container from "./Container";
import Heading from "./Heading";
import { Link } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { ResourceListItem } from "../types/resourceListItem";
import { IsAny } from "react-hook-form";
import { format, parseISO } from 'date-fns';

export default function ResourceList({
  heading,
  items = [],
  linkToListPage,
  linkToAddNew,
  expanded = false,
}: {
  heading?: string;
  items?: ResourceListItem[];
  linkToListPage: string;
  linkToAddNew?: string;
  expanded?: boolean;
}) {
  return (
    <Container makeGutter={true} className="relative">
      {!expanded && (
        <div className="flex flex-row gap-3 items-center">
          <Heading level={expanded ? 1 : 2}>{heading}</Heading>
          {linkToListPage && (
            <Link to={linkToListPage} className="font-semibold text-xl ml-auto">
              {items.length === 0 && <>See page</>}
              {items.length > 0 && <>See all ({items.length})</>}
            </Link>
          )}
        </div>
      )}
      <div
        className={classNames(
          "flex gap-3 w-full",
          [!expanded, "overflow-x-scroll flex-row"],
          [expanded, "flex-wrap"],
        )}
      >
        {linkToAddNew && (
          <ResourceCard isAddNewCard={true} linkTo={linkToAddNew} />
        )}
        {items.map((item, key) => (
          <ResourceCard
            key={key}
            label={item.label}
            item={item}
            linkTo={linkToListPage + "/" + item.id}
          />
        ))}
      </div>
    </Container>
  );
}

function ResourceCard({
  isAddNewCard = false,
  label = "Unnamed",
  item,
  linkTo = "#",
}: {
  isAddNewCard?: boolean;
  label?: string;
  item?: any;
  linkTo?: string;
}) {
const isPersonItem = item && 'dob' in item;
const formatDOB = (dob) => {
    // Split the dob string by "_" and rearrange it to "YYYY-MM-DD" format
    const [day, month, year] = dob.split("_");
    const formattedDate = `${year}-${month}-${day}`;
  
    // Create a new date instance with the formatted date string
    const date = new Date(formattedDate);
  
    // Use toLocaleDateString to format the date as desired
    return date.toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const detailStyle = {
    color: "#555",
    fontSize: "0.9rem", // Tailwind text-sm equivalent
    marginTop: "0.3rem",
  };

  
const capitalizeOccupation = (occupation) => 
    occupation.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  return (
    <>
      <Link
      to={linkTo}
      className={classNames(
        "flex gap-3 flex-col border-2 hover:bg-gray-100 rounded-lg p-3 h-36 w-72 flex-shrink-0",
        [!isAddNewCard, "bg-gray-200"],
        [
          isAddNewCard,
          "justify-center items-center border-gray-200 text-gray-400",
        ],
      )}
    >
      {isAddNewCard ? (
        <div className="flex flex-col items-center justify-center space-y-2">
          <PlusCircleIcon className="w-8 h-8" />
          <span>Add New</span>
        </div>
      ) : item && 'dob' in item ? (
        // Detailed rendering for person items
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">{"Person " + item.id.slice(-1)}</h3>
          <p style={detailStyle}>DOB: {formatDOB(item.dob)}</p>
          <p style={detailStyle}>Occupation: {capitalizeOccupation(item.occupation)}</p>
          <p style={detailStyle}>Immunocompromised: {item.immunocompromised ? "Yes" : "No"}</p>
        </div>
      ) : (
        // Default case for non-person items
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-700">{item.label}</h3>
        </div>
      )}
    </Link>
    </>
  );
}
