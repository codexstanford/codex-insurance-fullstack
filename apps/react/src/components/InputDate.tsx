import { DateTime } from "luxon";
import { useCallback, useMemo, useRef, useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import Datepicker from "tailwind-datepicker-react";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";
import { classNames } from "../utils/classNames";
import { stringToDate } from "../utils/epilogUtils";
import { getButtonClassNames } from "./Button";

// https://github.com/OMikkel/tailwind-datepicker-react

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type InputDateProps = {
    value: string; // ISO date string "YYYY-MM-DD"
    onChange: (newDate: Date) => void;
    onBlur?: () => void;
  };

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
  value,
  onChange,
  ...props
}) => {
  const [show, setShow] = useState(false);
  const datePickerWrapperRef = useRef(null);

  const onChangeCallback = useCallback(
    (date) => {
      const dateString = DateTime.fromJSDate(date).toISODate();
      setInputValue(dateString);
      onChange?.(date);
      // Keep the calendar open even after selecting a date
    },
    [onChange],
  );

  const opts = useMemo(
    () => ({
      ...options,
      theme: {
        selected: "bg-blue-500 hover:bg-blue-700 text-white",
      },
    }),
    [options],
  );

  const [inputValue, setInputValue] = useState(
    DateTime.fromJSDate(value).toISODate(),
  );

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShow(!show)}
          className="absolute right-0 top-0 mr-3 mt-2"
        >
          <FaRegCalendarAlt className="text-xl" /> {/* Calendar icon */}
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          onBlur={(e) => {
            // Check whether in correct format
            const pattern: RegExp = /^\d{4}-\d{2}-\d{2}$/;
            if (!pattern.test(inputValue)) {
              return;
            }
            // Check whether it's a valid date
            if (Number.isNaN(Date.parse(inputValue))) {
              return;
            }

            const [year, month, day] = inputValue.split("-");

            onChangeCallback(stringToDate(`${day}_${month}_${year}`));
          }}
          className={COMMON_INPUT_CLASSES + " w-full"}
          placeholder="YYYY-MM-DD"
        />
        {show && (
          <div className="date-picker-wrapper" ref={datePickerWrapperRef}>
            <Datepicker
              {...props}
              show={show}
              setShow={setShow}
              onChange={onChangeCallback}
              options={opts}
            />
            <button
              onClick={() => setShow(false)}
              className="absolute top-0 right-0 mt-2 mr-2 text-lg"
            ></button>
          </div>
        )}
      </div>
    </>
  );
};

export default InputDate;
