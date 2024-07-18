import request from "../utils/request";

const usersServices = {
  getList: ({limit, offset}) => request.get(`/user?limit=${limit}&offset=${offset}`),
  getById: (id, params) => request.get(`/user/${id}`, { params }),
  create: (data) => request.post("/user", data),
  update: (data) => request.put("/user", data),
  delete: (id) => request.delete(`/user/${id}`),
};

export default usersServices;
