import { Input } from 'antd';
import styles from './input.module.css';

export default function Inputs(props) {
  const {
    errors,
    value,
    id,
    name,
    onChange,
    touched,
    placeholder,
    labels,
    customClass,
    required,
    type,
    disabled = false,
    wrap = false,
    space,
  } = props;

  return (
    <div className={`${styles.inputs} ${customClass} ${wrap ? styles.wrap : ''}`}>
      {labels && (
        <label htmlFor={id}>
          {labels}: {required && <span className={styles.red}>*</span>}
        </label>
      )}
      <div>
        <Input
          id={id}
          onChange={onChange}
          status={touched && errors ? 'error' : ''}
          value={value}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          
        />
        {errors && <span className={styles.red}>{errors}</span>}
      </div>
    </div>
  );
}
