import request from "../utils/request";

const fileService = {
  uploadImage: (data) => request.post(`/upload`, data),
};

export default fileService;
