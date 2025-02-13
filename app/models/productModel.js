const Sequelize = require('sequelize');
var database = require('../../config/database');
const constants = require('../../config/constants.js');
const Op = Sequelize.Op

exports.getProductList = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT pid, productname, productdesc, brand, hsncode, gstext, imagelink, ccid, uom, uomprice, CPN, isactive FROM productmaster"
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

exports.addProduct = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let insertSite = await database.query("INSERT INTO productmaster (productname, productdesc, brand, hsncode, gstext, imagelink, CPN, uom, uomprice, ccid, isactive, createddt, createdby, createdip) VALUES ('" +
        post.ProductName + "', '" +
        post.ProductDesc + "', '" +
        post.brand + "', '" +
        post.HsnCode + "', '" +
        post.Gst + "', '" +
        post.ImgPath + "', " +
        post.CPN + ", '" +
        post.UOM + "', " +
        post.price + ", " +
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

exports.updateProduct = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updSite = await database.query("UPDATE productmaster SET productname = '" + post.ProductName + "', productdesc = '" + post.ProductDesc + "', brand = '" + post.brand + "', hsncode = " + post.HsnCode + ", gstext = " + post.Gst + ", imagelink = '" + post.ImgPath + "', CPN = '" + post.CPN + "', uom = '" + post.UOM + "', uomprice = " + post.price + ", ccid = " + post.companyId + ", isactive = 1, updatedby = '"+ post.emailId +"', updatedip = '"+ post.IpAddress +"', updateddt = '"+ constants.currentDateTime +"' WHERE pid = " + post.pid + ";", {}, {
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

exports.deleteProduct = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updSite = await database.query("UPDATE productmaster SET isactive = 0 WHERE pid = " + post.productId + " AND isactive = 1", {}, {
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

exports.getPendingCartBySiteId = async function(siteId) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT cartid FROM cartmaster WHERE csid = " + siteId + " AND cartstage = 'P' AND isactive = 1 LIMIT 1"
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

exports.getCartByCartId = async function(cartId) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT * FROM cartmaster WHERE cartid = " + cartId + " AND isactive = 1 LIMIT 1"
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

exports.addToCart = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        if (post.cartId == 0) {
            let insertSite = await database.query("INSERT INTO cartmaster (csid, cartstage, isactive, createddt, createdby, createdip) VALUES ('" +
            post.siteId + "', '" +
            "P" + "', " +
            "1" + ", '" +
            constants.currentDateTime + "', '" +
            post.emailId + "', '" +
            post.IpAddress + "');" , {}, {
                type: Sequelize.QueryTypes.SELECT,
            });
            post.cartId = insertSite[0]
        }
        
        result = {
            'status': "success",
            'data': post.cartId
        }

        // === Add / Update Items to Items table ===
        if (post.cartId > 0) {
            let updateStage = await this.addUpdCartItems(post);
        }
        // === Add / Update Items to Items table ===

        // === Update Cart Stage ===
        if (post.action === 'submit') {
            let updateStage = await this.updCartStageByCartId(post, 'S');
        }
        // === Update Cart Stage ===
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.updCartStageByCartId = async function(post, cartStage) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updateStage = await database.query("UPDATE cartmaster SET cartstage = '" + cartStage + "', updatedby = '"+ post.emailId +"', updatedip = '"+ post.IpAddress +"', updateddt = '"+ constants.currentDateTime +"' WHERE cartid = " + post.cartId , {}, {
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        result = {
            'status': "success",
            'data': updateStage[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.removeCartItems = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let updateStage = await database.query("UPDATE cartitemdet SET isdeleted = 1, updatedby = '"+ post.emailId +"', updatedip = '"+ post.IpAddress +"', updateddt = '"+ constants.currentDateTime +"' WHERE cartid = " + post.cartId + " AND pid NOT IN (" + post.rmvPid + ")", {}, {
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        result = {
            'status': "success",
            'data': updateStage[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.addUpdCartItems = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        for (const item of post.items) {
            if (post.source == 'PM') {
                var pid = item.pid;
                var quantity = item.qty;
                var uom = item.UOM;
                var uomprice = item.Rate;
            } else {
                var { pid, quantity, uom, uomprice } = item;
            }
          await database.query(
            "INSERT INTO cartitemdet (cartid, pid, qty, uom, uomprice, isdeleted, isactive, createddt, createdby, createdip) VALUES ("+
            post.cartId + "," +
            pid + " , " + 
            quantity + " , '" + 
            uom + "' , " + 
            uomprice + " , " + 
            "0" + ", " +
            "1" + " , '" +
            constants.currentDateTime + "', '" +
            post.emailId + "', '" +
            post.IpAddress + " ') " +
            "ON DUPLICATE KEY UPDATE " +
            "isdeleted = 0 , " +
            "qty = " + quantity + ", " +
            "uom = '" + uom + "', " +
            "uomprice = " + uomprice + ", " +
            "updateddt = '" + constants.currentDateTime + "', " +
            "updatedby = '" + post.emailId + "', "+
            "updatedip = '" + post.IpAddress + "'"
          );
        } // End of for loop

        result = {
            'status': "success",
            'data': "Items Added Successfully"
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.createOrder = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let insertOrd = await database.query("INSERT INTO ordermaster (ordcode, cartid, csid, usrid, ordstatus, isactive, createddt, createdby, createdip) " +
            "SELECT " + 
            "CONCAT('ORD', LPAD(IFNULL(MAX(ordid), 0) + 1, 7, '0')) AS ordcode," +
            post.cartId + " AS cartid, " +
            post.siteId + " AS csid, " +
            post.userId + " AS usrid," +
            "'P'" + "," +
            "1" + ", '" +
            constants.currentDateTime + "', '" +
            post.emailId + "', '" +
            post.IpAddress + "'" +
            "FROM ordermaster WHERE cartid = " + post.cartId + ";" , {}, {
            type: Sequelize.QueryTypes.SELECT,
        });
        result = {
            'status': "success",
            'data': insertOrd[0]
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.updateOrder = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        var appendQuery = '';
        if (post.ordStatus == 'R') {
            appendQuery = ", po_no = " + post.poNumber + ", po_doc_link = " + post.poLink;
        } else {
            appendQuery = ", po_no = '" + post.poNumber + "', po_doc_link = '" + post.poLink + "'";
        }
        let updateOrd = await database.query("UPDATE ordermaster SET ordstatus = '" + post.ordStatus + "'" + appendQuery +", updatedby = '"+ post.emailId +"', updatedip = '"+ post.IpAddress +"', updateddt = '"+ constants.currentDateTime +"' WHERE ordid = " + post.orderId , {}, {
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        result = {
            'status': "success",
            'data': `Order ${post.ordStatus == 'R' ? 'Rejected' : 'Approved'} successfully`
        }
    } catch (error) {
        result.data = error;
    }
    return result;
}

exports.getCartDetail = async function(post) {
    var result = {
        'status': "failed",
        'data': "Something went wrong. Please try again later"
    }
    try {
        let getData = await database.query("SELECT " + 
                "p.pid," + 
                "p.productname," + 
                "p.productdesc," + 
                "p.brand," + 
                "p.hsncode," + 
                "p.gstext," + 
                "p.imagelink," + 
                "p.uom," + 
                "p.uomprice," + 
                "p.CPN," + 
                "ci.cartid," + 
                "COALESCE(ci.quantity, 0) AS quantity " + 
                "FROM " + 
                    "productmaster p " + 
                "LEFT JOIN ( " + 
                    "SELECT " + 
                        "c.cartid, " + 
                        "cid.pid, " + 
                        "cid.qty AS quantity " + 
                    "FROM " + 
                        "cartmaster c " + 
                    "INNER JOIN " + 
                        "cartitemdet cid ON c.cartid = cid.cartid " + 
                    "WHERE " + 
                        "c.csid = "+post.siteId+" AND c.cartstage = 'P' AND c.isactive = 1 AND cid.isdeleted = 0 " + 
                    "GROUP BY " + 
                        "c.cartid, cid.pid" + 
                ") AS ci ON p.pid = ci.pid " + 
                "WHERE " + 
                    "p.ccid = ( " +
                        "SELECT ccid FROM constsitemaster WHERE csid = "+ post.siteId +
                    ") " +
                "AND p.isactive = 1" , {}, {
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