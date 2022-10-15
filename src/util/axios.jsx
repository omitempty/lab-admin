import axios from "axios";
import { finish, start } from "../redux/loadingSlice";
import store from "../redux/store";

axios.defaults.baseURL = "http://localhost:5000";

// axios.defaults.headers

// axios.interceptors.request.use
axios.interceptors.request.use(
  // 注意基本上都是函数式编程了
  function (config) {
    // Do something before request is sent
    store.dispatch(start());
    return config;
  },
  function (error) {
    // Do something with request error
    store.dispatch(finish());
    return Promise.reject(error);
  }
);

// axios.interceptors.response.use
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    store.dispatch(finish());
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    store.dispatch(finish());
    return Promise.reject(error);
  }
);
