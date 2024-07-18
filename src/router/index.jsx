import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Login from "../views/Auth/Login";
import Registration from "../views/Auth/Registration";
import CategoryForm from "../views/Categories/CategoryForm";
import CategoryPage from "../views/Categories";
import PositionsPage from "../views/Products";
import PositionsFormPage from "../views/Products/ProductsFormPage";
import Dashboard from "../views/Dashboard"
import OrdersPage from "../views/Orders"
import OrdersFormPage from "../views/Orders/OrdersFormPage";
import CustomerPage from "../views/Customers";
import CustomerFormPage from "../views/Customers/CustomerFormPage";

const Router = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  if (!isAuth)
    return (
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login " />} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<PositionsPage />} />
        <Route path="products/create" element={<PositionsFormPage />} />
        <Route path="products/:id" element={<PositionsFormPage />} />
        <Route path="menu" element={<>Menu</>} />
        <Route path="category" element={<CategoryPage />} />
        <Route path="category/create" element={<CategoryForm />} />
        <Route path="category/:id" element={<CategoryForm />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/create" element={<OrdersFormPage />} />
        <Route path="orders/:id" element={<OrdersFormPage />} />
        <Route path="customer" element={<CustomerPage />} />
        <Route path="customer/create" element={<CustomerFormPage />}/>
        <Route path="customer/:id" element={<CustomerFormPage />}/>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default Router;
