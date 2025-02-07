const constants = require('../../config/constants.js');
const dashboardModel = require('../models/dashboardModel.js');
const userModel = require('../models/userModel.js');

exports.getSSDashboard = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getSSDashboard") {
            result.message = 'Invlaid API';
        } else {
            var users = await userModel.login(body);
            body.roleId = users.data[0]['roleId'];
            body.companyId = users.data[0]['companyId'];
            body.siteId = users.data[0]['siteId'];

            var dashDet = await dashboardModel.getSSDashboard(body);
            if (dashDet.status == "success") {
                if (dashDet.data.length > 0) {
                    const cartMap = new Map();
                    dashDet.data.forEach((row) => {
                      if (!cartMap.has(row.cartid)) {
                        cartMap.set(row.cartid, {
                          cartid: row.cartid,
                          cartstage: row.cartstage,
                          createddt: row.createddt,
                          createdby: row.createdby,
                          csname: row.csname,
                          items: [],
                        });
                      }

                      if (row.ciid) {
                        cartMap.get(row.cartid).items.push({
                          // cartItemId : row.ciid,
                          // pid: row.pid,
                          'Item Name': row.productname,
                          'Item Description': row.productdesc,
                          'Brand': row.brand,
                          'HSN Code': row.hsncode,
                          'Quantity': row.qty,
                          'Rate': row.uomprice,
                          // 'Amount (QtyXRate)': parseInt(row.uomprice) * parseInt(row.qty),
                          'UOM': row.uom,
                        });
                      }
                    });

                    const summary = {
                      pending: 0,
                      submitted: 0,
                      rejected: 0,
                      approved: 0,
                    };

                    // Separate Detailed Data by Cart Stage
                    const detailed = {
                      pending: [],
                      submitted: [],
                      rejected: [],
                      approved: [],
                    };

                    cartMap.forEach((cart) => {
                      if (cart.cartstage === "P") {
                        summary.pending += 1;
                        detailed.pending.push(cart);
                      } else if (cart.cartstage === "S") {
                        summary.submitted += 1;
                        detailed.submitted.push(cart);
                      } else if (cart.cartstage === "R") {
                        summary.rejected += 1;
                        detailed.rejected.push(cart);
                      } else if (cart.cartstage === "A") {
                        summary.approved += 1;
                        detailed.approved.push(cart);
                      }
                    });
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : {summary, detailed}
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = dashDet.data;
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

exports.getPMDashboard = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getPMDashboard") {
            result.message = 'Invlaid API';
        } else {
            var users = await userModel.login(body);
            body.roleId = users.data[0]['roleId'];
            body.companyId = users.data[0]['companyId'];
            body.siteId = users.data[0]['siteId'];

            var dashDet = await dashboardModel.getPMDashboard(body);
            if (dashDet.status == "success") {
                if (dashDet.data.length > 0) {
                    const cartMap = new Map();
                    dashDet.data.forEach((row) => {
                      if (!cartMap.has(row.cartid)) {
                        cartMap.set(row.cartid, {
                          cartid: row.cartid,
                          cartstage: row.cartstage,
                          category: row.category,
                          createddt: row.createddt,
                          createdby: row.createdby,
                          csname: row.csname,
                          items: [],
                        });
                      }

                      if (row.ciid) {
                        cartMap.get(row.cartid).items.push({
                            // cartItemId : row.ciid,
                            // pid: row.pid,
                            'Item Name': row.productname,
                            'Item Description': row.productdesc,
                            'Brand': row.brand,
                            'HSN Code': row.hsncode,
                            'qty': row.qty,
                            'Rate': row.uomprice,
                            // 'Amount (QtyXRate)': parseInt(row.uomprice) * parseInt(row.qty),
                            'UOM': row.uom,
                        });
                      }
                    });


                    const summary = {
                      rejected_carts: 0,
                      pending_tasks: 0,
                      pending_orders: 0,
                      approved_orders: 0,
                      rejected_orders: 0,
                    };

                    const detailed = {
                      rejected_carts: [],
                      pending_tasks: [],
                      pending_orders: [],
                      approved_orders: [],
                      rejected_orders: [],
                    };

                    cartMap.forEach((row) => {
                      switch (row.category) {
                        case 'Rejected Carts':
                          summary.rejected_carts += 1;
                          detailed.rejected_carts.push(row);
                          break;
                        case 'Submitted Carts':
                          summary.pending_tasks += 1;
                          detailed.pending_tasks.push(row);
                          break;
                        case 'Pending Orders':
                          summary.pending_orders += 1;
                          detailed.pending_orders.push(row);
                          break;
                        case 'Approved Orders':
                          summary.approved_orders += 1;
                          detailed.approved_orders.push(row);
                          break;
                        case 'Rejected Orders':
                          summary.rejected_orders += 1;
                          detailed.rejected_orders.push(row);
                          break;
                      }
                    });
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : {summary, detailed}
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = dashDet.data;
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

exports.getHODashboard = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getHODashboard") {
            result.message = 'Invlaid API';
        } else {
            var users = await userModel.login(body);
            body.roleId = users.data[0]['roleId'];
            body.companyId = users.data[0]['companyId'];
            body.siteId = users.data[0]['siteId'];

            var dashDet = await dashboardModel.getHODashboard(body);
            if (dashDet.status == "success") {
                if (dashDet.data.length > 0) {
                    const cartMap = new Map();
                    dashDet.data.forEach((row) => {
                      if (!cartMap.has(row.cartid)) {
                        cartMap.set(row.cartid, {
                          cartid: row.cartid,
                          orderId: row.orderId,
                          orderCode: row.ordcode,
                          orderStage: row.ordStage,
                          createddt: row.createddt,
                          createdby: row.createdby,
                          csname: row.csname,
                          items: [],
                        });
                      }

                      if (row.ciid) {
                        cartMap.get(row.cartid).items.push({
                            // cartItemId : row.ciid,
                            // pid: row.pid,
                            'Item Name': row.productname,
                            'Item Description': row.productdesc,
                            'Brand': row.brand,
                            'HSN Code': row.hsncode,
                            'Quantity': row.qty,
                            'Rate': row.uomprice,
                            // 'Amount (QtyXRate)': parseInt(row.uomprice) * parseInt(row.qty),
                            'UOM': row.uom,
                        });
                      }
                    });


                    const summary = {
                      pending: 0,
                      rejected: 0,
                      approved: 0,
                    };

                    // Separate Detailed Data by Cart Stage
                    const detailed = {
                      pending: [],
                      rejected: [],
                      approved: [],
                    };

                    console.log("cartMap", cartMap);
                     cartMap.forEach((cart) => {
                      if (cart.orderStage === "P") {
                        summary.pending += 1;
                        detailed.pending.push(cart);
                      } else if (cart.orderStage === "R") {
                        summary.rejected += 1;
                        detailed.rejected.push(cart);
                      } else if (cart.orderStage === "A") {
                        summary.approved += 1;
                        detailed.approved.push(cart);
                      }
                    });
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : {summary, detailed}
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = dashDet.data;
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