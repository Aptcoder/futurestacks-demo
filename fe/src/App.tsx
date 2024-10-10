import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DeliveryListPage from "./pages/DeliveryListPage";
import CreateDeliveryPage from "./pages/CreateDeliveryPage";
import TransactionList from "./pages/TransactionList";
import Register from "./pages/Register";
import { PrivateRoutes } from "./pages/PrivateRoutes";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/deliveries" element={<DeliveryListPage />} />
        <Route path="/transactions" element={<TransactionList />} />
        {/* <Route path="/create-withdrawal" element={<CreateWithdrawalPage />} /> */}
        <Route path="/create-delivery" element={<CreateDeliveryPage />} />
      </Route>

      <Route path="*" element={<p> Does not exist</p>}></Route>
    </Routes>
  );
}

export default App;
