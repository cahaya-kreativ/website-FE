import toast from "react-hot-toast";

const showSuccessToast = (message) => {
  return toast.success(message, {
    duration: 3000,
    position: "top-right",
    onHover: (persist, toast) => {
      persist();
    },
  });
};

const showErrorToast = (message) => {
  return toast.error(message, {
    duration: 3000,
    position: "top-right",
    onHover: (persist, toast) => {
      persist();
    },
  });
};

const showLoadingToast = (message) => {
  return toast.loading(message, {
    duration: 3000,
    position: "top-right",
    onHover: (persist, toast) => {
      persist();
    },
  });
};

export { showSuccessToast, showErrorToast, showLoadingToast };
