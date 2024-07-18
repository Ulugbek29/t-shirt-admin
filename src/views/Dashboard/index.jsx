import classes from "./style.module.scss"
import React from 'react'
import Header from "../../components/Header"
import DashboardContent from "./DashboardContent"

export default function index() {
  return (
    <div className={classes.dashboard__container}>
        <Header title="Dashboard"/>

        <div>
            <DashboardContent />
        </div>
    </div>
  )
}
