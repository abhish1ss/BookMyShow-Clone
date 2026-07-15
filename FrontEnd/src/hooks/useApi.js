import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { showError } from "../api";

// Reusable API-call wrapper: handles the global loader, the {success, message,
// data} response convention, and error alerts in one place.
//
//   const { data, execute } = useApi(getAllMovies);
//   useEffect(() => { execute(); }, []);
//
// Options:
//   onSuccess(data, response) — called after a successful response
//   successMessage — true to toast the backend message, or a string override
//   initialData — initial value for `data` (default null)
const useApi = (apiFn, { onSuccess, successMessage, initialData } = {}) => {
  const [data, setData] = useState(initialData ?? null);
  const dispatch = useDispatch();

  const execute = useCallback(
    async (...args) => {
      try {
        dispatch(showLoading());
        const response = await apiFn(...args);
        if (response?.success) {
          setData(response.data);
          if (successMessage) {
            message.success(
              successMessage === true ? response.message : successMessage
            );
          }
          onSuccess?.(response.data, response);
        } else {
          // showError de-dups against the axios interceptor's global toast
          showError(response?.message);
        }
        return response;
      } finally {
        dispatch(hideLoading());
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFn, dispatch]
  );

  return { data, setData, execute };
};

export default useApi;
