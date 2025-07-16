import { showErrorToast } from "../../../../helper/ToastHelper";
import { reduxCreateReview } from "../../../../services/user/reviews/CreateReviews";
import { createReview } from "../../../reducer/user/reviews/CreateReviewSlice";

export const createReviewAction = (orderId, input) => async (dispatch) => {
  return reduxCreateReview(orderId, input)
    .then((result) => {
      dispatch(createReview(result.data.data.review));
      return result;
    })
    .catch((err) => {
      console.error("reduxCreateReview", err);
      if (err.response) {
        if (err.response.status >= 400 && err.response.status <= 500) {
          showErrorToast(err.response.data.message);
        } else {
          console.error("unexpected Error", err);
        }
      }
    });
};
