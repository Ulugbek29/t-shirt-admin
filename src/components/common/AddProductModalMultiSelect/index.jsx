import React, { useEffect, useState } from "react";
import cls from "./style.module.scss";
import Modal from "@mui/material/Modal";
import FRow from "../../FormElements/FRow";
import { Autocomplete, Button, Chip, styled, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  deleteOrder,
  editOrder,
  deleteAllOrders,
  addAttributes,
} from "../../../store/orderCreateProduct/orderCreateProduct.slice";
import productsService from "../../../services/productsService";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { addSpaceForNumbers } from "../../../utils/addSpaceForNumbers";
import { useParams } from "react-router-dom";
import categoryService from "../../../services/categoryServices";
import CSelect from "../../CSelect";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor: "#CCE5FF",
}));

const GroupItems = styled("ul")({
  padding: 0,
});

export default function BasicModal({ openProductModal, handleCloseModal }) {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [attOptions, setAttOptions] = useState({});
  const { id } = useParams();

  // For fetching Products
  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  useEffect(() => {
    if (openProductModal) {
      setOrderList(orders);
    }
  }, [openProductModal]);

  const filteredOrderProducts = products.filter((product) =>
    orders.some((order) => product.id === order.id)
  );

  // Fetching products
  const fetchProducts = () => {
    productsService
      .getList({})
      .then((res) => {
        setProducts(res.products);
      })
      .catch((err) => console.log(err));
  };

  //Fetching the category

  const fetchCategory = () => {
    categoryService
      .getList({ limit: 1000 })
      .then((res) => setCategories(res.categories))
      .catch((err) => console.log(err));
  };

  const handleDecrement = (order) => {
    console.log(order);
    if (order.quantity > 1) {
      dispatch(editOrder({ ...order, quantity: order.quantity - 1 }));
    } else {
      dispatch(deleteOrder(order.id));
      // Remove the order from the orderList state
      setOrderList((prev) => prev.filter((item) => item.id !== order.id));
    }
  };

  const handleIncrement = (order) => {
    dispatch(editOrder({ ...order, quantity: order.quantity + 1 }));
  };

  const onSubmit = () => {
    handleCloseModal();
  };

  const cancelProduct = () => {
    if (!id) {
      dispatch(deleteAllOrders());
    }
    handleCloseModal();
  };

  const handleProductSelection = (selectedProducts) => {
    if (selectedProducts.length === 0) {
      dispatch(deleteAllOrders());
    }

    // Filter out undefined items
    const validSelectedProducts = selectedProducts.filter(
      (product) => product !== undefined
    );

    const newOrders = validSelectedProducts.filter((product) => {
      return !orders.find((order) => order.id === product.id);
    });

    // Map over the selected products to add quantity and totalPrice
    const updatedOrders = newOrders.map((product) => ({
      ...product,
      quantity: 1, // Assuming initial quantity is 1
      totalPrice: product.price, // Assuming initial total price is the same as price
    }));

    // Check if there are valid selected products to dispatch
    if (updatedOrders.length > 0) {
      dispatch(createOrder(updatedOrders[0]));
    }

    // Update orderList with both previous orders and newly selected orders
    setOrderList(validSelectedProducts);
  };

  const handleDelete = (id) => {
    dispatch(deleteOrder(id));
    setOrderList(orderList.filter((order) => order.id !== id));
  };

  const groupByCategory = (categoryId) => {
    const productCategory = categories.find((cat) => cat.id === categoryId);
    return productCategory.name;
  };

  // useEffect(() => {
  //   handleAttributes()
  // },[attOption])

  const handleAttributes = (product, attribute, event) => {

    const selectedOption = event.target.value
    const data = {
      product,
      attribute,
      selectedOption,
    };

    console.log(data);
    dispatch(addAttributes(data));
  };

  // const handleAttributeChange = (product, attribute, event) => {
  //   const selectedOption = event.target.value;

  //   console.log(selectedOption);
  //   // Update the local state to reflect the selected option
  //   setAttOptions(selectedOption);


  //   // Dispatch the handleAttributes function
  //   handleAttributes(product, attribute, selectedOption);
  // };


  console.log("orders", orders);
  console.log(attOptions);
  return (
    <Modal
      open={openProductModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={cls.modal}>
        <h2>Добавить новый продукт</h2>

        <FRow label="Название продукта">
          <Autocomplete
            multiple
            id="tags-outlined"
            options={products} // Use products
            value={filteredOrderProducts} // Set value to orderList
            groupBy={(option) => groupByCategory(option.category_id)}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            onChange={(event, newValue) => handleProductSelection(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                return (
                  <Chip
                    key={value.id}
                    label={option.name}
                    variant="outlined"
                    {...getTagProps({ index })}
                    onDelete={() => handleDelete(option.id)}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Products"
                placeholder="Select Products"
              />
            )}
            renderGroup={(params) => {
              return (
                <li key={params.key}>
                  <GroupHeader>{params.group}</GroupHeader>
                  <GroupItems>{params.children}</GroupItems>
                </li>
              );
            }}
          />
        </FRow>

        <FRow label="Заказанная продукция">
          <div className={cls.orders__list}>
            {orders &&
              orders.map((order, index) => (
                <div className={cls.order__row} key={order.id}>
                  <div className={cls.order__details}>
                    <div className={cls.order__image__section}>
                      {/* <div className={cls.order__image}>
                  <img src={order.photo_url}/>
                </div> */}
                      <div className={cls.order__name}>
                        <h4>
                          {index + 1}) {order.name}
                        </h4>
                        <span>x{order.quantity}</span>
                      </div>
                    </div>
                    <div className={cls.order__action__section}>
                      <span className={cls.order__price}>
                        {addSpaceForNumbers(order.totalPrice)} so'm
                      </span>
                      <div className={cls.order__buttons}>
                        <span onClick={() => handleDecrement(order)}>
                          <RemoveIcon fontSize="small" />
                        </span>
                        <span onClick={() => handleIncrement(order)}>
                          <AddIcon fontSize="small" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={cls.order__attributes}>
                    {order?.attribute.map(
                      (ord) =>
                        ord.id !== "" && (
                          <CSelect
                          key={ord.id}
                            value={ord.selectedOption || null}
                            onChange={(event) =>
                              handleAttributes(order, ord, event)
                            }
                            label={ord.title}
                            options={ord.options}
                          />
                        )
                    )}
                  </div>
                </div>
              ))}
          </div>
        </FRow>

        <div className={cls.buttons__box}>
          <Button
            onClick={cancelProduct}
            type="button"
            variant="outlined"
            className={cls.button}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            variant="contained"
            className={cls.button}
          >
            Create
          </Button>
        </div>
      </div>
    </Modal>
  );
}
