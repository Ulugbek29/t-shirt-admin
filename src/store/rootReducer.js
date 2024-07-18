import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import { alertReducer } from "./alert/alert.slice";
import { authReducer } from "./auth/auth.slice";
import storage from "redux-persist/lib/storage"
import orderCreateProductReducer from "./orderCreateProduct/orderCreateProduct.slice";
import {constructorTableReducer} from "./constructorTable/constructorTable.slice"


const authPersistConfig = {
  key: "auth",
  storage,
}

const crateOrderPersistConfig = {
  key: "createOrder",
  storage,
}

const constructorTablePersistConfig = {
  key: "constructorTable",
  storage,
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  order: persistReducer(crateOrderPersistConfig, orderCreateProductReducer),
  constructorTable: persistReducer(constructorTablePersistConfig, constructorTableReducer),
  alert: alertReducer,
})

export default rootReducer