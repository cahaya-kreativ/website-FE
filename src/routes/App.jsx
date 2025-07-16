import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Token Protected
import TokenProtected from "../assets/components/protected/TokenProtected";
import AdminTokenProtected from "../assets/components/protected/AdminTokenProtected";

// Pages
import { Homepage } from "../pages/Homepage";
import { Login } from "../pages/user/auth/Login";
import { Register } from "../pages/user/auth/Register";
import { ForgetPass } from "../pages/user/auth/ForgetPass";
import { Otp } from "../pages/user/auth/Otp";
import { Error404 } from "../pages/errors/Error404";
import { ResetPass } from "../pages/user/auth/ResetPass";
import { UserProfile } from "../pages/user/profile/UserProfile";
import { UserPassword } from "../pages/user/profile/UserPassword";
import { Notification } from "../pages/user/profile/Notification";
import { Chat } from "../pages/user/chat/Chat";
import { Product } from "../pages/mitra/product/Product";
import { Order } from "../pages/user/order/Order";
import { TentangKami } from "../pages/mitra/profile/TentangKami";
import { Gallery } from "../pages/mitra/gallery/Gallery";
import { DetailProduct } from "../pages/mitra/product/DetailProduct";
import { DetailHistory } from "../pages/user/order/DetailHistory";
import { History } from "../pages/user/order/History";
import { PaymentOrder } from "../pages/user/payment/PaymentOrder";
import { DonePayment } from "../pages/user/payment/DonePayment";
import { LoginAdmin } from "../pages/mitra/auth/LoginAdmin";
import { DashboardAdmin } from "../pages/mitra/DashboardAdmin";
import { KelolaOrders } from "../pages/mitra/kelola/KelolaOrders";
import { KelolaUsers } from "../pages/mitra/kelola/KelolaUsers";
import { ChatAdmin } from "../pages/mitra/chat/ChatAdmin";
import { Setting } from "../pages/mitra/kelola/Setting";
import { KelolaGallery } from "../pages/mitra/kelola/KelolaGallery";
import { KelolaJadwal } from "../pages/mitra/kelola/KelolaJadwal";
import { KelolaProduk } from "../pages/mitra/kelola/KelolaProduk";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />

        {/* User Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forget-password" element={<ForgetPass />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/otp" element={<Otp />} />

        {/* Profile User */}
        <Route
          path="/profile-user"
          element={
            <TokenProtected>
              <UserProfile />
            </TokenProtected>
          }
        />
        <Route
          path="/notification"
          element={
            <TokenProtected>
              <Notification />
            </TokenProtected>
          }
        />
        <Route
          path="/password-user"
          element={
            <TokenProtected>
              <UserPassword />
            </TokenProtected>
          }
        />

        {/* Chatting */}
        <Route
          path="/chat"
          element={
            <TokenProtected>
              <Chat />
            </TokenProtected>
          }
        />

        {/* Product */}
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<DetailProduct />} />

        {/* Order */}
        <Route
          path="/order/:productId"
          element={
            <TokenProtected>
              <Order />
            </TokenProtected>
          }
        />
        <Route
          path="/history"
          element={
            <TokenProtected>
              <History />
            </TokenProtected>
          }
        />
        <Route
          path="/history/:id"
          element={
            <TokenProtected>
              <DetailHistory />
            </TokenProtected>
          }
        />

        {/* Payment */}
        <Route
          path="/payment/:orderId"
          element={
            <TokenProtected>
              <PaymentOrder />
            </TokenProtected>
          }
        />
        <Route path="/payment-done" element={<DonePayment />} />

        {/* Tentang Kami */}
        <Route path="/tentang-kami" element={<TentangKami />} />

        {/* Gallery */}
        <Route path="/gallery" element={<Gallery />} />

        {/* Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminTokenProtected>
              <DashboardAdmin />
            </AdminTokenProtected>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminTokenProtected>
              <KelolaOrders />
            </AdminTokenProtected>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminTokenProtected>
              <KelolaUsers />
            </AdminTokenProtected>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminTokenProtected>
              <KelolaProduk />
            </AdminTokenProtected>
          }
        />
        <Route 
        path="/admin/chat"
        element={
          <AdminTokenProtected>
            <ChatAdmin />
          </AdminTokenProtected>
        }
        />
        <Route 
        path="/admin/gallery"
        element={
          <AdminTokenProtected>
            <KelolaGallery />
          </AdminTokenProtected>
        }
        />
        <Route 
        path="/admin/setting"
        element={
          <AdminTokenProtected>
            <Setting />
          </AdminTokenProtected>
        }
        />
        <Route 
        path="/admin/schedule"
        element={
          <AdminTokenProtected>
            <KelolaJadwal />
          </AdminTokenProtected>
        }
        />

        {/* Error */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};
