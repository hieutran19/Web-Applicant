import styles from './TextArea.module.css';
import TextArea from 'antd/es/input/TextArea';

export default function TextAreas(props) {
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
        <TextArea
        className={`${disabled ? styles.styleDisables:''}`}
          id={id}
          onChange={onChange}
          status={touched && errors ? 'error' : ''}
          value={value}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          type={type}
          rows={4}
        />
        {errors && <span className={styles.red}>{errors}</span>}
      </div>
    </div>
  );
}
