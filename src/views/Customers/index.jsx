import cls from "./style.module.scss"
import Header from "../../components/Header"
import Table from "./CustomerTable"
import { useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"

const UsersPage = () => {
  const navigate = useNavigate()

  return (
    <div className={cls.positions__page}>
      <Header
        title="List of Customers"
        extra={
            <CreateButton
              onClick={() => navigate(`/customer/create`)}
              title="Create Customer"
            />
        }
      />
      <div className={cls.content}>
        <Table />
      </div>
    </div>
  )
}

export default UsersPage
