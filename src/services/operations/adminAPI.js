import toast from "react-hot-toast";
import { apiconnector } from "../apiconnector";
import { adminEndpoints } from "../apis";

const {
    CREATE_CATEGORY_API
} = adminEndpoints;

export const createCategoryAdmin = async(data,token) => {
    let result = true;
    const toastId = toast.loading("Loading...");
    try{
        const response = await apiconnector("POST",CREATE_CATEGORY_API,data,{
            Authorization : `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Category Created Successfully!");
        result = true;
    } catch(e){
        console.log(e);
        toast.error(e.response.data.message);
    }
    toast.dismiss(toastId);
    return result;
}