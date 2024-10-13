const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async(req, res, next) =>{
    try {
       const token = req.cookies.token
                    || req.body.token
                    || req.header("Authorisation").replace("Bearer", "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            });
        }
        // verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
            
        } catch (error) {
            return res.res(401).json({
                success: false,
                message: 'Invalid Token',
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            messsage: 'Something went wrong while validating the token',
        }); 
    }
}

// isStudent
exports.isStudent = async(req, res, next)=>{
    try {
        if(req.user.accountType != "Student"){
            return res.status(401).json({
                success: false,
                message: 'This is the protected routes for the students only',
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: 'User tole can not be verify, Please try again!',
        });
    }
}

// isInstructor
exports.isInstructor = async(req, res, next)=>{
    try {
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success: false,
                message: 'This is the protected routes for the Instructor only',
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: 'User tole can not be verify, Please try again!',
        });
    }
}

// isAdmin
exports.isAdmin = async(req, res, next)=>{
    try {
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success: false,
                message: 'This is the protected routes for the Admin only',
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: true,
            message: 'User tole can not be verify, Please try again!',
        });
    }
}


