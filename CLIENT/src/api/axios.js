import axios from "axios";

const API = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

    withCredentials: true

});

// Several requests can fail together when the short-lived access cookie expires.
// Share one refresh request so those requests are all retried with the new cookie,
// instead of racing each other and incorrectly sending the user back to login.
let refreshPromise = null;

API.interceptors.response.use(
    (response) => {
        if (response.data?.success === false) {
            return Promise.reject({ response });
        }

        return response;
    },
    async (error) => {
        const request = error.config;
        if (error.response?.status === 401 && !request?._retried && !request?.url?.includes("/user/refresh")) {
            request._retried = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = API.post("/user/refresh").finally(() => {
                        refreshPromise = null;
                    });
                }
                await refreshPromise;
                return API(request);
            } catch {
                // Let Redux/auth guards handle a genuinely expired session.
            }
        }
        return Promise.reject(error);
    }
);

export default API;
