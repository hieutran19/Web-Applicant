import { DatePicker, TimeRangePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const DateRange = ({ handleChange }) => {
  const { RangePicker } = DatePicker;

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      const formatDate = dateStrings[0] + ' - ' + dateStrings[1];
      handleChange(formatDate);
    } else {
      console.log('Clear');
    }
  };

  const rangePresets: TimeRangePickerProps['presets'] = [
    { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'Last 60 Days', value: [dayjs().add(-60, 'd'), dayjs()] },
    { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];

  return (
    <>
      <RangePicker
        presets={rangePresets}
        onChange={onRangeChange}
        format="DD/MM/YYYY"
        style={{ fontSize: '16px' }}
        size="middle"
      />
    </>
  );
};

export default DateRange;
