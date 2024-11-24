import { Checkbox } from 'antd';
import styles from './CheckBox.module.css';

export default function Checkboxes(props) {
  const { labels, required, customerClass, options, name, handleChange, value, touched, errors, 
    wrap = false,
    check = false,
    disabled=false  } = props;

  const onCheckboxChange = (checkedValues) => {
    // Đảm bảo bạn đang truyền các giá trị đã được chọn tới handleChange
    handleChange(name, checkedValues);
  };

  return (
<div className={`${styles.inputs} ${customerClass} ${wrap ? styles.wrap : ''}`}>
  {labels && (
    <label>
      {labels}: {required && <span className={styles.red}>*</span>}
    </label>
  )}
  <div>
    <Checkbox.Group
      className={styles.checkboxGroup}
      onChange={onCheckboxChange}
      value={value}
      disabled={disabled}
    >
      {options.map((option) => (
        <Checkbox  className={`${check ? styles.checkboxItem : ''} ${disabled ?styles.disabled:''}`}  key={option.value} value={option.value}>
          {option.label}
        </Checkbox>
      ))}
    </Checkbox.Group>
    {touched && errors && <div className={styles.red}>{errors}</div>}
  </div>
</div>

  );
}
