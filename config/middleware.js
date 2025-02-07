const aesjs = require('aes-js');
const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
const cookieKey = [ 99, 89, 79, 69, 59, 49, 39, 29, 19, 9, 109, 119, 129, 139, 149, 169 ];
const constants = require('../config/constants.js');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let tokenJSON = {
        "status": "",
        "message": ""
    };
    var reqToken = req.get('__pledge');
    console.log(reqToken,"reqTokenreqToken")
    // var reqToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsInVzZXJOYW1lIjoiU2h1a3JhbnQgUGF3YXIiLCJlbWFpbElkIjoic2h1a3JhbnRAeW9wbWFpbC5jb20iLCJpYXQiOjE3Mzc5Mzc3MjIsImV4cCI6MTczNzk0MTMyMn0.srK4OJqlFtY04J6-KBRwp54q5BiFaW2sYjoOn2tIXf8"
    if (reqToken != "" && reqToken !== undefined) {
        jwt.verify(reqToken, constants.TokenSecret, function(err, decoded) {
            if (err) {
                response = {
                    "status": "failed",
                    "message": "Unauthorized / Invalid token",
                }
                res.status(403).json(response);
            } else {
                // ================== Decode JWT ================== 
                    var dceodedToken = jwt.decode(reqToken);
                // ================== Decode JWT ================== 
                
                // ================== User Details ================== 
                    req.body.userId = dceodedToken.userId;
                    req.body.userName = dceodedToken.userName;
                    req.body.emailId = dceodedToken.emailId;
                // ================== User Details ================== 

                // ================== IpAddress ================== 
                    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                    var IpAddress = "";
                    if (ip == "::1") {
                        IpAddress = "127.1.1.1";
                    } else {
                        IpAddress = ip.split(',')[0];
                    }
                    req.body.IpAddress = IpAddress;
                // ================== IpAddress ================== 
                
                response = {
                    "status": "success",
                    "message": "Token Verified",
                }
                next();
            }
        });
    } else {
        response = {
            "status": "failed",
            "message": "Invalid Token"
        }
        res.status(403).json(response);
    }
};