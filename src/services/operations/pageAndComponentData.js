import { apiconnector } from "../apiconnector";
import { categories } from "../apis";

const {
    GET_ALL_CATAGORY_DETAILS
} = categories;

export const getCatalogPageDetails = async(catagoryId) => {
    let result = [];
    try{
        const response = await apiconnector("POST",GET_ALL_CATAGORY_DETAILS,{catagoryId: catagoryId});

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        
        result = response?.data;
    } catch(e){
        console.log(e);
    }
    return result;
}