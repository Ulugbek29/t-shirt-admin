import cls from "./style.module.scss";
import React from "react";
import FRow from "../../../components/FormElements/FRow";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";

//Icons
import FunctionsIcon from "@mui/icons-material/Functions";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
// Form Elements
import FormCard from "../../../components/FormCard";
import HFTextField from "../../../components/FormElements/HFTextField";
import PhoneInputMask from "../../../components/common/PhoneInputMask";
import { useNavigate } from "react-router-dom";

//Table
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../../components/CTable";
import orderServices from "../../../services/orderServices";
import { useState } from "react";
import { useEffect } from "react";
import { paymentTypes } from "../../../constants/paymentTypes";
import { pageToOffset } from "../../../utils/pageToOffset";
import { addSpaceForNumbers } from "../../../utils/addSpaceForNumbers";
import { calculateTotalPrice } from "../../../utils/calculateAllOrders";

export default function UserCreate({ control, loader, btnLoader, id }) {
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerTotalOrders, setCustomerTotalOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(()=> {
    getCustomerData()
  },[id])

  useEffect(() => {
    getCustomerOrderList();
  }, [id,currentPage, rowsPerPage]);

  const columns = [
    {
      key: "id",
      title: "№",
      width: "50px",
      render: (itemObj, index) => {
      const calculatedIndex = (currentPage - 1) * rowsPerPage+index+1
     return <p>{calculatedIndex}</p>
    },
  },
  {
    key: "order_products",
    title: "Ordered Products",
    render: (itemObj) => {
      if (itemObj?.order_products?.products) {
        return itemObj?.order_products?.products.map((item) => {
          return <div>{item.product_name}</div>;
        });
      }
    },
  },
    { key: "total_price", title: "Total Price" },
    { key: "created_at", title: "Create Date" },
    {
      key: "shippingAddress",
      title: "shippingAddress",
      render: (itemObj) => {
        return itemObj?.customer_details?.address.name;
      },
    },
    {
      key: "order_type",
      title: "Order type",
      render: (itemObj) => {
        return itemObj?.order_type;
      },
    },
    {
      key: "paymentMethod",
      title: "paymentMethod",
      render: (itemObj) => {
        return paymentTypes(itemObj.payment_details.payment_type_id);
      },
    },
  ];

 

  const getCustomerOrderList = () => {
    orderServices
      .getList({
        limit: rowsPerPage,
        offset: pageToOffset(currentPage, rowsPerPage),
        customerId: id,
      })
      .then((res) => {
        setCustomerTotalOrders(res.count)
        setCustomerOrders(res.orders)
        setPageCount(Math.ceil(res?.count / rowsPerPage));
      })
      .catch((err) => console.log(err));
  };


  const getCustomerData = () => {
    orderServices
      .getList({
        limit: 1000,
        offset: 0,
        customerId: id,
      })
      .then((res) => {
        setAllOrders(res.orders)
      })
  }

  

  return (
    <>
      <div className={cls.user_create_container}>
        <div className={cls.user__form}>
          <div className={cls.order__info__list}>
            <div className={cls.order__info__box}>
              <div className={cls.order_info}>
                <h2>{addSpaceForNumbers(calculateTotalPrice(allOrders))} сум</h2>
                <p>Общая сумма заказов</p>
              </div>
              <div className={cls.order_icon}>
                <FunctionsIcon fontSize="large" color="primary" />
              </div>
            </div>
            <div className={cls.order__info__box}>
              <div className={cls.order_info}>
                <h2>{addSpaceForNumbers(Math.floor(calculateTotalPrice(allOrders)/customerTotalOrders))} сум</h2>
                <p>Средний чек</p>
              </div>
              <div className={cls.order_icon}>
                <AttachMoneyIcon fontSize="large" color="primary" />
              </div>
            </div>
            <div className={cls.order__info__box}>
              <div className={cls.order_info}>
                <h2>{customerTotalOrders}</h2>
                <p>Количество заказов</p>
              </div>
              <div className={cls.order_icon}>
                <ShoppingCartIcon fontSize="large" color="primary" />
              </div>
            </div>
            {/* <div className={cls.order__info__box}>
              <div className={cls.order_info}>
                <h2>0 сум</h2>
                <p>Использ. бонус</p>
              </div>
              <div className={cls.order_icon}>
                <LocalAtmIcon fontSize="large" color="primary" />
              </div>
            </div> */}
          </div>

          <div className={cls.form__container}>
            <FormCard maxWidth="600px" visible={!loader} title="Client">
              <FRow required label="Name" position>
                <HFTextField
                  fullWidth
                  control={control}
                  name="name"
                  required
                  rules={{}}
                />
              </FRow>

              <FRow required label="Phone number" position>
                <PhoneInputMask
                  label="Номер телефона"
                  control={control}
                  name="phone"
                  required
                />
              </FRow>

              {/* <FRow label="Status Available" position>
                <HFSwitch
                  name="status"
                  control={control}
                  defaultValue={false}
                  color="primary"
                />
              </FRow> */}

              <div className={cls.buttons}>
                <CancelButton onClick={() => navigate(-1)} />
                <SaveButton type="submit" loading={btnLoader} />
              </div>
            </FormCard>
            {id && (
              <FormCard maxWidth="100%" visible={!loader}>
                <CTable
                  count={pageCount}
                  page={currentPage}
                  rowsPerPage={rowsPerPage}
                  setPageCount={setPageCount}
                  setRowsPerPage={setRowsPerPage}
                  setCurrentPage={setCurrentPage}
                  columnsCount={columns.length}
                  loader={loader}
                >
                  <CTableHead>
                    <CTableHeadRow>
                      {columns.map((col) => (
                        <CTableCell
                          key={col.key}
                        >
                          {col.title}
                        </CTableCell>
                      ))}
                    </CTableHeadRow>
                  </CTableHead>
                  <CTableBody
                    // loader={loader}
                    columnsCount={columns.length}
                    dataLength={customerOrders?.length || 0}
                  >
                    {customerOrders?.map((row, i) => (
                      <CTableRow key={i}>
                        {columns?.map((column) => (
                          <CTableCell
                            key={column.key}
                            style={{ width: column.width, height: "100%" }}
                          >
                            {column.render
                              ? column.render(row, i)
                              : row[column.key]}
                          </CTableCell>
                        ))}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </FormCard>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

