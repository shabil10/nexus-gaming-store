import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { hideToast } from "../redux/slices/toastSlice";

function Toast() {
  const dispatch = useDispatch();

  const {
    message,
    type,
    visible
  } = useSelector(
    (state) => state.toast
  );

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch(hideToast());
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [visible, dispatch]);

  if (!visible) {
    return null;
  }

  const typeStyles = {
    success:
      "border-green-500/30 bg-green-500/10 text-green-400",
    error:
      "border-red-500/30 bg-red-500/10 text-red-400",
    warning:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "!"
  };

  return (
    <div className="fixed right-5 top-5 z-[9999]">
      <div
        className={`flex min-w-[280px] items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl ${typeStyles[type]}`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-current/10 font-bold">
          {icons[type]}
        </span>

        <p className="text-sm font-semibold">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            dispatch(hideToast())
          }
          className="ml-auto text-lg opacity-70 transition hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;