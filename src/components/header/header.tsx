import { Header } from "antd/es/layout/layout"
import Logos from "./Logo/Logo"
import Menus from "./Menu/Menu"
import styles from "./header.module.css"

const Headers=()=>{
  return (
    <>
  <div>
  <Header  className={`${styles.headers}`}>
 <div className={`${styles.container}`}>
 <Logos/>
 <Menus/> 
 </div>
  </Header>
  </div>
    </>
  )
}
export default Headers