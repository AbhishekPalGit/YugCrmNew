const Sequelize = require('sequelize');
var database = require('../../config/database');
const constants = require('../../config/constants.js');
const Op = Sequelize.Op

exports.getSiteList = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT a.csid as siteId, a.csname as siteName, b.ccname as companyName, a.isactive FROM constsitemaster as a INNER JOIN constcompmaster as b ON a.ccid = b.ccid ", {}, {
            type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': getData[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.addSite = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let insertSite = await database.query("INSERT INTO constsitemaster (csname, ccid, isactive, createddt, createdby, createdip) VALUES ('" +
        post.siteName + "', " +
        post.companyId + ", " +
        "1" + ", '" +
        constants.currentDateTime + "', '" +
        post.emailId + "', '" +
        post.IpAddress + "');" , {}, {
            type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': insertSite[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.updateSite = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updSite = await database.query("UPDATE constsitemaster SET csname = '"+ post.siteName +"', ccid = "+ post.companyId +", updatedby = '"+ post.emailId +"', updatedip = '"+ post.IpAddress +"', updateddt = '"+ constants.currentDateTime +"' WHERE csid = " + post.siteId + " AND isactive = 1", {}, {
                type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': updSite[0],
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.deleteSite = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updSite = await database.query("UPDATE constsitemaster SET isactive = 0 WHERE csid = " + post.siteId + " AND isactive = 1", {}, {
                type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': updSite[0],
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}