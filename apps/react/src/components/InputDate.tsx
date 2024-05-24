import { useCallback, useContext, useMemo, useState, useRef, useEffect } from "react";
import Datepicker from "tailwind-datepicker-react";
import { getButtonClassNames } from "./Button";
import { classNames } from "../utils/classNames";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";
import { InputContext } from "../contexts/inputContext.ts";
import { DateTime } from "luxon";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { stringToDate } from "../utils/epilogUtils";

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

const InputDate: React.FC = ({
    value,
    onChange,
    onBlur,
    ...props
  }) => {
    const inputContext = useContext(InputContext);
    const [inputValue, setInputValue] = useState(value);
  
    const [show, setShow] = useState(false);
    const datePickerWrapperRef = useRef(null);
  
    const handleChange = useCallback((e) => {
        const newDateValue = e.target.value; // "YYYY-MM-DD" format
        setInputValue(newDateValue);
        if (newDateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
          onChange(stringToDate(newDateValue.replace(/-/g, "_"))); // Convert to "DD_MM_YYYY" format if needed
        }
      }, [onChange]);
  


      return (
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              name="coverageStartDate"
              value={inputValue}
              onChange={handleChange}
              onBlur={onBlur}
              className={COMMON_INPUT_CLASSES + " pl-4 pr-2 py-2 border rounded"}
              style={{ display: 'block', width: '100%', fontSize: '16px', lineHeight: '20px' }}
            />
          </div>
        </label>
      );
    };
    
    export default InputDate;