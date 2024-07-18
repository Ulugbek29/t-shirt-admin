import styles from "./style.module.scss"
import { Button, CircularProgress } from "@mui/material"

// const PrimaryButton = ({ children, className, ...props }) => {
//   return ( <button className={`${styles.button} ${styles.primary} ${className}`} {...props} >{ children }</button> );
// }
 
// export default PrimaryButton;


const PrimaryButton = ({ children, loading,className, ...props }) => {
  return (
    <Button
      sx={{
        padding: "1rem"
      }}
       className={`${styles.button} ${styles.primary} ${className}`}
      startIcon={loading && <CircularProgress size={16} style={{ color: '#fff', marginRight: "5px" }} />}
      disabled={loading}
      {...props}
    >
      { children }
    </Button>
  )
}

export default PrimaryButton