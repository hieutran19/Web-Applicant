import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import styles from './styles.module.css';
import { DATE_FORMAT, MONTH_FORMAT } from '../../schemas/types';

export default function Dates(props: any) {
  const {
    disabled,
    defaultValue,
    onChange,
    labels,
    errors,
    customClass,
    required,
    wrap = false,
    show = 'date' ,
    name,
    stylecreate=false
  } = props;

  // Determine the format based on the 'show' prop
  const format = show === 'month' ? MONTH_FORMAT : DATE_FORMAT;

  // State to manage the date value
  const [value, setValue] = useState(defaultValue ? dayjs(defaultValue, format) : null);

  // Update the local state when the defaultValue prop changes
  useEffect(() => {
    setValue(defaultValue ? dayjs(defaultValue, format) : null);
  }, [defaultValue, format]);

  // Handle onChange to convert date to the specified format
  const handleChange = (date, dateString) => {
    if (date) {
      const formattedDate = dayjs(date).format(format);
      setValue(date); // Update local state
      onChange(date, formattedDate); // Send formatted date
    } else {
      setValue(null); // Handle invalid date if needed
      onChange(null, ''); // Handle invalid date if needed
    }
  };

  return (
    <div className={`${styles.dates} ${stylecreate ? styles.datecraete: ""} ${customClass} ${wrap ? styles.wrap : ''}`}>
      {labels && (
        <label htmlFor="label">
          {labels}: {required && <span>*</span>}
        </label>
      )}

       
        <DatePicker
        className={disabled ? styles.disabledDatePicker : ""}
          picker={show === 'month' ? 'month' : undefined}
          format={format}
          value={value}
          onChange={handleChange}
          name={name}
          disabled={disabled}
        />

      {errors && <span className={styles.red}>{errors}</span>}
    </div>
  );
}
