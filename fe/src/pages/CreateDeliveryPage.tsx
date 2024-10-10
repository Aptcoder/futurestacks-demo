import { Navigate } from "react-router-dom";
import CreateDeliveryForm from "../components/CreateDeliveryForm";
import Navbar from "../components/NavBar";
import useUserRole from "../hooks/useRole";

export default function CreateDeliveryPage() {
  const role = useUserRole();
  if (role == null) {
    return null;
  }
  if (role !== "user") {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <Navbar />
      <CreateDeliveryForm />
    </>
  );
}
