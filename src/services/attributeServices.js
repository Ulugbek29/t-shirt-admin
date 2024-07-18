import request from "../utils/request";

const attributeServices = {
  delete: (id) => request.delete(`/attribute/${id}`),
};

export default attributeServices;