import API from "../../api/axios"

const unavailable = (message) =>
    Promise.reject({
        response: {
            data: {
                success: false,
                message
            }
        }
    });



export const SignUpAPI = (userData) => {

    return API.post("/user/signup", userData);

};




export const LoginAPI = (userData) => {

    return API.post("/user/login", userData);

};



export const LogoutAPI = () => {

    return API.post("/user/logout");

};

export const GetProfileAPI = () => {

    return API.get("/user/profile");

};

export const UpdateProfileAPI = (userData) => {

    return API.put("/user/update-profile", userData);

};

export const ChangePasswordAPI = (passwordData) => {

    return API.put("/user/change-password", passwordData);

};

