import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store/store";
import { App } from "./routes/App";

// CSS
import "./assets/css/index.css";

// Material Tailwind
import { ThemeProvider } from "@material-tailwind/react";

// Skeleton
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

// Redux Persist
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SkeletonTheme baseColor="#cbd5e1" highlightColor="#f1f5f9">
          <ThemeProvider>
            <Toaster />
            <App />
          </ThemeProvider>
        </SkeletonTheme>
      </PersistGate>
    </Provider>
  </StrictMode>
);
