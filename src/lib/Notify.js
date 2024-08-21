import Toastify from "toastify-js";
const Notification = {
  showError({ text }) {
    Toastify({
      text,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(to right, #ff5f6d, #ffc371)" /* Red gradient */,
      },
    }).showToast();
  },
  showSuccess({ text }) {
    Toastify({
      text,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #ff5f6d, #ffc371)",
      },
    }).showToast();
  },
};
export default Notification;
