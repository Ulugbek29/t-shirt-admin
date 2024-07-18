import cls from "./style.module.scss"
import Header from "../../components/Header"
import Table from "./ProductsTable"
import { useNavigate } from "react-router-dom"
import CreateButton from "../../components/Buttons/CreateButton"

const PositionsPage = () => {
  const navigate = useNavigate()

  return (
    <div className={cls.positions__page}>
      <Header
        title="List of Products"
        extra={
            <CreateButton
              onClick={() => navigate(`/products/create`)}
              title="Create product"
            />
        }
      />
      <div className={cls.content}>
        <Table />
      </div>
    </div>
  )
}

export default PositionsPage
