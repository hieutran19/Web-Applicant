import { Radio } from 'antd';
import styles from './Radios.module.css';

export default function Radios(props: any) {
  const {
    errors,
    value,
    id,
    name,
    onChange,
    touched,
    options,
    labels,
    customClass,
    required,
    disabled = false,
    wrap = false
  } = props;

  return (
    <div className={`${styles.inputs} ${customClass} ${wrap ? styles.wrap : ''}`}>
      {labels && (
        <label htmlFor={id}>
          {labels}: {required && <span className={styles.red}>*</span>}
        </label>
      )}
      <div>
        <Radio.Group
          style={{ gap: '10px', justifyContent: 'space-between' }}
          id={id}
          onChange={onChange}
          value={value}
          name={name}
          disabled={disabled}
        >
          {options.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
        {touched && errors && <span className={styles.red}>{errors}</span>}
      </div>
    </div>
  );
}
