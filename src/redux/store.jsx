import { configureStore } from "@reduxjs/toolkit";
import collapsedReducer from "./collapsedSlice";
import loadingReducer from "./loadingSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "collapsed",
  storage,
};
const persistedReducer = persistReducer(persistConfig, collapsedReducer);

const store = configureStore({
  reducer: {
    collapsed: persistedReducer,
    loading: loadingReducer,
  },
});

const persistor = persistStore(store);

export default store;
export { persistor };
