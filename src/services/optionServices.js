import request from "../utils/request";

const optionServices = {
  delete: (id) => request.delete(`/option/${id}`),
};

export default optionServices;