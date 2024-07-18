import cls from "./style.module.scss";
import React, { useEffect } from "react";
import OrderEdit from "./OrderEdit/OrderEdit";
import Header from "../../components/Header";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import orderServices from "../../services/orderServices";
import {
  deleteAllOrders,
  setCustomerOrders,
} from "../../store/orderCreateProduct/orderCreateProduct.slice";

export default function OrdersFormPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm();

  const { orders } = useSelector((store) => store?.order);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const addressNameInput = watch("addressName", "");
  const addressCoordinates = watch("address", []);
  const userPhone = watch("phone", "");

  useEffect(()=> {
    dispatch(deleteAllOrders())
  },[location.pathname])

  console.log(orders);

  useEffect(() => {
    if (id) {
      fetchData();
      return () => {
        dispatch(deleteAllOrders());
      };
    }
  }, [id]);

  // Get Single data
  const fetchData = () => {
    if (!id) return setLoader(false);

    orderServices
      .getById(id)
      .then((res) => {
        const {
          comment,
          customer_details: {
            phone,
            name: customerName,
            address: { lat, long, name: addressName },
          },
          order_products: { products },
          order_type,
          payment_details: { payment_type_id },
        } = res || {};

        const productsArray = products.map((order) => {
          return {
            quantity: +order.count,
            id: order.product_id,
            name: order.product_name,
            price: order.product_price,
            totalPrice: order.total_price,
          };
        });

        const productObj = {
          name: customerName || "",
          phone: {
            id: id,
            value: phone,
            label: `${phone} ${customerName}`,
            name: customerName,
          },
          comment: comment || "",
          order_type: order_type || "",
          addressName,
          address: [long, lat],
          payment_type_id: payment_type_id || "",
        };
        reset(productObj);
        setValue("address", [long, lat]);
        dispatch(setCustomerOrders(productsArray));
      })
      .finally(() => setLoader(false));
  };

  const onSubmit = (data) => {


    const productsArray = orders.map((order) => {
      console.log(order);
      return {
        attributes: [],
        count: +order.quantity,
        product_id: order.id,
        product_name: order.name,
        product_price: order.price,
        total_price: order.totalPrice,
        category_id: order.category_id
      };
    });

    const totalPriceCalculation = orders.reduce((acc, order) => {
      return acc + order.price * order.quantity;
    }, 0);

    const orderData = {
      comment: `${data.comment}, Подъезд: ${data.entrance}, Этаж: ${data.floor}, Квартира: ${data.apartment}`,
      company_id: "c6440797-dc74-4054-a0f0-2a4d3e6d3867",
      customer_details: {
        address: {
          district: data.district,
          lat: +data.address[1],
          long: +data.address[0],
          name: data.addressName,
        },
        id: userPhone.id,
        name: data.name,
        phone: userPhone.value,
        telegram_id: ""
      },
      order_products: {
        products: productsArray,
        total_price: totalPriceCalculation,
      },
      order_type: data.order_type,
      delivery_price: 0,
      payment_details: {
        payment_type_id: data.payment_type_id,
      },
      product_price: totalPriceCalculation,
      total_price: totalPriceCalculation,
    };


    if (id) return updateOrder(orderData);
    orderCreate(orderData);
  };

  const updateOrder = (orderData) => {
    setBtnLoader(true)
    orderServices
      .update({
        ...orderData,
        id,
      })
      .then((res) => {
        navigate(`/orders`);
      })
      .catch((err)=> console.log(err))
      .finally(()=> setBtnLoader(false))
  };

  const orderCreate = (orderData) => {
    setBtnLoader(true)
    orderServices
      .create(orderData)
      .then((res) => {
        dispatch(deleteAllOrders());
        reset();
        navigate("/orders");
      })
      .catch((err) => console.log(err))
      .finally(()=> setBtnLoader(false))
  };




  const currentData = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cls.handleSubmitForm}>
      <Header
        loader={loader}
        backButtonLink={"/orders"}
        title="Orders"
      >
        <div className={cls.order__details}>
          <p className={cls.order__id}>ID {id}</p>
          <div className={cls.line} />
          <div className={cls.order__date}>
            <CalendarTodayIcon />
            <p>{currentData()}</p>
          </div>
        </div>
      </Header>
      <div className={cls.CreateUpdateContainer}>
        <OrderEdit
          btnLoaderSubmit={btnLoader}
          userPhone={userPhone}
          control={control}
          setValue={setValue}
          getValues={getValues}
          addressNameInput={addressNameInput}
          addressCoordinates={addressCoordinates}
        />
      </div>
    </form>
  );
}
