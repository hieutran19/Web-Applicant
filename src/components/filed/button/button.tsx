import styles from './button.module.css';
import { Button } from 'antd';

// Thay `key` bằng một tên prop khác, ví dụ `customKey`
export default function Buttons(props) {
  const { customKey, texts, icon, handleClick, classNames, types, status } = props;

  return (
    <Button
      onClick={handleClick}
      className={`${styles.button} ${
        status === 'success'
          ? styles.success
          : status === 'cancel'
          ? styles.cancel
          : status === 'primary'
          ? styles.primary
          : status === 'danger'
          ? styles.danger
          :status==='pause'
          ?styles.pause
          : ''
      } ${classNames}`}
      htmlType={types}
    >
      {icon && icon} {texts}
    </Button>
  );
}
