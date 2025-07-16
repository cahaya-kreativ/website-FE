import { reduxGetReviewsProduct } from "../../../../services/user/reviews/GetReviewProduct";
import { setReview } from "../../../reducer/user/reviews/GetReviewProductSlice";

export const getReviewsProductAction = (productId, page = 1, filter = "") => async (dispatch) => {
  try {
    const result = await reduxGetReviewsProduct(productId, page, filter);
    dispatch(setReview(result.data.data));
    return result.data.data;
  } catch (error) {
    console.error("reduxGetReviewProduct", error);
  }
};