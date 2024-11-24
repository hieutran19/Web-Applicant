import styles from './unknown.module.css';
//dvd
export default function Unauthorized() {
  return (
    <div className={styles.container}>
      <img src="/images/403.png" alt="Unauthorized" />;
    </div>
  );
}
