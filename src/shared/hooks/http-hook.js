import { useCallback, useEffect, useRef, useState } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body, headers = {}) => {
      try {
        setIsLoading(true);

        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);

        const response = await fetch(url, {
          method: method,
          headers: headers,
          body: body,
          signal: httpAbortController.signal,
        });
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (abortController) => abortController !== httpAbortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong! Please try again.");
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortController) =>
        abortController.abort()
      );
    };
  }, []);

  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
    clearError: clearError,
  };
};
