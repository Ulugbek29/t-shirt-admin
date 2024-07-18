import classes from "./style.module.scss"
import React from 'react'
import Sidebar from "../../components/Sidebar"
import { Outlet } from "react-router-dom"

export default function DashboardLayout() {
  return (
    <div className={classes.dashboard__layout}>
    <Sidebar />
    <div className={classes.content}>
        <Outlet />
    </div>
    </div>
  )
}
