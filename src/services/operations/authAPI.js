import toast from "react-hot-toast";
import { endpoints } from "../apis";
import { apiconnector } from "../apiconnector";
import {setLoading, setToken} from '../../slices/authSlice';
import {setUser} from '../../slices/profileSlice';

const {
    SENDOTP_API,
    LOGIN_API,
    SIGNUP_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API
} = endpoints;


export function sendOtp(email, naviagate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiconnector("POST",SENDOTP_API,{
                email
            });

            // console.log("Send otp resposne " + response);
            // console.log(response.data.success);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Otp Send Successfully!");
            naviagate("/verify-email");

        } catch(e){
            console.log("Error While Sending Otp..");
            toast.error(e.response.data.message);
        }   
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    }
}

export function login(email,password,navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        try{
            const response = await apiconnector("POST",LOGIN_API,{
                email,
                password
            });

            // console.log("Response Of Login: " + response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            // console.log(response);

            toast.success("Login Success");
            dispatch(setToken(response.data.token));
            const userImage = response.data?.existingUser?.image
            ? response.data.existingUser.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.existingUser.firstName} ${response.data.existingUser.lastName}`
            
            dispatch(setUser({ ...response.data.existingUser, image: userImage }));
            localStorage.setItem("user",JSON.stringify(response.data.existingUser));
            localStorage.setItem("token", JSON.stringify(response.data.token));
            
            navigate("/dashboard/my-profile");
        } catch(e) {
            console.log("LOGIN API ERROR............", e)
            toast.error(e.response.data.message);
        }
        dispatch(setLoading(false))
    }
}

export function signup(
    accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate,
) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiconnector("POST",SIGNUP_API,{
                accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp
            });

            // console.log("Sign Up Response: ", response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Sign Up Successful!");
            navigate("/login")
        } catch(e){
            console.log("Error While Sign Up!");
            toast.error(e.response.data.message);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function getPasswordResetToken(email,setEmailSent) {
    return async(dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiconnector("POST",RESETPASSTOKEN_API,{
                email
            });

            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            setEmailSent(true);
            toast.success("Email Sent Successfully");   
        } catch(e){
            console.log(e);
            toast.error(e.response.data.message);
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function resetPassword(password,confirmPassword,token,navigate){
    return async(dispatch) => {
        dispatch(setLoading(true));
        const toastId = toast.loading("Loading...");
        try{

            const response = await apiconnector("POST",RESETPASSWORD_API,{
                password,
                confirmPassword,
                token
            },{
                Authorization: `Bearer ${token}`
            });
            
            console.log(response);

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Password Change Successfully");
            navigate("/login")    
        } catch(e){
            console.log(e);
            toast.error("Password Not Changed");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logout(navigate){
    return async(dispatch) => {
        dispatch(setToken(null))
        dispatch(setUser(null))
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logout Successfully")
        navigate("/");
    }
}