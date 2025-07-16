import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper
import { showErrorToast } from "../../../helper/ToastHelper";

// Cookies
import { CookieStorage, CookiesKeys } from "../../../utils/cookie";

// Loading Spinner
import LoadingSpinner from "../../components/loading/LoadingSpinner";

function TokenProtected({ children }) {
  const navigate = useNavigate();
  const token = CookieStorage.get(CookiesKeys.AuthToken);
  const hasShownToast = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log("TokenProtected useEffect called");
    if (!token) {
      if (!hasShownToast.current) {
        showErrorToast("Please Login First!");
        hasShownToast.current = true;
      }
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [token, navigate]);

  if (loading) return <LoadingSpinner />;

  return children;
}

TokenProtected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TokenProtected;
