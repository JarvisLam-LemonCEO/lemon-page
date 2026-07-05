import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user?.role === "business") {
    return <Navigate to="/business" replace />;
  }

  if (token && user?.role === "normal") {
    return <Navigate to="/user" replace />;
  }

  return children;
}

export default PublicRoute;