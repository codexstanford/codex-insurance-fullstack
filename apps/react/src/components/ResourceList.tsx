import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { ResourceListItem } from "../types/resourceListItem";
import { classNames } from "../utils/classNames";
import Container from "./Container";
import Heading from "./Heading";

type ResourceListProps = {
  heading?: string;
  items?: ResourceListItem[];
  linkToListPage: string;
  linkToAddNew?: string;
  expanded?: boolean;
  onClickRemove?: (resourceId: string) => void;
};

export default function ResourceList({
    heading,
    items = [],
    linkToListPage,
    linkToAddNew,
    expanded = false,
    onClickRemove,
  }: ResourceListProps) {
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
            onClickRemove={
              onClickRemove ? () => onClickRemove?.(item.id) : undefined
            }
          />
        ))}
      </div>
    </Container>
  );
}

type ResourceCardProps = {
    isAddNewCard?: boolean;
    label?: string;
    item?: any; // Specify a more specific type based on the actual structure of `item`
    linkTo?: string;
    onClickRemove?: () => void;
  };
  
  function ResourceCard({
    isAddNewCard = false,
    label = "Unnamed",
    item,
    linkTo = "#",
    onClickRemove,
  }: ResourceCardProps) {
  const isPersonItem = item && "dob" in item;
  const isClaimItem = item && "policyId" in item; // Assuming 'policyId' indicates a claim item

  const navigate = useNavigate();

  // Existing functions for formatting DOB and occupation
  const formatDOB = (dob: string) => {
    // Split the dob string by "_" and rearrange it to "YYYY-MM-DD" format
    const [day, month, year] = dob.split("_");
    const formattedDate = `${year}-${month}-${day}`;

    // Create a new date instance with the formatted date string
    const date = new Date(formattedDate);

    // Use toLocaleDateString to format the date as desired
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatClaimTime = (time: string): string => {
    const parts = time.split(" ");
    if (parts.length < 2) {
      return "Invalid time format";  // Appropriately handle cases where there's no space.
    }
  
    const [datePart = "", timePart = ""] = parts;
    const [day = 1, month = 1, year = 1970] = datePart.split("_").map(num => num ? Number(num) : 1);
    const [hours = 0, minutes = 0] = timePart.split("_").map(num => num ? Number(num) : 0);
  
    const date = new Date(year, month - 1, day, hours, minutes);
    return format(date, "PPPp");  // 'date-fns' format
  };
  

  const detailStyle: React.CSSProperties = {
    color: "#555",
    fontSize: "0.9rem",
    marginTop: "0.3rem",
    textAlign: "left" as "left" // Ensuring textAlign is correctly typed
  };
  

  const capitalizeOccupation = (occupation: string) =>
    occupation.replace(/(?:^|\s)\S/g, (a: string) => a.toUpperCase());

  // Function to generate friendly ID for claims
  const getFriendlyId = (id: string) => "Claim " + (parseInt(id.substring(5))+1);

  const formatLabel = (label: string) => label.split("_")
  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
  
  return (
    <>
    <button
      onClick={() => {
        navigate(linkTo);
      }}
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
        <PlusCircleIcon className="w-8 h-8" />
      ) : isPersonItem ? (
        <div className="space-y-2">
          <div className="flex flex-row items-center">
            <h3 className="text-lg font-semibold text-gray-700">
              {"Person " + item.id.slice(-1)}
            </h3>
            {onClickRemove && (
              <button onClick={onClickRemove} className="ml-auto">
                <TrashIcon className="w-6 h-6 text-red-500" />
              </button>
            )}
          </div>
          <p style={detailStyle}>DOB: {formatDOB(item.dob)}</p>
          <p style={detailStyle}>
            Occupation: {capitalizeOccupation(item.occupation)}
          </p>
          <p style={detailStyle}>
            Immunocompromised: {item.immunocompromised ? "Yes" : "No"}
          </p>
        </div>
      ) : isClaimItem ? (
        // New block for rendering claim items
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              {getFriendlyId(item.id)}
            </h3>
            {onClickRemove && (
              <button onClick={(e) => {
                // TODO: Find a more elegant way of stopping clicking on the trash icon from navigating to the page for the just-deleted
                e.stopPropagation();
                onClickRemove();
              }} className="ml-auto mr-0">
                <TrashIcon className="w-6 h-6 text-red-500" />
              </button>
            )}
          </div>
          {/* Example detail, adjust according to your data structure */}
          <p style={detailStyle}>Type of Service: {formatLabel(item.label)}</p>
          {/* Format the date of the claim, assuming item.time exists and is an ISO string */}
          {item.name && <p style={detailStyle}>Date: {formatClaimTime(item.time)}</p>}
        </div>
      ) : (
        // Fallback for items that are neither person nor claim
        <div className="text-lg font-semibold text-gray-700">{label}</div>
      )}
    </button>
    </>
  );
}
