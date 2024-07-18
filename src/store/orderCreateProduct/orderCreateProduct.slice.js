import { createSlice, current } from "@reduxjs/toolkit";

const orderCreateProductReducer = createSlice({
  name: "createOrder",
  initialState: {
    initialOrders: [],
    orders: [],
    initialDataLoaded: false,
    totalPrice: 0
  },
  reducers: {
    createOrder(state, { payload }) {
      console.log(payload);
      state.orders = [...state.orders, payload];
    },
    deleteOrder(state, { payload }) {
      state.orders = state.orders.filter((order) => order.id !== payload);
    },
    editOrder(state, { payload }) {
      console.log(payload);
      state.orders = state.orders.map((order) => {
        if (order.id === payload.id) {
          // Recalculate the total price including selected attributes
          const attributesTotalPrice = order.attribute.reduce(
            (total, attr) => total + (attr.selectedOption ? attr.selectedOption.price : 0),
            0
          );
          const updatedOrder = {
            ...order,
            quantity: payload.quantity,
            totalPrice: payload.quantity * (order.price + attributesTotalPrice),
          };
          return updatedOrder;
        }
        return order;
      });
    },
    deleteAllOrders(state, {payload}) {
        state.orders = []
        state.initialDataLoaded = false;
    },
    setCustomerOrders(state, {payload}) {
      if (!state.initialDataLoaded) {
        state.orders = [...state.orders, ...payload];
        state.initialDataLoaded = true;
      }
    },


    orderTotalCost(state) {
      console.log(state);
      state.totalPrice = state.orders.reduce((acc, itemObj) => {
        const attributeCost = (itemObj.attribute || []).reduce((attAcc, att) => {
          return attAcc + (att.selectedOption ? att.selectedOption.price : 0);
        }, 0);
        return acc + (itemObj.quantity * (itemObj.price + attributeCost));
      }, 0);
    },

    // createNewOrder(state, {payload}) {
    //   state.initialOrders = payload
    //   state.orders = [...statei.intialOrders ]
    // },

    addAttributes(state, { payload }) {
      const { product, attribute, selectedOption } = payload;
      const productIndex = state.orders.findIndex((order) => order.id === product.id);

      if (productIndex !== -1) {
        const currentProduct = state.orders[productIndex];
        const attributeIndex = currentProduct.attribute.findIndex(
          (attr) => attr.id === attribute.id
        );

        if (attributeIndex !== -1) {
          if (selectedOption) {
            currentProduct.attribute[attributeIndex] = { ...attribute, selectedOption };
          } else {
            // If no selectedOption is provided, remove the selectedOption property
            const { selectedOption, ...rest } = currentProduct.attribute[attributeIndex];
            currentProduct.attribute[attributeIndex] = rest;
          }
        }

        // Recalculate the total price of the product based on selected attributes
        const attributesTotalPrice = currentProduct.attribute.reduce(
          (total, attr) => total + (attr.selectedOption ? attr.selectedOption.price : 0),
          0
        );
        currentProduct.totalPrice = currentProduct.quantity * (product.price + attributesTotalPrice);

        state.orders[productIndex] = currentProduct;
      }
    },

  },
});

export default orderCreateProductReducer.reducer;

export const { createOrder, deleteOrder, editOrder, deleteAllOrders,setCustomerOrders,createNewOrder,addAttributes, orderTotalCost } =
  orderCreateProductReducer.actions;
