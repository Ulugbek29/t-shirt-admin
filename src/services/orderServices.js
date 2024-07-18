import request from "../utils/request";

const orderServices = {
  getList: ({limit=100, offset=0, customerId = "", from_date}) => request.get(`/order?limit=${limit}&offset=${offset}&customer_id=${customerId}`),
  getById: (id, params) => request.get(`/order/${id}`, { params }),
  create: (data) => request.post("/order", data),
  update: (data) => request.put("/order", data),
  delete: (id) => request.delete(`/order/${id}`),
};

export default orderServices;
