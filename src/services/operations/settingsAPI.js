import toast from 'react-hot-toast';
import { apiconnector } from '../apiconnector';
import { setUser } from '../../slices/profileSlice';
import { logout } from './authAPI';
const { settingsEndpoints } = require('../apis');

const {
    DELETE_ACCOUNT_API,
    CHANGE_PASSWORD_API,
    UPDATE_PROFILE_API,
    UPDATE_DISPLAY_PICTURE_API,
} = settingsEndpoints;

export function deleteProfile(token,navigate) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        try{

            const response = await apiconnector("DELETE",DELETE_ACCOUNT_API,null,{
                Authorization : `Bearer ${token}`
            });

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Profile Deleted Successfully");
            dispatch(logout(navigate));
        } catch(e){
            console.log(e);
            toast.error("Account Not Deleted!")
        }
        toast.dismiss(toastId);
    }
}

export function changePassword(token, data) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        try {

            const response = await apiconnector("POST", CHANGE_PASSWORD_API,data,{
                Authorization: `Bearer ${token}`
            });

            // console.log("CHANGE_PASSWORD_API API RESPONSE............", response)
        
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Changed Successfully")
        } catch (error) {
            console.log("CHANGE_PASSWORD_API API ERROR............", error)
            toast.error(error.response.data.message)
        }
        toast.dismiss(toastId);
    }
}

export function updateProfile(token, data){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        try{
            
            const {
                firstName,lastName,contactNumber,gender,about,dateOfBirth
            } = data;
            console.log(data);

            const response = await apiconnector("POST",UPDATE_PROFILE_API,{
                firstName,lastName,contactNumber,gender,about,dateOfBirth, token
            });

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            // console.log(response);

            const userImage = response.data.newUpdateduser.image
                ? response.data.newUpdateduser.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.newUpdateduser.firstName} ${response.data.newUpdateduser.lastName}`
            dispatch(setUser({ ...response.data.newUpdateduser, image: userImage }));
            localStorage.removeItem("user");
            localStorage.setItem("user",JSON.stringify(response.data.newUpdateduser));
            toast.success("Data Updated Successfully");
        } catch(e){
            console.log(e);
            toast.error("Something Went Wrong!")
        }
        toast.dismiss(toastId);
    }
}

export function updateDisplayPicture(token, formData) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      try {
        const response = await apiconnector(
          "PUT",
          UPDATE_DISPLAY_PICTURE_API,
          formData,
          {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          }
        );

        // console.log(
        //   "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        //   response
        // )
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

        toast.success("Display Picture Updated Successfully")
        localStorage.removeItem("user");
        localStorage.setItem("user",JSON.stringify(response.data.data));
        dispatch(setUser(response.data.data));
      } catch (error) {
        console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
        toast.error("Could Not Update Display Picture")
      }
      toast.dismiss(toastId)
    }
}
