import { Select } from 'antd';
import styles from './selectModal.module.css';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounces';

export default function SelectAPIs(props: any) {
  const {
    labels,
    id,
    required,
    customerClass,
    name,
    handleChange,
    errors,
    wrap = false,
    value = "",
    perPage = 10,
    optionsAPI,
    show,
    hasAllItem = false,
    allItemLabel = "",
    setDefaultValue,
    defaultValue,
  } = props;

  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
console.log("test", defaultValue)
  const formatOption = (option: any) => {
    if (show === "name") {
      return { label: option?.name, value: option?.id };
    } else if (show === "employee") {
      return {
        label: `${option?.name} (${option?.work_email})`,
        value: option?.id,
      };
    } else if (show === "bank") {
      return {
        label: `${option?.abbreviation} (${option?.name})`,
        value: option?.abbreviation,
      };
    }
    return option;
  };

  const fetchOptions = async (newPage = 1) => {
    setIsLoading(true);
    try {
      const params = {
        page: newPage,
        perPage: perPage,
        searchKey: searchValue,
      };
      const res = await optionsAPI(params);
      const { employee, employees, report_manager, country, all_bankings, hr_in_charge } = res?.data;
      const fetchedOptions = employee || employees || report_manager || country || all_bankings || hr_in_charge;

      if (fetchedOptions?.length > 0) {
        setOptions((prevOptions) => [
          ...(newPage === 1 ? [] : prevOptions),
          ...fetchedOptions,
        ]);
        setHasMore(newPage < res?.data?.last_page);

        if (
          newPage === 1 &&
          setDefaultValue &&
          !value &&
          fetchedOptions.length > 0
        ) {
          setDefaultValue(formatOption(fetchedOptions[0]).value);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching options");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchValue = useDebounce(searchValue, 1000);

  useEffect(() => {
    setPage(1);
    setOptions([]);
    fetchOptions(1);
  }, [debouncedSearchValue]);

  const handleSearch = (searchKey: any) => {
    setSearchValue(searchKey);
  };

  const handleViewMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOptions(nextPage);
  };

  return (
    <div
      className={`${styles.selects} ${customerClass} ${
        wrap ? styles.wrap : ""
      }`}
    >
      {labels && (
        <label htmlFor={id}>
          {labels}: {required && <span className={styles.red}>*</span>}
        </label>
      )}
      <div className={styles.select}>
        <Select
          fieldNames={name}
          onChange={handleChange}
          options={[
            ...(hasAllItem ? [{ value: "", label: allItemLabel }] : []),
            ...(defaultValue &&
            !options.some(
              (option) =>
                formatOption(option).value == formatOption(defaultValue).value
            ) &&
            debouncedSearchValue != null
              ? [formatOption(defaultValue)]
              : []),
            ...options.map((option) => formatOption(option)),
          ]}
          showSearch
          onSearch={handleSearch}
          filterOption={false}
          value={
            value ||
            (options.length <= 0
              ? undefined
              : hasAllItem
              ? ""
              : formatOption(options[0]))
          }
          loading={isLoading}
          dropdownRender={(menu) => (
            <>
              {menu}
              {hasMore && (
                <div className={styles.viewMoreContainer}>
                  <button
                    onClick={handleViewMore}
                    className={styles.viewMoreButton}
                  >
                    View More
                  </button>
                </div>
              )}
            </>
          )}
        />
        {errors && <span className={styles.red}>{errors}</span>}
      </div>
    </div>
  );
}
