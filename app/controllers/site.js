const constants = require('../../config/constants.js');
const siteModel = require('../models/siteModel.js');

exports.getSiteList = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getSiteList") {
            result.message = 'Invlaid API';
        } else {
            var siteDet = await siteModel.getSiteList(body);
            if (siteDet.status == "success") {
                if (siteDet.data.length > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : siteDet.data
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = siteDet.data;
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

exports.addSite = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "addSite") {
            result.message = 'Invlaid API';
        } else if (body.siteName == "" || body.siteName == undefined) {
            result.message = 'Provide site Name';
        } else {
            var siteDet = await siteModel.addSite(body);
            if (siteDet.status == "success") {
                if (siteDet.data > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data saved successfully',
                        'data' : siteDet.data
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = siteDet.data;
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

exports.updateSite = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "updateSite") {
            result.message = 'Invlaid API';
        } else if (body.siteName == "" || body.siteName == undefined) {
            result.message = 'Provide site Name';
        } else if (body.siteId == "" || body.siteId == undefined) {
            result.message = 'Provide site Id';
        } else {
            var siteUpdDet = await siteModel.updateSite(body);
            if (siteUpdDet.status == "success") {
                result = {
                    'status': "success",
                    'message': 'Data updated successfully',
                    'data' : siteUpdDet.data.affectedRows
                }
            } else {
                result.message = siteUpdDet.data;
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

exports.deleteSite = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "deleteSite") {
            result.message = 'Invlaid API';
        } else if (body.siteId == "" || body.siteId == undefined) {
            result.message = 'Provide Site Id';
        } else {
            var siteDltDet = await siteModel.deleteSite(body);
            if (siteDltDet.status == "success") {
                if (siteDltDet.data.affectedRows > 0) {
                    result = {
                        'status': "success",
                        'message': 'Data updated successfully',
                        'data' : siteDltDet.data.affectedRows
                    }
                } else {
                    result.message = 'Error Updating data. Try again';
                }
            } else {
                result.message = siteDltDet.data;
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
