import styles from './Logo.module.css';
import { Link } from 'react-router-dom';
const Logos=()=>{
  return(
    <>
  <div>
        <Link  className={styles.logo} to="/"><img src="../public/images/avt-logo.png" alt="" /></Link>
        
        </div>
    </>
  )}
export default Logos;