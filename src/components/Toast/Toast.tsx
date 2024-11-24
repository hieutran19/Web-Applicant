// Toast.tsx
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = () => {
  return <ToastContainer pauseOnFocusLoss
  draggable
  pauseOnHover closeOnClick  autoClose={1500}/>;
};

// Xuất cả ToastContainer và toast để dùng trong các component khác
export { Toast, toast };
