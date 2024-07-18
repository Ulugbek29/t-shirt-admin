import React, { useState, useEffect } from "react";
import cls from "./style.module.scss";
import {
  CTable,
  CTableBody,
  CTableCell,
  CTableHead,
  CTableHeadRow,
  CTableRow,
} from "../../components/CTable";
import dayjs from "dayjs";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import OrderDetails from "./OrderDetails/OrderDetails";
import { useNavigate } from "react-router-dom";
import orderServices from "../../services/orderServices";
import { paymentTypes } from "../../constants/paymentTypes";
import ButtonsPopover from "../../components/ButtonsPopover";
import DeleteModal from "../../components/common/DeleteModal/DeleteModal";
import { pageToOffset } from "../../utils/pageToOffset";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";

export default function OrdersTable() {
  const [inputFilter, setInputFilter] = useState("");
  // Pagination
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("totalAmount");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal Order Details
  const [deleteModal, setDeleteModal] = useState({ status: false, id: null });
  const [modal, setOpenModal] = useState({ id: null, status: false });
  const handleOpen = (id) => setOpenModal({ id: id, status: true });
  const handleClose = () => setOpenModal((prev) => ({ id: null, status: false }));

  const closeErrorModal = () => {
    setDeleteModal((prev) => ({ ...prev, status: false }));
  };

  const fetchOrderData = async () => {
    const response = await orderServices.getList({
      limit: rowsPerPage,
      offset: pageToOffset(currentPage, rowsPerPage),
    });
    setPageCount(Math.ceil(response.count / rowsPerPage));
    return response.orders;
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", currentPage, rowsPerPage],
    queryFn: fetchOrderData,
    staleTime: 3000,
    keepPreviousData: true,
  });

  if(orders?.length > 0) {

    console.log(moment.utc(orders[0].created_at).local().format('MMMM Do YYYY h:mm a'));
  }
  const columns = [
    {
      key: "orderNumber",
      title: "№",
      width: "50px",
      render: (itemObj, index) => {
        const calculatedIndex = (currentPage - 1) * rowsPerPage + index + 1;
        return <p>{calculatedIndex}</p>;
      },
    },
    {
      key: "name",
      title: "Customer Name",
      render: (itemObj) => {
        return itemObj.customer_details.name;
      },
    },
    { key: "total_price", title: "Total Price" },
    {
      key: "created_at",
      title: "Create Date",
      render: (itemObj) => {
        return moment.utc(itemObj.created_at).local().format('MMMM Do YYYY h:mm a')
      },
    },
    {
      key: "order_products",
      title: "Ordered Products",
      render: (itemObj) => {
        if (itemObj?.order_products?.products) {
          return itemObj?.order_products?.products.map((item, idx) => {
            return <div key={idx}>{item.product_name}</div>;
          });
        }
      },
    },
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
    {
      key: "order_status",
      title: "Order status",
      width: "100px",
      render: (itemObj) => {
        return (
          <div>
            <select
              value={itemObj.order_status}
              onChange={(value) => statusChange(itemObj, value.target.value)}
              className={cls.order__status__select}
            >
              <option value="created">Created</option>
              <option value="preparing">Preparing</option>
              <option value="ready_for_delivering">Ready for delivery</option>
              <option value="on_the_way">On the Way</option>
              <option value="delivered">Delivered</option>
              <option value="returned">Returned</option>
            </select>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      width: "50px",
      render: (itemObj) => (
        <ButtonsPopover
          id={itemObj.id}
          onEditClick={navigateToEditForm}
          setOpenModal={setDeleteModal}
        />
      ),
    },
  ];

  const searchFilter = orders?.length > 0 ? orders.filter((item) => {
    return item.customer_details.name.toLowerCase().includes(inputFilter.toLowerCase());
  }) : [];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortByColumn = (key) => {
    if (sortBy === key) {
      toggleSortOrder();
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const sortedOrdersList = Array.isArray(searchFilter) ? searchFilter.slice().sort((a, b) => {
    const valueA = typeof a[sortBy] === "string" ? a[sortBy].toUpperCase() : a[sortBy];
    const valueB = typeof b[sortBy] === "string" ? b[sortBy].toUpperCase() : b[sortBy];

    if (typeof a[sortBy] === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else if (typeof a[sortBy] === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    } else if (dayjs.isDayjs(a[sortBy])) {
      return sortOrder === "asc"
        ? dayjs(valueA).diff(dayjs(valueB))
        : dayjs(valueB).diff(dayjs(valueA));
    }

    return 0;
  }) : [];

  const navigateToEditForm = (id) => {
    navigate(`/orders/${id}`);
  };

  const navigateToUserData = (itemObj, colObj) => {
    if (colObj.key === "name") {
      navigate(`/customer/${itemObj.customer_details.id}`);
    } else if (colObj.key === "order_status" || colObj.key === "actions") {
      return;
    } else {
      handleOpen(itemObj.id);
    }
  };

  const statusChange = (orderData, status) => {
    const data = {
      ...orderData,
      order_status: status,
    };

    orderServices.update(data)
      .then(() => {
        queryClient.invalidateQueries("orders");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className={cls.orders__table}>
        <div className={cls.table__header}>
          <div className={cls.date__search__container}>
            <div className={cls.date__container}>
              {/* <DatePicker label="Start date" control={control} name="start_date" />
              <DatePicker label="End date" control={control} name="end_date" /> */}
            </div>
            <div className={cls.search__order__input}>
              <TextField
                id="input-with-icon-textfield"
                placeholder="Search customer or order number..."
                fullWidth
                value={inputFilter}
                onChange={(e) => setInputFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </div>
          </div>
        </div>
        <CTable
          count={pageCount}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          setPageCount={setPageCount}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          columnsCount={columns.length}
          loader={isLoading}
        >
          <CTableHead>
            <CTableHeadRow>
              {columns.map((col) => (
                <CTableCell onClick={() => sortByColumn(col.key)} key={col.key}>
                  {col.title}
                </CTableCell>
              ))}
            </CTableHeadRow>
          </CTableHead>
          <CTableBody
            loader={isLoading}
            columnsCount={columns.length}
            dataLength={sortedOrdersList?.length || 0}
          >
            {sortedOrdersList?.map((row, i) => (
              <CTableRow key={row.id}>
                {columns?.map((column) => (
                  <CTableCell
                    key={column.key}
                    style={{ width: column.width, height: "100%" }}
                    onClick={() => navigateToUserData(row, column)}
                  >
                    {column.render ? column.render(row, i) : row[column.key]}
                  </CTableCell>
                ))}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {modal.status && <OrderDetails modal={modal} handleClose={handleClose} />}
      </div>
      {deleteModal.status && (
        <DeleteModal
          openModal={deleteModal}
          closeErrorModal={closeErrorModal}
        />
      )}
    </>
  );
}
