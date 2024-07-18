import cls from "./style.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { apikey, mapDefaults } from "../../../constants/mapDefaults";
import { getGeoLocation } from "../../../utils/yandex";
import axios from "axios";
import { Controller } from "react-hook-form";

//Form Elements
import SuccessSnackbar from "../../../components/common/SuccessSnackbar";
import FormCard from "../../../components/FormCard";
import FRow from "../../../components/FormElements/FRow";
import HFTextField from "../../../components/FormElements/HFTextField";
import { Box } from "@mui/material";
import MapList from "./MapList";
import HFTextArea from "../../../components/FormElements/HFTextArea";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import HFSelect from "../../../components/FormElements/HFSelect";
import AddProductModal from "../../../components/common/AddProductModal";
import AddProductModalMultiSelect from "../../../components/common/AddProductModalMultiSelect";
import ReactAsyncSelectPagination from "../../../components/common/ReactAsyncSelectPagination";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import AddIcon from "@mui/icons-material/Add";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import FunctionsIcon from "@mui/icons-material/Functions";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllOrders,
  deleteOrder,
  editOrder,
  orderTotalCost,
} from "../../../store/orderCreateProduct/orderCreateProduct.slice";

//Services
import customerServices from "../../../services/customerServices";
import customerService from "../../../services/customerServices";
import CreateButton from "../../../components/Buttons/CreateButton";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";
import { useNavigate } from "react-router-dom";

const orderTypes = [
  { label: "Delivery", value: "delivery" },
  { label: "Pickup", value: "pickup" },
];

const paymentTypes = [
  { label: "Cash", value: "8e85e55f-bcd8-4225-9ae9-ec9ded4787ae" },
  { label: "Payme", value: "f2868b77-32b2-4f0b-be9f-710741c386d5" },
  { label: "Click", value: "d19c17c2-902f-4751-8c34-0e2c8bf20a60" },
];

export default function OrderEdit({
  control,
  setValue,
  addressNameInput,
  addressCoordinates,
  userPhone,
  getValues,
  btnLoaderSubmit,
}) {
  const [addressList, setAddressList] = useState([]);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [zoomIn, setZoomIn] = useState(12);
  const mapRef = useRef(null);
  const [mapHasResponse, setMapHasResponse] = useState(false);
  const [newCustomer, setNewCustomer] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { orders,totalPrice } = useSelector((store) => store?.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenModal = () => setOpenProductModal(true);
  const handleCloseModal = () => setOpenProductModal(false);

  const removeProduct = (id) => {
    dispatch(deleteOrder(id));
  };


  //Calculation of totalPirce
  useEffect(() => {
    dispatch(orderTotalCost());
  }, [orders]);



  
  const updateProduct = (productObj) => {
    dispatch(editOrder(productObj));
  };

  useEffect(() => {
    if (addressNameInput !== "") {
      const getData = setTimeout(() => {
        fetchLocations(addressNameInput);
      }, 300);
      return () => {
        clearTimeout(getData);
      };
    }
  }, [addressNameInput]);

  // For setting the address
  useEffect(() => {
    if (addressCoordinates.length > 0) {
      const fetchGeoLocation = async () => {
        try {
          const res = await getGeoLocation({
            lat: addressCoordinates[1],
            long: addressCoordinates[0],
          });
          //GeoCode
          const addressname =
            res.response.GeoObjectCollection.featureMember[0].GeoObject.name;

            const districtComponent = res.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components?.find(
              (component) => component.kind === "district"
            );
            
            const localityComponent = res.response.GeoObjectCollection.featureMember[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.Address?.Components?.find(
              (component) => component.kind === "locality"
            );

          if (addressname) {
            setValue("addressName", addressname);
            setValue("district", districtComponent?.name ? districtComponent?.name : localityComponent?.name);
            setZoomIn(17);
          } else {
            console.error("Unexpected API response structure:", res);
          }

          // if (res && res.features) {
          //   setValue("addressName", res.features[0].properties.name);
          //   setZoomIn(17);
          // } else {
          //   console.error("Unexpected API response structure:", res);
          // }
        } catch (error) {
          console.error("Failed to fetch geolocation:", error);
        }
      };

      fetchGeoLocation();
    }
  }, [addressCoordinates]);

  // Fetching locations by input
  const fetchLocations = async (query) => {
    try {
      if (query !== "") {
        // Only fetch if the query is not empty
        const response = await axios.get(
          // `https://search-maps.yandex.ru/v1/?apikey=${apikey}&text=${query}&lang=uz_UZ`
          `https://geocode-maps.yandex.ru/1.x/?apikey=${apikey}&format=json&geocode=${query}&lang=uz_UZ&ll=69.2401,41.2995&spn=0.2,0.2&rspn=1` //geocode
        );
        // const data = response.data.features;
        const data = response.data.response.GeoObjectCollection.featureMember; // geocode
        if (data) {
          // const extractedLocations = data.map((feature) => ({
          //   name: feature.properties.name,
          //   coordinates: feature.geometry.coordinates.reverse(),
          //   description: feature.properties.description,
          // }));
          const extractedLocations = data.map((feature) => ({
            name: feature.GeoObject.name,
            coordinates: feature.GeoObject.Point.pos.split(" ").reverse(),
            description: feature.GeoObject.description,
          })); // geocode
          setAddressList(extractedLocations);
          // setMapHasResponse(true); // Set mapHasResponse to true only when there's a response
        }
      } else {
        setAddressList([]); // Clear the address list if the query is empty
        setMapHasResponse(false); // Set mapHasResponse to false when there's no query
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  //Pick the addreess from the address list
  const pickAddress = (placeLocation, addressName) => {
    setValue("address", placeLocation);
    setValue("addressName", addressName);
    setAddressList([]);
    setMapHasResponse(false);
    setZoomIn(17);
  };

  



  const createNewCustomer = async () => {
    try {
      setBtnLoader(true);
      const newData = {
        company_id: "c6440797-dc74-4054-a0f0-2a4d3e6d3867",
        name: getValues("name"),
        phone: userPhone.value,
      };

      const response = await customerService.create(newData);
      const newCustomerdata = {
        id: response.id,
        value: response.phone,
        label: `${response.phone} ${response.name}`,
        name: response.name,
      };
      setValue("phone", newCustomerdata);
      setNewCustomer(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error creating new customer:", error);
    } finally {
      setBtnLoader(false);
    }
  };

  //SetValue for the name after choosing the name
  useEffect(() => {
    setValue("name", userPhone?.name);
  }, [userPhone]);

  //Fetching the customers by their phone Numbers
  const loadOptions = async (search, loadedOptions, { page }) => {
    try {
      const response = await customerServices.getList({
        limit: 5,
        offset: page,
        phoneSearch: search,
      });

      const newOptions = response.customers.map((customer) => ({
        id: customer.id,
        value: customer.phone,
        label: `${customer.phone} ${customer.name}`,
        name: customer.name,
      }));
      const hasMore = response.count > loadedOptions.length + 5;

      return {
        options: newOptions,
        hasMore: hasMore,
        additional: {
          page: page + 5,
        },
      };
    } catch (error) {
      console.error("Error loading options:", error);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const addNewOption = (inputValue) => {
    const newOption = {
      value: inputValue,
      label: `Create new customer ${inputValue}`,
    };

    return newOption;
  };

  const onCreateOption = (inputValue) => {
    const newOption = addNewOption(inputValue);
    // Update options state here
    setValue("phone", newOption);
    setNewCustomer(true);
  };

  return (
    <>
      {openSnackbar && (
        <SuccessSnackbar
          open={openSnackbar}
          setOpenSnackbar={setOpenSnackbar}
          message="Customer created successfully"
        />
      )}
      <div className={cls.order__edit__container}>
        {/* <AddProductModal
          openProductModal={openProductModal}
          handleCloseModal={handleCloseModal}
        /> */}
        <AddProductModalMultiSelect
          openProductModal={openProductModal}
          handleCloseModal={handleCloseModal}
        />
        <div className={cls.flex}>
          <Box sx={{ width: "40%" }}>
            <FormCard title="Клиент" maxWidth="100%">
              <FRow label="Номер телефона" position>
                <ReactAsyncSelectPagination
                  control={control}
                  name="phone"
                  loadOptions={loadOptions}
                  onCreateOption={onCreateOption}
                  additional={{
                    page: 0,
                  }}
                  setNewCustomer={setNewCustomer}
                />
              </FRow>
              <FRow label="Имя" position>
                <HFTextField fullWidth name="name" control={control} />
              </FRow>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {newCustomer && (
                  <CreateButton
                    onClick={() => createNewCustomer()}
                    type="button"
                    loading={btnLoader}
                  >
                    Add Customer
                  </CreateButton>
                )}
              </Box>
            </FormCard>
            <FormCard title="Комментарии" maxWidth="100%">
              <FRow label="Описание" position>
                <HFTextArea control={control} label="Message" name="comment" />
              </FRow>
            </FormCard>
          </Box>
          <Box sx={{ width: "60%" }}>
            <FormCard title="Доставка" maxWidth="100%">
              <div className={cls.flex}>
                <FRow label="Тип доставки" position>
                  <HFSelect
                    fullWidth
                    control={control}
                    name="order_type"
                    options={orderTypes}
                  />
                </FRow>
                <FRow label="Квартира" position>
                  <HFTextField fullWidth name="apartment" control={control} />
                </FRow>
              </div>
              <div className={cls.flex}>
                <FRow label="Подъезд" position>
                  <HFTextField fullWidth name="entrance" control={control} />
                </FRow>
                <FRow label="Этаж" position>
                  <HFTextField fullWidth name="floor" control={control} />
                </FRow>
              </div>
              <div style={{ position: "relative", width: "50%" }}>
                <FRow label="Адрес" position>
                  <HFTextField
                    onFocus={()=>setMapHasResponse(true)}
                    // onBlur={()=>setMapHasResponse(false)}
                    fullWidth
                    name="addressName"
                    control={control}
                  />
                </FRow>
                {mapHasResponse && addressList.length > 0 && (
                  <MapList
                    locations={addressList}
                    pickAddress={pickAddress}
                    setAddressList={setAddressList}
                  />
                )}
              </div>
              {/* yandexMap */}
              <div className={cls.yandex__map}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <YMaps
                      query={{ apikey, lang: "uz_UZ", load: "package.full" }}
                    >
                      <Map
                        onClick={(e) => {
                          onChange(e.get("coords"));
                        }}
                        instanceRef={mapRef}
                        width="100%"
                        height="100%"
                        modules={["geocode", "geolocation"]}
                        options={{ suppressMapOpenBlock: true, controls: [] }}
                        state={{
                          ...mapDefaults,
                          center:
                            value && value.length > 0
                              ? value
                              : mapDefaults.center,
                          zoom: zoomIn,
                        }}
                      >
                        {/* PlaceMark */}
                        {value && value.length > 0 ? (
                          <Placemark
                            options={{
                              draggable: true,
                            }}
                            geometry={value}
                            onDragEnd={(e) => {
                              const newCoords =
                                e.originalEvent.target.geometry.getCoordinates();
                              setValue("address", newCoords);
                            }}
                            onClick={(e) => {
                              const map = e.get("map");
                              map.setZoom(18);
                              map.setCenter(value);
                            }}
                          />
                        ) : (
                          <>
                            {addressList.map((location, index) => (
                              <Placemark
                                key={index}
                                geometry={location.coordinates}
                                options={{
                                  draggable: true,
                                }}
                                properties={{
                                  iconContent: location.name,
                                }}
                                onDragEnd={(e) => {
                                  const newCoords =
                                    e.originalEvent.target.geometry.getCoordinates();
                                  setValue("address", newCoords);
                                }}
                                onClick={(e) => {
                                  // const newCoords = e.get("coords");
                                  // setValue("address", newCoords);
                                  const map = e.get("map");
                                  map.setZoom(18);
                                  map.setCenter(value);
                                }}
                              />
                            ))}
                          </>
                        )}
                      </Map>
                    </YMaps>
                  )}
                />
              </div>
              {/* <div className={cls.flex}>
              <FRow label="Компании" position>
                <HFSelect
                  fullWidth
                  control={control}
                  name="companies"
                  sx={{ padding: 0 }}
                  options={companies}
                />
              </FRow>
              <FRow label="Филиал" position>
                <HFSelect
                  fullWidth
                  control={control}
                  name="branches"
                  options={branches}
                  sx={{ padding: 0 }}
                />
              </FRow>
            </div>
            <div className={cls.flex}>
              <FRow label="Адрес" position>
                <HFTextField
                  inputStyle={{ padding: 0 }}
                  fullWidth
                  name="city__address"
                  control={control}
                />
              </FRow>
              <FRow label="Номер телефона" position>
                <HFTextField
                  inputStyle={{ padding: 0 }}
                  fullWidth
                  name="num__tel"
                  control={control}
                />
              </FRow>
            </div> */}
            </FormCard>
          </Box>
        </div>
        <Box sx={{ width: "100%" }}>
          <FormCard title="Продукты" maxWidth="100%">
            <div className={cls.list__of__orders}>
              {orders?.map((order) => (
                <div className={cls.order}>
                  <div className={cls.order__name}>
                    <div className={cls.vertical}>
                      <h3>Название</h3>
                      <input placeholder="Название" value={order?.name} />
                    </div>
                  </div>
                  <div className={cls.order__cost}>
                    <div className={cls.vertical}>
                      <h3>Цена</h3>
                      <input placeholder="Цена" value={order?.price} />
                    </div>
                    <CloseIcon color="primary" />
                    <div className={cls.vertical}>
                      <h3>Количество</h3>
                      <input
                        type="number"
                        placeholder="Количество"
                        onKeyDown={(e) =>
                          ["e", "E", "+", "-"].includes(e.key) &&
                          e.preventDefault()
                        }
                        onChange={(e) =>
                          updateProduct({
                            id: order?.id,
                            quantity: +e.target.value,
                          })
                        }
                        value={order?.quantity}
                      />
                    </div>
                    <DragHandleIcon color="primary" />
                    <div className={cls.vertical}>
                      <h3>Общая стоимость</h3>
                      <input
                        placeholder="Общая стоимость"
                        value={order?.totalPrice}
                      />
                    </div>
                    <div
                      onClick={() => removeProduct(order.id)}
                      className={cls.delete__order}
                    >
                      <CloseIcon fontSize="medium" color="error" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={handleOpenModal} className={cls.add__order__btn}>
              <AddIcon fontSize="medium" color="primary" />
              <p>Добавить продукт</p>
            </div>

            <div className={cls.order_result}>
              <div className={cls.order_result_box}>
                <FRow label="Виды оплаты" position>
                  <HFSelect
                    fullWidth
                    control={control}
                    name="payment_type_id"
                    options={paymentTypes}
                  />
                </FRow>
                {/* <FRow label="Тип курьера" position>
                <HFSelect
                  fullWidth
                  control={control}
                  name="delivery_type"
                  options={deliveryTypes}
                  sx={{ padding: 0 }}
                />
              </FRow>
              <FRow label="Курьер" position>
                <HFTextField
                  inputStyle={{ padding: 0 }}
                  fullWidth
                  name="courier"
                  control={control}
                />
              </FRow> */}
              </div>
              <div className={cls.hr_line}></div>
              <div className={cls.order_result_summ}>
                <div className={cls.order_result_list}>
                  <div className={cls.order_details_money}>
                    <div className={cls.flex}>
                      <MonetizationOnIcon fontSize="inherit" color="primary" />
                      <span>Сумма заказа</span>
                    </div>
                    <p>{totalPrice} сум</p>
                  </div>
                  <div className={cls.order_details_money}>
                    <div className={cls.flex}>
                      <DirectionsCarFilledIcon
                        fontSize="inherit"
                        color="primary"
                      />
                      <span>Цена доставки</span>
                    </div>
                    <p>{totalPrice} сум</p>
                  </div>
                  <div className={cls.vr_line}></div>
                  <div className={cls.order_details_money}>
                    <div className={cls.flex}>
                      <FunctionsIcon fontSize="inherit" color="primary" />
                      <span className={cls.order__total__price}>Итого</span>
                    </div>
                    <p>{totalPrice} сум</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={cls.buttons__container}>
              <CancelButton
                onClick={() => {
                  navigate(-1);
                  dispatch(deleteAllOrders());
                }}
              />
              <SaveButton type="submit" loading={btnLoaderSubmit} />
            </div>
          </FormCard>
        </Box>
      </div>
    </>
  );
}
