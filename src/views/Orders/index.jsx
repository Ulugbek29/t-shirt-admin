import cls from "./style.module.scss"
import React from 'react'
import Header from "../../components/Header"
import OrdersTable from "./OrdersTable"
import CreateButton from "../../components/Buttons/CreateButton"
import { useNavigate } from "react-router-dom"

export default function index() {
  const navigate = useNavigate()

  return (
    <div className={cls.container}>
        <Header
            title="Orders"
            extra={
            <CreateButton
              onClick={() => navigate(`/orders/create`)}
              title="Create Order"
            />
        }
         />
         <div className={cls.content}>
            <OrdersTable />
         </div>
    </div>
  )
}
