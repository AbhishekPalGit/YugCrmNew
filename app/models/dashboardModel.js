const Sequelize = require('sequelize');
var database = require('../../config/database.js');
const constants = require('../../config/constants.js');
const Op = Sequelize.Op

exports.getSSDashboard = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query(`
            SELECT 
                cm.cartid,
                cm.cartstage,
                DATE_FORMAT(cm.createddt, '%d %M, %Y %l:%i %p') AS createddt,
                cm.createdby,
                cs.csname,
                cid.ciid,
                cid.pid,
                cid.qty,
                pm.productname,
                pm.productdesc,
                pm.brand,
                pm.hsncode,
                pm.uom,
                pm.uomprice,
                pm.CPN,
                pm.gstext
            FROM cartmaster cm
                JOIN constsitemaster cs ON cm.csid = cs.csid
                LEFT JOIN cartitemdet cid ON cm.cartid = cid.cartid AND cid.isdeleted = 0 AND cid.isactive = 1
                LEFT JOIN productmaster pm ON cid.pid = pm.pid
            WHERE cm.isactive = 1
                AND cs.csid = `+ post.siteId +`
            GROUP BY cm.cartid, cid.ciid
            ORDER BY cm.cartstage, cm.cartid
        ` , {}, {
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

exports.getPMDashboard = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query(`
            SELECT
                CASE cm.cartstage
                    WHEN 'S' THEN 'Submitted Carts'
                    WHEN 'R' THEN 'Rejected Carts'
                END AS category,
                cm.cartid,
                '' AS ordId,
                cm.csid as siteId,
                cm.cartstage AS ordStage,
                cm.cartstage,
                DATE_FORMAT(cm.createddt, '%d %M, %Y %l:%i %p') AS createddt,
                cm.createdby,
                cs.csname,
                cid.ciid,
                cid.pid,
                cid.qty,
                pm.productname,
                pm.productdesc,
                pm.brand,
                pm.hsncode,
                pm.uom,
                pm.uomprice,
                pm.CPN,
                pm.gstext
            FROM cartmaster cm
                JOIN constsitemaster cs ON cm.csid = cs.csid
                LEFT JOIN cartitemdet cid ON cm.cartid = cid.cartid AND cid.isdeleted = 0 AND cid.isactive = 1
                LEFT JOIN productmaster pm ON cid.pid = pm.pid
            WHERE cm.cartstage in ('S', 'R') AND cm.isactive = 1 AND cm.csid = `+ post.siteId +`

            UNION ALL

            SELECT 
                CASE o.ordstatus
                    WHEN 'P' THEN 'Pending Orders'
                    WHEN 'A' THEN 'Approved Orders'
                    WHEN 'R' THEN 'Rejected Orders'
                END AS category,
                o.cartid AS cartid,
                o.ordid AS ordId,
                o.csid as siteId,
                o.ordstatus AS ordStage,
                o.ordstatus AS cartstage,
                DATE_FORMAT(o.createddt, '%d %M, %Y %l:%i %p') AS createddt,
                o.createdby,
                cs.csname,
                cid.ciid AS ciid,
                pm.pid,
                cid.qty,
                pm.productname,
                pm.productdesc,
                pm.brand,
                pm.hsncode,
                pm.uom,
                pm.uomprice,
                pm.CPN,
                pm.gstext
            FROM ordermaster o
                JOIN constsitemaster cs ON o.csid = cs.csid
                LEFT JOIN cartitemdet cid ON o.cartid = cid.cartid AND cid.isdeleted = 0 AND cid.isactive = 1
                LEFT JOIN productmaster pm ON cid.pid = pm.pid
            WHERE o.isactive = 1 AND o.csid = `+ post.siteId +`
            ORDER BY category, cartid;
        ` , {}, {
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

exports.getHODashboard = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getSiteDet = await database.query(`
            SELECT GROUP_CONCAT(csid) site_ids FROM constsitemaster WHERE ccid = `+ post.companyId + ` Limit 1 
        ` , {}, {
            type: Sequelize.QueryTypes.SELECT,
        });

        let getData = await database.query(`
            SELECT 
                o.ordid AS orderId,
                o.cartid AS cartid,
                o.ordcode AS ordcode,
                o.ordid AS ordId,
                o.csid as siteId,
                o.ordstatus AS ordStage,
                DATE_FORMAT(o.createddt, '%d %M, %Y %l:%i %p') AS createddt,
                o.createdby,
                cid.ciid,
                cs.csname,
                pm.pid,
                cid.qty,
                pm.productname,
                pm.productdesc,
                pm.brand,
                pm.hsncode,
                pm.uom,
                pm.uomprice,
                pm.CPN,
                pm.gstext
            FROM ordermaster o
                JOIN constsitemaster cs ON o.csid = cs.csid
                LEFT JOIN cartitemdet cid ON o.cartid = cid.cartid AND cid.isdeleted = 0 AND cid.isactive = 1
                LEFT JOIN productmaster pm ON cid.pid = pm.pid
            WHERE o.isactive = 1 AND o.csid IN( `+ getSiteDet[0][0]['site_ids'] +`)
            ORDER BY ordStage, cartid;
        ` , {}, {
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

exports.superAdminDashboard = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query(`
            SELECT
                userM.usrid AS UserId,
                userM.fname AS FirstName,
                userM.lname AS LastName,
                userM.emailid AS emailid,
                role.rolename AS RoleName,
                role.rolecode AS RoleCode,
                cart.cartid,
                cart.cartstage AS CartStatus,
                site.csid,
                site.csname AS siteName,
                company.ccid AS companyId,
                company.ccname AS companyName,
                ord.ordid AS OrderId,
                ord.ordcode AS OrderCode,
                ord.ordstatus AS OrderStatus,
                ord.po_no AS PONumber,
                ord.po_doc_link AS POLink
            FROM
                cartmaster as cart
                INNER JOIN constsitemaster AS site ON cart.csid = site.csid
                INNER JOIN constcompmaster AS company ON site.ccid = company.ccid
                LEFT JOIN ordermaster AS ord ON cart.cartid = ord.cartid
                INNER JOIN usermaster AS userM ON ord.usrid = userM.usrid
                INNER JOIN rolemaster AS role ON userM.roleid = role.roleid
            WHERE
                cart.isactive = 1
                AND site.isactive = 1
                AND company.isactive = 1
                AND ord.isactive = 1
                AND userM.isactive = 1
                AND ord.isactive = 1;
        ` , {}, {
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