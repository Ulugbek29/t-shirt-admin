import React, { useRef, useEffect, useState } from "react";
import cls from "./style.module.scss";
import Modal from "@mui/material/Modal";
import HFTextField from "../../FormElements/HFTextField";
import FRow from "../../FormElements/FRow";
import HFTextArea from "../../FormElements/HFTextArea";
import { useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  createOrder,
} from "../../../store/orderCreateProduct/orderCreateProduct.slice";
import SearchList from "../SearchList";
import productsService from "../../../services/productsService";
import useOutsideClick from "../../../hooks/useOutsideClick";
import MultiSelect from "../../common/MultiSelect";

//Icons
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export default function BasicModal({ openProductModal, handleCloseModal }) {
  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { productQuantity: 1, totalPrice: 0 },
  });
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openSearchList, setOpenSearchList] = useState(false);
  const [chosenProduct, setChosenProduct] = useState({});
  const inputRef = useRef();
  const searchListRef = useRef();
  useOutsideClick(searchListRef, () => setOpenSearchList(false));
  const watchProductQuantity = watch("productQuantity", 1);

  //For fetching Products
  useEffect(() => {
    fetchProducts();
  }, []);

  // const addingQuantity = orderList.map((order) => ({
  //   ...order,
  //   quantity: 1,
  // }));

  //for changing totalprice based on the watchProductQuantity
  useEffect(() => {
    const totalPrice = chosenProduct.price
      ? chosenProduct.price * watchProductQuantity
      : 0;
    setValue("totalPrice", totalPrice);
  }, [watchProductQuantity]);

  //Fetching products
  const fetchProducts = () => {
    productsService
      .getList({})
      .then((res) => {
        setProducts(res.products);
      })
      .catch((err) => console.log(err));
  };

  //getting the value of the input and filter
  const handleSearchInputChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setValue("productName", event.target.value.toLowerCase());
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchValue)
    );
    setFilteredProducts(filtered);
  };

  //chosen product & handle click & setting the totalPrice
  const handleProductClick = (chosenProduct) => {
    setChosenProduct(chosenProduct);
    setValue("productName", chosenProduct.name);
    const totalPrice = chosenProduct.price * +watch().productQuantity;
    setValue("totalPrice", totalPrice);
    setOpenSearchList(false);
  };

  // open filterd list of products
  const openFilteredSearchList = () => {
    setOpenSearchList(true);
    setFilteredProducts(products);
  };

  const onSubmit = (value) => {
    const data = {
      ...chosenProduct,
      name: value.productName,
      description: value.productDescription,
      quantity: value.productQuantity,
      totalPrice: value.totalPrice,
    };
    dispatch(createOrder(data));
    setChosenProduct({});
    handleCloseModal();
    reset();
  };

  const cancelProduct = () => {
    setChosenProduct({});
    handleCloseModal();
    reset();
  };

  // Handle form submission from button click
  const handleSubmitForm = () => {
    handleSubmit(onSubmit)();
  };

  

  return (
    <Modal
      open={openProductModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={cls.modal}>
        <h2>Добавить новый продукт</h2>

        <form>
          <FRow label="Название продукта">
            
            {/* <Autocomplete
        multiple
        id="tags-outlined"
        options={products}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="filterSelectedOptions"
            placeholder="Favorites"
          />
        )}
      /> */}

            <HFTextField
              inputRef={inputRef}
              onFocus={openFilteredSearchList}
              fullWidth
              control={control}
              onChange={handleSearchInputChange}
              name="productName"
              required
            />
            {openSearchList && (
              <SearchList
                searchListRef={searchListRef}
                filteredProducts={filteredProducts}
                handleProductClick={handleProductClick}
                setOpenSearchList={setOpenSearchList}
              />
            )}
          </FRow>

          <FRow label="Количество">
            <HFTextField
              fullWidth
              type="number"
              control={control}
              name="productQuantity"
              onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
              rules={{
                min: {
                  value: 1,
                  message: "Value must be greater than 1 ",
                },
              }}
              required
            />
          </FRow> 

         <FRow label="Описание">
            <HFTextArea
              control={control}
              name="productDescription"
              disabledHelperText
            />
          </FRow>
          {/* <FRow label="Заказанная продукция">
            {addingQuantity.map((order) => (
              <div className={cls.order__row}>
                <div>
                  <h4>{order.name}</h4>
                </div>
                <div>
                  <span>{order.price}</span>

                  <div>
                    <span>
                      <RemoveIcon fontSize="small" />
                    </span>
                    <span>
                      <AddIcon fontSize="small" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </FRow> */}

          <FRow label="Общая стоимость">
            <HFTextField
              fullWidth
              control={control}
              name="totalPrice"
              disabledHelperText
              disabled
            />
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
              onClick={handleSubmitForm}
              variant="contained"
              className={cls.button}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
