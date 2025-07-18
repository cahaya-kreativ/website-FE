//  API Endpoint
export const API_ENDPOINT = {
  // USERS
  USER_LOGIN: "/users/login", // [POST] Login User
  USER_REGISTER: "/users/register", // [POST] Register User
  VERIFY_OTP: "/users/verify-otp", // [PUT] Verify OTP User
  RESEND_OTP: "/users/resend-otp", // [PUT] Resend OTP User
  FORGET_PASS: "/users/forget-password", // [POST] Forgot Password
  RESET_PASS: "/users/reset-password", // [PUT] RESET Password
  AUTH_USER: "/users/authenticate", // [GET] Get User by Authenticate

  // GOOGLE
  GOOGLE: "/users/google", // [GET] Login User With Google
  GOOGLE_CALLBACK: "/users/google/callback", // [GET] Google Callback

  // PROFILES
  PROFILE_USER: "/users/profile", // [GET] Profile User
  PROFILE_UPDATE: "/users/profile", // [PUT] Profile User
  PASS_UPDATE: "/users/profile/change-password", // [PUT] Password USer

  // NOTIFICATIONS
  GET_ALL_NOTIFICATIONS: "/notifications", // [GET] Get All Notification by Authentication
  UPDATE_NOTIFICATION: "/notification/markAsRead", // [PUT] Update Notification by Authentication
  UPDATE_ALL_NOTIFICATIONS: "/notifications/markAsRead/all", // [PUT] Update All Notification by Authentication

  //  CATEGORIES
  CREATE_CATEGORIES: "/categories", //  [POST] Create Categories [ADMIN]
  GET_ALL_CATEGORIES: "/categories", // [GET] Get All Categories by Authentication
  GET_DETAIL_CATEGORIES: "/categories", //  [GET] Get Detail Categories by Authentication
  UPDATE_CATEGORIES: "/categories", //  [PUT] Update Categories by Authentication [ADMIN]
  DELETE_CATEGORIES: "/categories", //  [DELETE] Delete Categories by Authentication [ADMIN]

  //  PRODUCTS
  CREATE_PRODUCTS: "/product", //  [POST] Create Products [ADMIN]
  GET_ALL_PRODUCTS: "/product", // [GET] Get All Products by Authentication
  GET_DETAIL_PRODUCTS: "/product", // [GET] Get Detail Products by Authentication
  UPDATE_PRODUCTS: "/product", //  [PUT] Update Products by Authentication [ADMIN]
  DELETE_PRODUCTS: "/product", //  [DELETE] Delete Products by Authentication [ADMIN]

  // PORTOFOLIOS
  CREATE_PORTOFOLIO: "/portfolio", // [POST] Create Portofolio [ADMIN]
  GET_ALL_PORTOFOLIO: "/portfolio", // [GET] Get All Portofolio Products
  GET_DETAIL_PORTOFOLIO: "/portfolio", // [GET] Get Detail Portofolio Product
  UPDATE_PORTOFOLIO: "/portfolio", // [PUT] Update Portofolio [ADMIN]
  DELETE_PORTOFOLIO: "/portfolio", // [DELETE] Delete Portofolio [ADMIN]

  // GALLERIES
  CREATE_GALLERY: "/gallery", //  [POST] Create Gallery Media [ADMIN]
  GET_GALLERIES: "/gallery", //   [GET] Get All Galleries
  DELETE_GALLERIES: "/gallery",// [DELETE] Delete Gallery with ID [ADMIN]

  // ORDERS
  CREATE_ORDER: "/order", // [POST] Create Order Product
  GET_ALL_ORDERS: "/orders", // [GET] Get All Orders by Authentication
  GET_DETAIL_ORDER: "/order", // [GET] Get Detail Order by Authentication
  CREATE_QR: "/QR", // [POST] Create Qr

  // DISCOUNT ORDER
  DISCOUNT: "/order/discount", // [PUT] Create get discount

  // PAYMENTS
  GET_ALL_PAYMENTS: "/payments", // [GET] Get All Payments by Authentication
  GET_DETAIL_PAYMENTS: "/payment", // [GET] Get Detail Payment by Authentication
  CREATE_PAYMENT_MIDTRANS: "/payment/midtrans", // [POST] Create Payment By Midtrans

  // REVIEWS
  CREATE_REVIEWS: "/reviews", // [POST] Create Reviews by Authentication
  GET_REVIEWS_PRODUCT: "/reviews/products", // [GET] Get All Reviews By Product
  GET_REVIEWS_USER: "/user/reviews", // [GET] Get Review User by Authentication
  UPDATE_REVIEWS: "/reviews",  // [PUT] Update Reviews Product by Authentication

  // CHATTING
  CREATE_CHAT: "/chat", // [POST] Create Chat
  USER_GET_CHAT: "/chats/:senderId/:receiverId", // [GET] Get Chat User By SenderId & ReceiverId
  ADMIN_GET_CHAT: "/admin/chats", // [GET] All Chat User By Admin

  // ADMIN 
  ADMIN_LOGIN: "/admin/login", // [POST] Login User
  COUNT_CUSTOMERS: "/count/customers", // [GET]
  COUNT_ORDERS: "/count/orders", // [GET]
  COUNT_PRODUCTS: "/count/products", // [GET]
  COUNT_CATEGORIES: "/count/categories", // [GET]
  DASHBOARD_ADMIN: "/data/product", // [GET]
  CREATE_NOTIFICATIONS: "/notifications", // [POST] Create Notification
  ALL_USER: "/all/users", // [GET] 
  ALL_EMPLOYEE: "/all/employees", // [GET] 
  ADD_EMPLOYEE: "/add/employee", // [POST]
  CHANGE_PASS: "/change-password", // [Put]
  EDIT_EMPLOYEE: "/edit/employee", // [Put]
  DELETE_EMPLOYEE: "delete/employee", // [Delete]

  // DISCOUNT
  CREATE_DISCOUNT: "/discount", // [POST]
  GET_DISCOUNT: "/discount", // [GET]
  UPDATE_DISCOUNT: "/discount", // [PUT]
  DELETE_DISCOUNT: "/discount", // [DELETE]

  // ADMIN ORDER STATUS
  GET_ORDERS: "/all/orders", // [GET] Get All Order
  DONE_ORDER: "/order/done", // [PUT] Update Status Order
  CANCEL_ORDER: "/order/cancel", // [PUT] Update Status Order [USER & ADMIN]
  VALIDATE_ORDER: "/order/validate", // [PUT] Update Status Order

  // SCHEDULE
  CREATE_SCHEDULE: "/schedule", // [POST] Create Schedule
  GET_ALL_SCHEDULE: "/schedule", // [GET] Get All Schedule
  GET_DETAIL_SCHEDULE: "/schedule", // [GET] Get Detail Schedule
  UPDATE_SCHEDULE: "/schedule", // [PUT] Update Schedule
  DELETE_SCHEDULE: "/schedule", // [DELETE] Delete Schedule
};
