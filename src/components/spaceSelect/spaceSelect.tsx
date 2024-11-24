import { Select, Space } from "antd";
import { useState, useEffect } from "react";

interface OptionType {
    name: string;
    label: string;
    value: string;
}

interface SpaceSelectProps {
    errors?: any;
    labels?: string;
    id?: string;
    required?: boolean;
    options: OptionType[];
    value?: string | string[];
    handleChange?: (value: string | string[]) => void;
    disabled?: boolean;
    customClass?: string;
    wrap?: boolean;
    isMultiple?: boolean;
    style?: React.CSSProperties;
    check?: boolean;
    istooltip?: boolean;
}

const SpaceSelect: React.FC<SpaceSelectProps> = ({
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
    istooltip = false,
}) => {
    const [uniqueNames, setUniqueNames] = useState<OptionType[]>(options);
    const [filteredOptions, setFilteredOptions] = useState<OptionType[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | string[]>(value || '');

    useEffect(() => {
        const names = [...new Set(options.map(item => item.name))].map(name => {
            return options.find(option => option.name === name) || { name: "", label: "", value: "" };
        });
        setUniqueNames(names);
        
    }, [options]);

    useEffect(() => {
      // Lọc các tùy chọn theo giá trị đã chọn
      if (selectedValue) {
          if (selectedValue == '0') { // Nếu chọn 'All', hiển thị tất cả
        
            setFilteredOptions(options);
          } else {
              const selectedName = options.find(option => option.value === selectedValue)?.name;
              const newFilteredOptions = options.filter(option => option.name === selectedName);
              setFilteredOptions(newFilteredOptions);
          }
      } else {
          setFilteredOptions(options);
      }
  }, [selectedValue, options]);

    const handleCountryChange = (value: string | string[]) => {
        setSelectedValue(value);
        if (handleChange) {
            handleChange(value);
        }
    };

    return (
        <Space.Compact className={customClass} style={style}>
            <Select 
                placeholder="Select Country" 
                options={uniqueNames.map(name => ({ label: name.name, value: name.value }))} 
                onChange={handleCountryChange} 
                value={selectedValue || undefined}
                disabled={disabled}
                mode={isMultiple ? 'multiple' : undefined}
            />   
            <Select 
                options={filteredOptions.map(option => ({ label: option.label, value: option.value }))} // Sử dụng tùy chọn đã lọc
                placeholder="Selected Country" 
            />
        </Space.Compact>
    );
};

export default SpaceSelect;
