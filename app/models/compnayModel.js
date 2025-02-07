const Sequelize = require('sequelize');
var database = require('../../config/database');
const constants = require('../../config/constants.js');
const Op = Sequelize.Op

exports.getCompanyList = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT ccid, ccname, isactive FROM constcompmaster"
            , {}, {
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

exports.addCompany = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let insertCompany = await database.query("INSERT INTO constcompmaster (ccname, isactive, createddt, createdby, createdip) VALUES ('" +
        post.companyName + "', " +
        "1" + ", '" +
        constants.currentDateTime + "', '" +
        post.emailId + "', '" +
        post.IpAddress + "');" , {}, {
            type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': insertCompany[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.updateCompany = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updCompany = await database.query("UPDATE constcompmaster SET ccname = '"+ post.companyName +"', updatedby = '"+ post.emailId +"', updatedip = '"+ post.IpAddress +"', updateddt = '"+ constants.currentDateTime +"' WHERE ccid = " + post.companyId + " AND isactive = 1", {}, {
                type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': updCompany[0],
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.deleteCompany = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updCompany = await database.query("UPDATE constcompmaster SET isactive = 0 WHERE ccid = " + post.companyId + " AND isactive = 1", {}, {
                type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': updCompany[0],
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}