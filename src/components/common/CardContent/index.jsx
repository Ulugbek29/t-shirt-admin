import cls from "./style.module.scss"
import { Typography } from "@mui/material"

const index = ({ visible = true, children, title, className, extra, ...props }) => {
  if(!visible) return null

  return (
    <div className={`${cls.Card__Content} ${className}`} >
      <div className={cls.card} {...props} >
          {title && <div className={cls.header}>
           <Typography variant="h4" className={cls.title} >{ title }</Typography>
           <div className={cls.extra}>{extra}</div>
          </div>}
          <div className={cls.content}>
            { children }
          </div>
      </div>
    </div>
  )
}

export default index