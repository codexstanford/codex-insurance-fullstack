import { useCallback, useContext, useMemo, useState, useRef, useEffect } from "react";
import Datepicker from "tailwind-datepicker-react";
import { getButtonClassNames } from "./Button";
import { classNames } from "../utils/classNames";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";
import { InputContext } from "../contexts/inputContext.ts";
import { DateTime } from "luxon";
import { FaRegCalendarAlt } from 'react-icons/fa';

// https://github.com/OMikkel/tailwind-datepicker-react

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type InputDate_Input = Omit<
  React.ComponentProps<typeof Datepicker>,
  "show" | "setShow"
> & { onBlur?: () => void };

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

// We have to override the stuff that comes from Datepicker
const buttonClassNames = classNames(
  getButtonClassNames("gray"),
  "rounded-none",
);

const InputDate: React.FC<InputDate_Input> = ({
  options,
  onChange,
  onBlur,
  ...props
}) => {
  const inputContext = useContext(InputContext);

  const [show, setShow] = useState(false);

  const onChangeCallback = useCallback((date) => {
    const dateString = DateTime.fromJSDate(date).toISODate();
    setInputValue(dateString); // Updates the input with the selected date
    setShow(false); // Close the calendar
  }, []);
  

  const opts = useMemo(
    () => ({
      clearBtn: false,
      ...options,
      theme: {
        background: "rounded-none",
        todayBtn: buttonClassNames,
        clearBtn: buttonClassNames,
        icons: "",
        text: "text-black",
        disabledText: "",
        input: classNames(COMMON_INPUT_CLASSES, [
          !!inputContext?.isLocked,
          "bg-blue-200",
        ]),
        inputIcon: "hidden",
        selected: "bg-blue-200 hover:bg-blue-100 text-black",
      },
    }),
    [options, buttonClassNames, inputContext?.isLocked],
  );

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = useCallback((event) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue); // Update inputValue state
    
    const date = DateTime.fromISO(newInputValue).toJSDate();
    if (date.toString() !== "Invalid Date") {
      onChangeCallback(date); // Use the existing onChangeCallback for consistency
    }
  }, [onChangeCallback]);
  

  return (
    <>
    <style>
        {`
        .date-picker-wrapper input[type="text"][readonly] {
        border: none; /* Remove border */
        background: transparent; /* Optional: Make background transparent */
        }
        `}
    </style>
    <div className="relative">
        <button 
        onClick={() => setShow(!show)} 
        className="absolute right-0 top-0 mr-3 mt-2" // Adjust styling as needed
        >
        <FaRegCalendarAlt className="text-xl"/> {/* Replace with your calendar icon component */}
        </button>
        <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => {}}
        className={COMMON_INPUT_CLASSES + " w-full"}
        placeholder="YYYY-MM-DD"
      />
      {show && (
    <div className="date-picker-wrapper">
      <Datepicker
        {...props}
        show={show}
        setShow={setShow}
        onChange={onChangeCallback}
        options={opts}
      /></div>
      )}
    </div>
    </>
  );
};

export default InputDate;
