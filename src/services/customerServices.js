import request from "../utils/request";

const customerService = {
  getList: ({limit=1000, offset=0, search="", phoneSearch=""}) => request.get(`/customer?limit=${limit}&offset=${offset}&phone=${phoneSearch}&search=${search}`),
  getById: (id, params) => request.get(`/customer/${id}`, { params }),
  create: (data) => request.post("/customer", data),
  update: (data) => request.put("/customer", data),
  delete: (id) => request.delete(`/customer/${id}`),
};

export default customerService;
