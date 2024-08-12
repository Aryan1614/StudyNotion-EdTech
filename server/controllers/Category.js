const Category = require("../models/Category");
const { populate } = require("../models/Course");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

exports.createCategory = async(req,res) => {
    try{

        const { name, description } = req.body;

        if(!name || !description){
            return res.status(401).json({
                success: false,
                message: "All Details Required!",
            });
        }

        const checkCatgory = await Category.findOne({name: name});

        if(checkCatgory) {
            return res.status(401).json({
                success: false,
                message: "Category Already Present!",
            });
        }

        const CategoryDetails = await Category.create({
            name:name,
            description: description,
        });

        // console.log(CategoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category succesfully Created!",
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While Creating Tag",
        });
    }
}

exports.showAllCategories = async(req,res) => {
    try{

        const allCategory = await Category.find({},{name:true,description:true});

        return res.status(200).json({
            success: true,
            message: "All Category Fetched Successfully!",
            allCategory,
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While Fetching All tags",
        });
    }
}

exports.getAllCatagoryDetails = async(req,res) => {
    try{
        const { catagoryId } = req.body;
        if(!catagoryId){
            return res.status(404).json({
                success: false,
                message: "Category Id Not Found!",
            });
        }

        const selectedCategory = await Category.findById(catagoryId).populate({
            path:"courses",
            match: {status: "Published"},
            populate:{
                path:"ratingAndReviews"
            },
            populate:{
                path: "instructor"
            }
        }).exec();

        if(!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category Not Found!"
            });
        }

        if(selectedCategory.courses.length === 0){
            return res.status(404).json({
                success: false,
                message: "Courses Not Found For the Selected Catagory",
            });
        }

        const catagoryExceptSelected = await Category.find(
            {
                _id : { $ne: catagoryId }
            }
        );

        const differentCategory = await Category.findById(
            catagoryExceptSelected[getRandomInt(catagoryExceptSelected.length)]._id
        ).populate({
            path:"courses",
            match: {status: "Published"},
            populate:{
                path:"ratingAndReviews"
            },
            populate:{
                path: "instructor"
            }
        }).exec();

        const allCategories = await Category.find().populate({
            path:"courses",
            match: {status: "Published"},
            populate:{
                path:"ratingAndReviews"
            },
            populate:{
                path:"instructor",
            },
        }).exec();

        const allCourses = allCategories.flatMap((category) => category.courses);
        const mostSellingCourse = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10);
        
        return res.status(200).json({
            success: true,
            message: "Category Data Fetched Successfully!",
            selectedCategory,
            differentCategory,
            mostSellingCourse
        });

    } catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong While Fetching Category Details!",
        });
    }
}