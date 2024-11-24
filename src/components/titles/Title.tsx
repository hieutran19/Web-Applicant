import styles from "./Titles.module.css";

export default function Tiles(props) {
  const { texts, customClass, fontSize = 16, fontWeight = 300 } = props;

  const activeFontSize = (size: number) => {
    switch (size) {
      case 16:
        return { className: styles.fonSize_16 };
      case 18:
        return { className: styles.fonSize_18 };
      case 22:
        return { className: styles.fonSize_22 };
      case 25:
        return { className: styles.fonSize_25 };
      case 27:
        return { className: styles.fonSize_27 };
      case 30:
        return { className: styles.fonSize_30 };
      case 32:
        return { className: styles.fonSize_32 };
      case 35:
        return { className: styles.fonSize_35 };
      case 37:
        return { className: styles.fonSize_37 };
      case 40:
        return { className: styles.fonSize_40 };
      case 42:
        return { className: styles.fonSize_42 };
      case 45:
        return { className: styles.fonSize_45 };
      case 47:
        return { className: styles.fonSize_47 };
      case 50:
        return { className: styles.fonSize_50 };
      default:
        return { className: styles.titles };
    }
  };

  const activeFontWeight = (Weight: number) => {
    switch (Weight) {
      case 300:
        return { class: styles.fontWeight_300 };
      case 400:
        return { class: styles.fontWeight_400 };
      case 500:
        return { class: styles.fontWeight_500 };
      case 600:
        return { class: styles.fontWeight_600 };
      case 700:
        return { class: styles.fontWeight_700 };
      case 800:
        return { class: styles.fontWeight_800 };
      case 900:
        return { class: styles.fontWeight_900 };
      default:
        return "";
    }
  };

  return (
    <h2
      className={`${customClass} ${activeFontSize(fontSize).className} ${
        activeFontWeight(fontWeight).class
      } ${styles.titles}`}
    >
      {texts}
    </h2>
  );
}
