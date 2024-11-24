import {  Select, Tooltip } from "antd";
import styles from "./select.module.css";

const { Option } = Select;

interface OptionType {
  label: string;
  value: string;
  id:string;
}
function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
interface SelectsProps {
  errors?: string;
  labels?: string;
  id: string;
  required?: boolean;
  options: OptionType[];
  value: string;
  handleChange: (value: string) => void;
  disabled?: boolean;
  customClass?: string;
  wrap?: boolean;
  isMultiple?: boolean;
  style?: React.CSSProperties;
  check?: boolean;
  istooltip?:boolean;
}

const Selects: React.FC<SelectsProps> = ({
  errors,
  labels,
  id,
  required,
  options,
  value,
  handleChange,
  disabled = false,
  customClass,
  wrap = false,
  isMultiple = false,
  style,
  check = false,
  istooltip=false,
}) => {
  const selectStyle = wrap ? {} : {};
  const sanitizedValue = isMultiple
    ? Array.isArray(value)
      ? value.filter((val) => val !== "")
      : []
    : value;
 
    const filterOption = (input: string, option: any) => {
      const normalizedInput = removeVietnameseTones(input.toLowerCase());
      const normalizedLabel = removeVietnameseTones(option?.label.toLowerCase());
      return normalizedLabel.includes(normalizedInput);
    };
  return (
    <>
      <div
        className={`${styles.selects} ${customClass} ${
          wrap ? styles.wrap : ""
        } ${check ? styles.checkTrue : ""}`}
      >
        {labels && (
          <label htmlFor={id}>
            {labels} {required && <span className={styles.red}>*</span>}
          </label>
        )}
        <div className={customClass}>
          <Select
            mode={isMultiple ? "multiple" : undefined}
            id={id}
            value={sanitizedValue}
            onChange={handleChange}
            disabled={disabled}
            style={{ width: "100%", height: "38px", ...selectStyle, ...style }}
            showSearch
            optionFilterProp="label"
            filterOption={filterOption}
            virtual
            maxTagCount={isMultiple ? "responsive" : undefined}
            
          >
            {options.map((option) => (
              <Option
                key={option.id}
                value={option.value}
                label={option.label}
              >
                
                {istooltip ? (
                  <Tooltip
                    title={option.label}
                    overlayClassName={styles.customTooltip}
                  >
                    {option.label}
                  </Tooltip>
                ) : (
                  option.label
                )}
              </Option>
            ))}
          </Select>
          {errors && <span className={styles.red}>{errors}</span>}
        </div>
      </div>
    </>
  );
};

export default Selects;