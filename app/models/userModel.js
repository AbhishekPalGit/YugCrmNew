const Sequelize = require('sequelize');
var database = require('../../config/database');
const constants = require('../../config/constants.js');
const Op = Sequelize.Op

exports.getUserList = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT" +
                " uMaster.usrid AS usrId," +
                " uMaster.fname," +
                " uMaster.lname," +
                " uMaster.emailid AS email," +
                " uMaster.mobileno," +
                " uMaster.roleid AS roleId," +
                " role.rolename AS roleName," +
                " uMaster.ccid AS companyId," +
                " company.ccname AS companyName," +
                " siteMap.csid AS siteId," +
                " site.csname AS siteName," +
                " uMaster.isactive as userActive" +
            " FROM" +
                " usermaster AS uMaster" +
                " INNER JOIN rolemaster AS role ON uMaster.roleid = role.roleid" +
                " INNER JOIN constcompmaster AS company ON uMaster.ccid = company.ccid" +
                " INNER JOIN usersitemapping AS siteMap ON uMaster.usrid = siteMap.usrid" +
                " INNER JOIN constsitemaster AS site ON siteMap.csid = site.csid" +
            // " WHERE" +
            // " uMaster.isactive = 1" +
            " ORDER BY" +
            " uMaster.fname"
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

exports.getPMBySSUser = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT * FROM usermaster WHERE isactive = 1 AND ccid = "+post.companyId+" AND roleid = " + constants.roles['PM']['roleId'] + ";"
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

exports.getHOByPMUser = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT * FROM usermaster WHERE isactive = 1 AND ccid = "+post.companyId+" AND roleid = " + constants.roles['HO']['roleId'] + ";"
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

exports.login = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT" +
                " uMaster.usrid AS usrId," +
                " uMaster.fname," +
                " uMaster.lname," +
                " uMaster.emailid AS email," +
                " uMaster.usrpass AS password," +
                " uMaster.mobileno," +
                " uMaster.roleid AS roleId," +
                " role.rolename AS roleName," +
                " role.rolecode AS roleType," +
                " uMaster.ccid AS companyId," +
                " company.ccname AS companyName," +
                " siteMap.csid AS siteId," +
                " site.csname AS siteName," +
                " uMaster.isactive as userActive" +
            " FROM" +
                " usermaster AS uMaster" +
                " INNER JOIN rolemaster AS role ON uMaster.roleid = role.roleid" +
                " INNER JOIN constcompmaster AS company ON uMaster.ccid = company.ccid" +
                " INNER JOIN usersitemapping AS siteMap ON uMaster.usrid = siteMap.usrid" +
                " INNER JOIN constsitemaster AS site ON siteMap.csid = site.csid" +
            " WHERE" +
            " uMaster.isactive = 1" +
            " AND uMaster.emailid = '" + post.emailId + "'" +
            " Limit 1"
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

exports.addUser = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let insertUser = await database.query("INSERT INTO usermaster (fname, lname, emailid, mobileno, usrpass, roleid, ccid, isactive, createddt, createdby, createdip) VALUES ('" +
        post.fname + "','" +
        post.lname + "','" +
        post.email + "','" +
        post.mobileno + "','" +
        post.usrpass + "'," +
        post.roleId + "," +
        post.companyId + "," +
        "1" + ", '" +
        constants.currentDateTime + "', '" +
        post.emailId + "', '" +
        post.IpAddress + "');" , {}, {
            type: Sequelize.QueryTypes.SELECT,
        });

        if (insertUser[0] > 0) {
            let insertRole = await database.query("INSERT INTO usersitemapping (usrid, csid,isactive, createddt, createdby, createdip) VALUES (" +
            insertUser[0] + "," +
            post.siteId + "," +
            "1" + ",'" +
            constants.currentDateTime + "', '" +
            post.emailId + "', '" +
            post.IpAddress + "');" , {}, {
                type: Sequelize.QueryTypes.SELECT,
            });
        }

        result = {
            'status': "success",
            'data': insertUser[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.loginLogs = async function(post) {
    console.log("post=>>>>>>>>>>>>>", post);
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let insertUser = await database.query("INSERT INTO userlogins (usrid, isactive, createddt, createdby, createdip) VALUES (" +
        post.userId + "," +
        "1" + ", '" +
        constants.currentDateTime + "', '" +
        post.email + "', '" +
        post.IpAddress + "');" , {}, {
            type: Sequelize.QueryTypes.SELECT,
        });

        result = {
            'status': "success",
            'data': insertUser[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.updateUser = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        var passStr = '';
        if(post.usrpass != null) {
             passStr = "usrpass = '"+ post.usrpass +"',";
        };

        var queryStr = "UPDATE usermaster SET fname ='"+ post.fname +"', lname ='"+ post.lname +"', emailid = '"+ post.email +"', mobileno ='"+ post.mobileno +"'," + passStr + "updatedip = '"+ post.IpAddress +"', updatedby = '"+ post.emailId +"', updateddt = '"+ constants.currentDateTime +"' WHERE usrid = " + post.usrid + " AND isactive = 1"; 

        let updUser = await database.query(queryStr, {}, {
                type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': updUser[0],
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.deleteUser = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updSite = await database.query("UPDATE usermaster SET isactive = 0 WHERE usrid = " + post.usrId + " AND isactive = 1", {}, {
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