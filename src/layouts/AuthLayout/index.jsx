import { Outlet } from "react-router-dom"
import styles from "./style.module.scss"

const AuthLayout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.leftSide}>
        <div className={styles.logoBlock}>
        {/* <img src="/z-bek-logo.jpg"/> */}
          <h1 className={styles.logoTitle}>Z<span className={styles.logoTitleGreen}>BEK</span></h1>
          <p className={styles.logoSubtitle}>This is Admin Panel.</p>
        </div>
      </div>
      <div className={styles.rightSide}>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
