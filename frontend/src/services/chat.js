import API from "./api";

export const sendMessage = async (message) => {
  const res = await API.post("/chat/", { message });
  return res.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/upload/", formData);
  return res.data;
};