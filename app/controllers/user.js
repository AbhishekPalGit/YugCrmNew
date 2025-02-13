const constants = require('../../config/constants.js');
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 5;

async function hashPassword(plainTextPassword) {
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        return error;
    }
}

async function verifyPassword(plainTextPassword, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (isMatch) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

exports.getUserList = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getUserList") {
            result.message = 'Invlaid API';
        } else {
            var users = await userModel.getUserList(body);
            const userMap = {};
            if (users.status == "success") {
                if (users.data.length > 0) {
                    users.data.forEach(user => {
                        if (!userMap[user.usrId]) {
                            userMap[user.usrId] = {
                                "usrId": user.usrId,
                                "name": user.fname + ' ' + user.lname,
                                "email": user.email,
                                "mobileno": user.mobileno,
                                // "roleId": user.roleId,
                                "roleName": user.roleName,
                                // "companyId": user.companyId,
                                "companyName": user.companyName,
                                "userActive": user.userActive,
                                "sites": []
                            };
                        }
                        userMap[user.usrId].sites.push({
                            siteId: user.siteId,
                            siteName: user.siteName
                        });
                    });

                    var userDet = Object.values(userMap);
                    userDet.sort((a, b) => a.name.localeCompare(b.name));
                    userDet.forEach(user => {
                        user.SiteName = user.sites.map(site => site.siteName).join(", ");
                        delete user.sites;
                    });
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : userDet
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = userDet.data;
            }
        }
        res.status(200).json(result);
    } catch (err) {
        result = {
            "status": "failed",
            "message": err,
            "data": "",
        }
        res.status(200).json(result);
    }
}

exports.login = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "login") {
            result.message = 'Invlaid API';
        } else if (body.emailId == "" || body.emailId == undefined) {
            result.message = 'Please provide emailId';
        } else if (body.password == "" || body.password == undefined) {
            result.message = 'Please provide Password';
        } else {
            var headerVal = {};
            var users = await userModel.login(body);
            if (users.status == "success") {
                if (users.data.length > 0) {
                    const isValid = await verifyPassword(body.password, users.data[0]['password']);
                    if (isValid) {
                        headerVal = {
                          "userId": users.data[0]['usrId'],
                          "userName": users.data[0]['fname'] + ' ' + users.data[0]['lname'],
                          "emailId": users.data[0]['email'],
                        }
                        var postDet = {
                            'userId' : users.data[0]['usrId'],
                            'email' : users.data[0]['email'],
                            'IpAddress' : body.IpAddress,
                        }
                            console.log("postDet", body);
                        const loginLog  = await userModel.loginLogs(postDet);
                        result = {
                            'status': "success",
                            'message': 'LoggedIn Successfully',
                            'data' : {
                                "fname": users.data[0]['fname'],
                                "lname": users.data[0]['lname'],
                                "email": users.data[0]['email'],
                                "mobileno": users.data[0]['mobileno'],
                                "roleName": users.data[0]['roleName'],
                                "roleType": users.data[0]['roleType'],
                                "companyName": users.data[0]['companyName'],
                                "siteName": users.data[0]['siteName']
                            }
                        }
                    } else {
                        result.message = 'Wrong Password';
                    }
                } else {
                    result.message = 'User not found';
                }
            } else {
                result.message = users.data;
            }
        }
        const token = jwt.sign(headerVal, constants.TokenSecret, {
            expiresIn: '1h'
        });
        res.set('__pledge', token);
        res.set('Access-Control-Expose-Headers', '__pledge');
        // res.cookie('__pledge', token, {
        //     maxAge: 60 * 60 * 1000,
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'Strict',
        // });
        res.status(200).json(result);
    } catch (err) {
        result = {
            "status": "failed",
            "message": err,
            "data": "",
        }
        res.status(200).json(result);
    }
}

exports.addUser = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "addUser") {
            result.message = 'Invlaid API';
        } else if (body.name == "" || body.name == undefined){
            result.message = "Provide first name";
        } else if (body.email == "" || body.email == undefined){
            result.message = "Provide email Id";
        } else if (body.mobileno == "" || body.mobileno == undefined){
            result.message = "Provide mobile number";
        } else if (body.usrpass == "" || body.usrpass == undefined){
            result.message = "Provide password";
        } else if (body.roleId == "" || body.roleId == undefined){
            result.message = "Provide role Id";
        } else if (body.companyId == "" || body.companyId == undefined){
            result.message = "Provide company Id";
        } else if (body.siteId == "" || body.siteId == undefined){
            result.message = "Provide site Id";
        } else {
            const hashedPassword = await hashPassword(body.usrpass);
            body.usrpass = hashedPassword;
            const [first, ...remaining] = body.name.split(" ");
            const second = remaining.join(" ");
            body.fname = first;
            body.lname = second;
            delete body.name;
            var userDet = await userModel.addUser(body);
            if (userDet.status == "success") {
                if (userDet.data > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data saved successfully',
                        'data' : userDet.data
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = userDet.data;
            }
        }
        res.status(200).json(result);
    } catch (err) {
        result = {
            "status": "failed",
            "message": err,
            "data": "",
        }
        res.status(200).json(result);
    }
}

exports.updateUser = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "updateUser") {
            result.message = 'Invlaid API';
        } else if (body.name == "" || body.name == undefined){
            result.message = "Provide first name";
        } else if (body.email == "" || body.email == undefined){
            result.message = "Provide email Id";
        } else if (body.mobileno == "" || body.mobileno == undefined){
            result.message = "Provide mobile number";
        } else if (body.roleId == "" || body.roleId == undefined){
            result.message = "Provide role Id";
        } else if (body.usrId == "" || body.usrId == undefined){
            result.message = "Provide user Id";
        } else {

            if (body.usrpass != "" || body.usrpass != undefined || body.usrpass != null) {
                const hashedPassword = await hashPassword(body.usrpass);
                body.usrpass = hashedPassword;
            } else {
                body.usrpass = null;
            }

            const [first, ...remaining] = body.name.split(" ");
            const second = remaining.join(" ");
            body.fname = first;
            body.lname = second;
            delete body.name;

            var userUpdDet = await userModel.updateUser(body);
            if (userUpdDet.status == "success") {
                if (userUpdDet.data.affectedRows > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data updated successfully',
                        'data' : userUpdDet.data.affectedRows
                    }
                } else {
                    result.message = 'Error Updating data. Try again';
                }
            } else {
                result.message = userUpdDet.data;
            }
        }
        res.status(200).json(result);
    } catch (err) {
        result = {
            "status": "failed",
            "message": err,
            "data": "",
        }
        res.status(200).json(result);
    }
}

exports.deleteUser = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        console.log("body=>>>>>>>>>>", body);
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "deleteUser") {
            result.message = 'Invlaid API';
        } else if (body.usrId == "" || body.usrId == undefined) {
            result.message = 'Provide user Id';
        } else {
            var userDltDet = await userModel.deleteUser(body);
            if (userDltDet.status == "success") {
                if (userDltDet.data.affectedRows > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data updated successfully',
                        'data' : userDltDet.data.affectedRows
                    }
                } else {
                    result.message = 'Error Updating data. Try again';
                }
            } else {
                result.message = userDltDet.data;
            }
        }
        res.status(200).json(result);
    } catch (err) {
        result = {
            "status": "failed",
            "message": err,
            "data": "",
        }
        res.status(200).json(result);
    }
}
