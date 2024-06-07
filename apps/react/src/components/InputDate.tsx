import { useCallback, useContext, useState } from "react";
//import { InputContext } from "../contexts/inputContext";
import { COMMON_INPUT_CLASSES } from "../consts/classes.const";

type InputDateProps = {
  value: string; // ISO date string "YYYY-MM-DD"
  onChange: (newDate: Date) => void;
  onBlur?: () => void;
};

const InputDate: React.FC<InputDateProps> = ({
  value,
  onChange,
  onBlur
}) => {
//  const inputContext = useContext(InputContext);
//  if (!inputContext) {
//    throw new Error("InputContext must be provided");
//  }

  const [inputValue, setInputValue] = useState(value);
  console.log("inputValueinInputDate", inputValue);
  console.log("valueinInputDate", value);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateValue = e.target.value; // "YYYY-MM-DD" format
    setInputValue(newDateValue);
    if (newDateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = newDateValue.split('-');
      const year = parts[0] || '1970'; // Default to 1970 if undefined
      const month = parts[1] || '01'; // Default to January if undefined
      const day = parts[2] || '01'; // Default to the first day if undefined
      onChange(new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)));
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
