import styles from './iteem.module.css';

interface CheckboxItem {
  label: string;
  checked: boolean;
  onChange: () => void;
}

interface ItemsProps {
  label: string;
  text?: string;
  link?: string;
  checkboxes?: CheckboxItem[];
}


const Items: React.FC<ItemsProps> = ({ label, text, link, checkboxes }) => {
  return (
    <div className={styles.item}>
      <label className={styles.boldLabel}>{label}</label>
      {text && !checkboxes ? (
        link ? (
          <a href={link} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          <span>{text}</span>
        )
      ) : null}
      {checkboxes && (
        <div className={styles.checkboxContainer}>
          {checkboxes.map((checkbox, index) => (
            <div key={index} className={styles.checkboxItem}>
              <label>
                <input
                  type="checkbox"
                  checked={checkbox.checked}
                  onChange={checkbox.onChange}
                />
                <span className={styles.checkboxLabel}>{checkbox.label}</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;
