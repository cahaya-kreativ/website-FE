import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Helper
import { showErrorToast } from "../../../helper/ToastHelper";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

// Loading Spinner
import LoadingSpinner from "../../components/loading/LoadingSpinner";

function AdminTokenProtected({ children }) {
  const navigate = useNavigate();
  const token = CookieStorage.get(CookiesKeys.AdminToken);
  const hasShownToast = useRef(false);
  const [loading, setLoading] = useState(true);
  // const admin = useSelector((state) => state.authLoginAdmin.admin);
  // console.log("admin", admin)

  useEffect(() => {
    // console.log("TokenProtected useEffect called");
    if (!token) {
      if (!hasShownToast.current) {
        showErrorToast("Please Login at Pages Admin First!");
        hasShownToast.current = true;
      }
      navigate("/admin/login");
    } else {
      setLoading(false);
    }
  }, [token, navigate]);

  if (loading) return <LoadingSpinner />;

  return children;
}

AdminTokenProtected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminTokenProtected;
