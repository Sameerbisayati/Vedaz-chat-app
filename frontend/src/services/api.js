import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`
});

export const loginUser = async (
  username,
  profilePhoto
) => {
  const formData = new FormData();

  formData.append("username", username);

  if (profilePhoto) {
    formData.append(
      "profilePhoto",
      profilePhoto
    );
  }

  const response = await api.post(
    "/auth/login",
    formData
  );

  return response.data.user;
};

export const getMessages = async () => {
  const response = await api.get("/messages");

  return response.data;
};

export const sendMessage = async (
  senderId,
  text
) => {
  const response = await api.post(
    "/messages",
    {
      senderId,
      text
    }
  );

  return response.data;
};

export default api;