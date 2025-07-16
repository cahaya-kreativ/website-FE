import { combineReducers } from "@reduxjs/toolkit";
import registerSlice from "./user/auth/registerSlice";
import loginSlice from "./user/auth/loginSlice";
import otpSlice from "./user/auth/otpSlice";
import passwordSlice from "./user/auth/passwordSlice";
import profileSlice from "./user/profile/profileSlice";
import ChangePassSlice from "./user/profile/ChangePassSlice";
import getCategoriesSlice from "./admin/categories/GetCategoriesSlice";
import getProductsSlice from "./admin/product/GetProductsSlice";
import getNotificationsSlice from "./user/notifications/GetNotificationsSlice";
import createOrderSlice from "./user/order/createOrderSlice";
import getOrdersSlice from "./user/order/getOrderSlice";
import createReviewSlice from "./user/reviews/CreateReviewSlice";
import getReviewSlice from "./user/reviews/GetReviewProductSlice";
import CancelOrderSlice from "./admin/order/CancelOrderSlice";
import getGallerySlice from "./admin/gallery/GetGallerySlice";
import paymentSlice from "./user/payment/PaymentSlice";
import chattingSlice from "./user/chat/chattingSlice";
import loginAdminSlice from "./admin/auth/loginAdminSlice";
import countSlice from "./admin/dashboard/CountSlice";
import createNotifSlice from "./admin/dashboard/CreateNotifSlice";
import discountSlice from "./admin/discount/discountSlice";
import createCategoriesSlice from "./admin/categories/createCategoriesSlice";
import getOrderSlice from "./admin/order/GetOrderSlice";
import getCustomersSlice from "./admin/dashboard/GetCustomersSlice";
import chatAdminSlice from "./admin/chat/chatAdminSlice";
import addEmployeeSlice from "./admin/auth/addEmployeeSlice";
import ChangePasswordMitraSlice from "./admin/auth/changePassMitraSlice";
import getScheduleSlice from "./admin/schedule/getScheduleSlice";
import createProductSlice from "./admin/product/createProductSlice";
import createPortofolioSlice from "./admin/product/createPortofolioSlice";

export default combineReducers({
  // User
  authLogin: loginSlice,
  authRegister: registerSlice,
  authOtp: otpSlice,
  authPassword: passwordSlice,

  // Profile
  authProfile: profileSlice,
  changePass: ChangePassSlice,

  // Categories
  getCategories: getCategoriesSlice,
  createCategories: createCategoriesSlice,

  // Galleries
  getGalleries: getGallerySlice,

  // Products
  getProducts: getProductsSlice,
  createProduct: createProductSlice,
  createPortofolio: createPortofolioSlice,

  // Orders
  orders: createOrderSlice,
  getOrders: getOrdersSlice,

  // Payments
  payments: paymentSlice,

  // Notifications
  notifications: getNotificationsSlice,

  // Reviews
  createReview: createReviewSlice,
  getReviews: getReviewSlice,

  // Chatting
  chatting: chattingSlice,

  // Admin
  authLoginAdmin: loginAdminSlice,
  addEmployee: addEmployeeSlice,
  changePassMitra: ChangePasswordMitraSlice,
  count: countSlice,
  createNotif: createNotifSlice,
  getChatAdmin: chatAdminSlice,

  // Discount
  discount: discountSlice,

  // Schedule
  getSchedule: getScheduleSlice,

  // Status Order
  cancelOrder: CancelOrderSlice,
  doneOrder: CancelOrderSlice,
  validateOrder: CancelOrderSlice,
  getOrder: getOrderSlice,
  getCustomer: getCustomersSlice,
});
