import { Tabs } from "antd";
import styles from "./menuBar.module.css";

const MenuBar = (props: any) => {
  const { defaultItem, items, onChange, classNames } = props;
  return (
    <Tabs
      defaultActiveKey={String(defaultItem)}
      items={items}
      onChange={onChange}
      className={`${classNames} ${styles.menuBar}`}
    />
  );
};

export default MenuBar;
