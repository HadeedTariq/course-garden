import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

const authApi = axios.create({
  baseURL: `${url}/auth`,
  withCredentials: true,
});

const teacherApi = axios.create({
  baseURL: `${url}/teacher`,
  withCredentials: true,
});

const chapterApi = axios.create({
  baseURL: `${url}/chapter`,
  withCredentials: true,
});

const studentApi = axios.create({
  baseURL: `${url}/student`,
  withCredentials: true,
});

const playlistApi = axios.create({
  baseURL: `${url}/playlist`,
  withCredentials: true,
});

const feedbackApi = axios.create({
  baseURL: `${url}/feedback`,
  withCredentials: true,
});

const adminApi = axios.create({
  baseURL: `${url}/admin`,
  withCredentials: true,
});

export {
  authApi,
  teacherApi,
  chapterApi,
  studentApi,
  playlistApi,
  feedbackApi,
  adminApi,
};
