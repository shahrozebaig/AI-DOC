import API from "./api";

export const sendMessage = async (message, userId, sessionId = null) => {
  const res = await API.post("/chat/", { 
    message, 
    user_id: userId, 
    session_id: sessionId 
  });
  return res.data;
};

export const getChatSessions = async (userId) => {
  const res = await API.get(`/chat/sessions/${userId}`);
  return res.data;
};

export const getMessagesBySession = async (sessionId) => {
  const res = await API.get(`/chat/messages/${sessionId}`);
  return res.data;
};

export const deleteChatSession = async (sessionId) => {
  const res = await API.delete(`/chat/session/${sessionId}`);
  return res.data;
};

export const uploadFiles = async (files, userId) => {
  const formData = new FormData();
  formData.append("user_id", userId);
  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await API.post("/upload/", formData);
  return res.data;
};