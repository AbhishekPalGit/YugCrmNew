const constants = require('../../config/constants.js');
const compnayModel = require('../models/compnayModel.js');

exports.getCompanyList = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getCompanyList") {
            result.message = 'Invlaid API';
        } else {
            var companyDet = await compnayModel.getCompanyList(body);
            if (companyDet.status == "success") {
                if (companyDet.data.length > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : companyDet.data
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = companyDet.data;
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

exports.addCompany = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "addCompany") {
            result.message = 'Invlaid API';
        } else if (body.companyName == "" || body.companyName == undefined) {
            result.message = 'Provide Company Name';
        } else {
            var companyDet = await compnayModel.addCompany(body);
            if (companyDet.status == "success") {
                if (companyDet.data > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data saved successfully',
                        'data' : companyDet.data
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = companyDet.data;
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

exports.updateCompany = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "updateCompany") {
            result.message = 'Invlaid API';
        } else if (body.companyName == "" || body.companyName == undefined) {
            result.message = 'Provide Company Name';
        } else if (body.companyId == "" || body.companyId == undefined) {
            result.message = 'Provide Company Id';
        } else {
            var companyUpdDet = await compnayModel.updateCompany(body);
            if (companyUpdDet.status == "success") {
                result = {
                    'status': "success",
                    'message': 'Data updated successfully',
                    'data' : companyUpdDet.data.affectedRows
                }
            } else {
                result.message = companyUpdDet.data;
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

exports.deleteCompany = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "deleteCompany") {
            result.message = 'Invlaid API';
        } else if (body.companyId == "" || body.companyId == undefined) {
            result.message = 'Provide Company Id';
        } else {
            var companyDltDet = await compnayModel.deleteCompany(body);
            if (companyDltDet.status == "success") {
                if (companyDltDet.data.affectedRows > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data updated successfully',
                        'data' : companyDltDet.data.affectedRows
                    }
                } else {
                    result.message = 'Error Updating data. Try again';
                }
            } else {
                result.message = companyDltDet.data;
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
