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