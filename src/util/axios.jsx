import axios from "axios";
import { finish, start } from "../redux/loadingSlice";
import store from "../redux/store";

axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.request.use(
  function (config) {
    store.dispatch(start());
    return config;
  },
  function (error) {
    store.dispatch(finish());
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    store.dispatch(finish());
    return response;
  },
  function (error) {
    store.dispatch(finish());
    return Promise.reject(error);
  }
);
