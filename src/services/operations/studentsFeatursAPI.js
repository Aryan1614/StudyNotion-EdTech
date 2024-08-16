import toast from "react-hot-toast";
import { studentsEndpoints } from '../apis';
import { apiconnector } from "../apiconnector";
import rzp_logo from '../../assets/Logo/rzp_logo.png';
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_VERIFICATION_MAIL,    
    FETCH_PAYMENT_HISTORY_DETAILS
} = studentsEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            return resolve(true);
        }
        script.onerror = () => {
            return resolve(false);
        }
        document.body.appendChild(script);
    })
}

export const buyCourse = async(token,courses,navigate,dispatch,userDetails) => {
    const toastId = toast.loading("Loading...");
    try{
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res){
            toast.error("Razorpay SDK Failed TO load!")
            return;
        }

        // initiate the order
        const orderResponse = await apiconnector("POST",COURSE_PAYMENT_API,{courses: courses},{
            Authorization: `Bearer ${token}`
        });

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }

        // console.log("Order Response->",orderResponse);
        const options = {
            key:process.env.RAZORPAY_KEY,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id: orderResponse.data.data.id,
            name: "StudyNotion",
            description: "Thank You For Purchasing The Course",
            image: rzp_logo,
            prefill:{
                name: `${userDetails.firstName}`,
                email: userDetails.email,
            },
            handler: function(response){
                //verfiy payemnt
                verifyPayment({...response,courses},token,navigate,dispatch);
                sendPaymentSuccessMail(response,orderResponse.data.data.amount,token,courses);
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function (response) {
            toast.error("Payment Failed");
            console.log(response.error);
        });

    } catch(error){
        console.log(error);
        toast.error("Could Not Make Payment");
    }
    toast.dismiss(toastId);
}


export const sendPaymentSuccessMail = async(response,amount,token,courses) => {
    try{
        await apiconnector("POST",SEND_PAYMENT_VERIFICATION_MAIL,{
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            courses: courses,
            amount,
        },{
            Authorization: `Bearer ${token}`
        });
        
    } catch(e){
        console.log(e);
        toast.error("Payment Success Mail Sending Failure");
    }
}


export const verifyPayment = async(bodyData,token,navigate,dispatch) => {
    const toastId = toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true));
    try{
        // console.log("BodyData->->",bodyData);
        const response = await apiconnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization: `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        toast.success("Payment Successfull");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch(error){
        console.log(error);
        toast.error("Something went Wrong While Verfitying Payment")
    }
    dispatch(setPaymentLoading(false));
    toast.dismiss(toastId);
}

export const fetchPaymentHistoryDetails = async(setLoading,token) => {
    let result = {};
    setLoading(true);
    try{
        const response = await apiconnector("GET",FETCH_PAYMENT_HISTORY_DETAILS,null,{
            Authorization: `Bearer ${token}`
        });

        if(!response.data.success){
            throw new Error(response.data.message);
        }

        result = response?.data?.data;
    } catch(error){
        console.log(error);
        toast.error(error.response.data.message);
    }
    setLoading(false);
    return result;
}