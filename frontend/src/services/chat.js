import API from "./api";

export const sendMessage = async (message) => {
  const res = await API.post("/chat/", { message });
  return res.data;
};

export const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await API.post("/upload/", formData);
  return res.data;
};