const constants = require('../../config/constants.js');
const database = require('../../config/database');
const productModel = require('../models/productModel.js');
const userModel = require('../models/userModel.js');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

async function getRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

exports.getProductList = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getProductList") {
            result.message = 'Invlaid API';
        } else {
            var siteDet = await productModel.getProductList(body);
            if (siteDet.status == "success") {
                if (siteDet.data.length > 0) {
                    siteDet.data.map((data)=>{
                        data.image = `${req.protocol}://${req.get('host')}/products/${data.imagelink}`;
                        delete data.imagelink
                    })
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

exports.addProduct = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "addProduct") {
            result.message = 'Invlaid API';
        } else if (body.ProductName == "" || body.ProductName ==  undefined) {
            result.message = 'Provide product name';
        } else if (body.ProductDesc == "" || body.ProductDesc ==  undefined) {
            result.message = 'Provide product description';
        } else if (body.brand == "" || body.brand ==  undefined) {
            result.message = 'Provide brand';
        } else if (body.HsnCode == "" || body.HsnCode ==  undefined) {
            result.message = 'Provide HSN Code';
        } else if (body.Gst == "" || body.Gst ==  undefined) {
            result.message = 'Provide GST rate';
        } else if (body.companyId == "" || body.companyId ==  undefined) {
            result.message = 'Provide company Id';
        } else if (body.CPN == "" || body.CPN ==  undefined) {
            result.message = 'Provide CPN';
        } else if (body.UOM == "" || body.UOM ==  undefined) {
            result.message = 'Provide CPN';
        } else if (body.price == "" || body.price ==  undefined) {
            result.message = 'Provide CPN';
        } else {
            if (body.Img == "" || body.Img == undefined) {
                body.ImgPath = 'defaultImg.png';
                var productDet = await productModel.addProduct(body);
                if (productDet.status == "success") {
                    if (productDet.data > 0) {
                        result = {
                            'status': "success",
                            'message': 'Data saved successfully',
                            'data' : productDet.data
                        }
                    } else {
                        result.message = 'Error saving data';
                    }
                } else {
                    result.message = productDet.data;
                }
            } else {
                var matches = body.Img.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
                response = {};
                if (matches.length !== 3) {
                    result = {
                        "status": "failed",
                        "message": "Invalid profile Image",
                        "data": "",
                    }
                } else {
                    response.type = matches[1];
                    response.data = new Buffer(matches[2], 'base64');
                    let decodedImg = response;
                    let imageBuffer = decodedImg.data;
                    let type = decodedImg.type;
                    let extension = type.split('/').pop();
                    var allowedExt = ['jpeg', 'jpg', 'JPEG', 'JPG', 'png', 'PNG'];
                    if (allowedExt.includes(extension)) {
                        var randomImgName = await getRandomString(10);
                        let fileName = body.HsnCode + "_" + randomImgName + "." + extension;
                        try {
                            const UPLOAD_DIR = path.resolve(__dirname, "../../public/products");
                            const filePath = path.join(UPLOAD_DIR, `${fileName}`);
                            fs.writeFile(filePath, imageBuffer, "base64", (err) =>{});
                            body.ImgPath = fileName;
                            var productDet = await productModel.addProduct(body);
                            if (productDet.status == "success") {
                                if (productDet.data > 0) {
                                    result = {
                                        'status': "success",
                                        'message': 'Data saved successfully',
                                        'data' : productDet.data
                                    }
                                } else {
                                    result.message = 'Error saving data';
                                }
                            } else {
                                result.message = productDet.data;
                            }
                        } catch (e) {
                            result = {
                                "status": "failed",
                                "message": e,
                                "data": "",
                            }
                        }
                    } else {
                        result = {
                            "status": "failed",
                            "message": "Image extension is not valid",
                            "data": "",
                        }
                    }
                }
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

exports.addBulkProduct = async (req, res) => {
    try {
        const { fileData, fileName, companyId } = req.body;
        console.log(fileData,"fileName",fileName)
        if (!fileData || !fileName) {
            return res.status(400).json({ message: 'File data or filename is missing' });
        }

        // Convert Base64 to Buffer
        const buffer = Buffer.from(fileData, 'base64');

        // Save buffer to a temporary Excel file
        const tempFilePath = `uploads/excel/product_${fileName}`;
        fs.writeFileSync(tempFilePath, buffer);

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(tempFilePath);
        const worksheet = workbook.worksheets[0];

        const products = [];
        // Extract images from Excel
        const imageMap = new Map();
        workbook.model.media.forEach((media, index) => {
            if (media.type === 'image') {
                const imageName = `${Date.now()}-${index+2}.${media.extension}`;
                const UPLOAD_DIR = path.resolve(__dirname, "../../public/products");
                const filePath = path.join(UPLOAD_DIR, imageName);
                fs.writeFile(filePath, media.buffer, "base64", (err) =>{});
                imageMap.set(index+2, `${imageName}`);
            }
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                const imageName = imageMap.get(rowNumber) || null;
                const productData = {
                    'productname' : row.getCell(1).value,
                    'productdesc' : row.getCell(2).value,
                    'brand' : row.getCell(3).value,
                    'hsncode' : row.getCell(4).value,
                    'gstext' : row.getCell(5).value,
                    'uom' : row.getCell(6).value,
                    'uomprice' : parseFloat(row.getCell(7).value),
                    'CPN' : row.getCell(8).value,
                    'imagelink' : imageName ? `${imageName}` : null,
                    'companyId' : companyId,
                    'isactive' : 1, //isactive
                    'createddt' : constants.currentDateTime,
                    'createdby' : req.body.emailId,
                    'createdip' : req.body.IpAddress
                };
                products.push(productData);
            }
        });

        var productDet = await productModel.addBulkProduct(products);
        if (productDet.status == "success") {
            res.status(200).json({ "status": "success", message: 'File processed successfully', insertedRows: productDet.data });
        } else {
            return res.status(500).json({ message: productDet.data});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ "status": "failed", message: 'Error processing file', error: error.message });
    }
}

exports.updateProduct = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "updateProduct") {
            result.message = 'Invlaid API';
        } else if (body.pid == "" || body.pid ==  undefined) {
            result.message = 'Provide Product Id';
        } else if (body.ProductName == "" || body.ProductName ==  undefined) {
            result.message = 'Provide Product Name';
        } else if (body.ProductDesc == "" || body.ProductDesc ==  undefined) {
            result.message = 'Provide Product Description';
        } else if (body.brand == "" || body.brand ==  undefined) {
            result.message = 'Provide Brand';
        } else if (body.HsnCode == "" || body.HsnCode ==  undefined) {
            result.message = 'Provide HSN Code';
        } else if (body.Gst == "" || body.Gst ==  undefined) {
            result.message = 'Provide GST rate';
        } else if (body.companyId == "" || body.companyId ==  undefined) {
            result.message = 'Provide company Id';
        } else if (body.CPN == "" || body.CPN ==  undefined) {
            result.message = 'Provide CPN';
        } else if (body.UOM == "" || body.UOM ==  undefined) {
            result.message = 'Provide CPN';
        } else if (body.price == "" || body.price ==  undefined) {
            result.message = 'Provide CPN';
        } else {
            if (body.Img == "" || body.Img == undefined) {
                body.ImgPath = 'defaultImg.png';
                var productDet = await productModel.updateProduct(body);
                if (productDet.status == "success") {
                    result = {
                        'status': "success",
                        'message': 'Data saved successfully',
                        'data' : productDet.data
                    }
                } else {
                    result.message = productDet.data;
                }
            } else {
                var matches = body.Img.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
                response = {};
                if (matches.length !== 3) {
                    result = {
                        "status": "failed",
                        "message": "Invalid profile Image",
                        "data": "",
                    }
                } else {
                    response.type = matches[1];
                    response.data = new Buffer(matches[2], 'base64');
                    let decodedImg = response;
                    let imageBuffer = decodedImg.data;
                    let type = decodedImg.type;
                    let extension = type.split('/').pop();
                    var allowedExt = ['jpeg', 'jpg', 'JPEG', 'JPG', 'png', 'PNG'];
                    if (allowedExt.includes(extension)) {
                        var randomImgName = await getRandomString(10);
                        let fileName = body.HsnCode + "_" + randomImgName + "." + extension;
                        try {
                            const UPLOAD_DIR = path.resolve(__dirname, "../../public/products");
                            const filePath = path.join(UPLOAD_DIR, `${fileName}`);
                            fs.writeFile(filePath, imageBuffer, "base64", (err) =>{});
                            body.ImgPath = fileName;
                            var productDet = await productModel.updateProduct(body);
                            if (productDet.status == "success") {
                                result = {
                                    'status': "success",
                                    'message': 'Data updated successfully'
                                }
                            } else {
                                result.message = productDet.data;
                            }
                        } catch (e) {
                            result = {
                                "status": "failed",
                                "message": e,
                                "data": "",
                            }
                        }
                    } else {
                        result = {
                            "status": "failed",
                            "message": "Image extension is not valid",
                            "data": "",
                        }
                    }
                }
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

exports.deleteProduct = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "deleteProduct") {
            result.message = 'Invlaid API';
        } else if (body.productId == "" || body.productId == undefined) {
            result.message = 'Provide Product Id';
        } else {
            var siteDltDet = await productModel.deleteProduct(body);
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

exports.addUpdateCart = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "addUpdateCart") {
            result.message = 'Invlaid API';
        } else if (body.action == "" || body.action == undefined || !['submit', 'save'].includes(body.action)) {
            result.message = 'Provide valid action';
        } else if (body.items == "" || body.items == undefined) {
            result.message = 'Provide Item deatils';
        } else {
            var users = await userModel.login(body);
            body.roleId = users.data[0]['roleId'];
            body.companyId = users.data[0]['companyId'];
            body.siteId = users.data[0]['siteId'];
            var getPendingCart = await productModel.getPendingCartBySiteId(body.siteId);
            body.cartId = 0;
            if (getPendingCart.status == "success") {
                if (getPendingCart.data.length > 0) {
                    // Existing cart found, use its cartid
                    body.cartId = getPendingCart.data[0].cartid;
                }

                var addToCart = await productModel.addToCart(body);
                if (addToCart.status == "success") {
                    body.cartId = addToCart.data;
                    // send email starts
                    if (body.action == 'submit') {
                        var getPMlist = await userModel.getPMBySSUser(body);
                        if (getPMlist.status == 'success' && getPMlist.data.length > 0) {
                            getPMlist.data.forEach(async (userDet) => {
                                const to_emailid = userDet['emailid'];
                                const subject = 'New Cart Submitted for Approval #CRT00' + body.cartId;
                                var mailData = {
                                    'pmName': userDet['fname'] + ' ' + userDet['lname'],
                                    'cartId': body.cartId,
                                    'ssName': users.data[0]['fname'] + ' ' + users.data[0]['lname'],
                                    'submissionDate': constants.currentDateTime,
                                    'itemCount': body.items.length,
                                    'cartLink': req.headers.host + '/cart?number=' + body.cartId
                                };
                                const htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cart Approval Request</title><style>body{font-family:Arial,sans-serif;background-color:#f8f8f8;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,.1)}.header{text-align: center;background-color: #007bff;color: #ffffff;padding: 10px 0;border-radius: 8px 8px 0 0;}.header h2{margin: 0;font-size: 20px;}.content{font-size:16px;color:#555}.button{display:inline-block;padding:10px 20px;margin-top:20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px}.button:hover{background-color:#0056b3}.footer{font-size:12px;color:#888;text-align:center;margin-top:20px}table{width:100%;margin-top:20px;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd;text-align:left}th{background-color:#f0f0f0}</style></head><body><div class="container"><div class="header"><h2>New Cart Submitted for Approval</h2></div><div class="content"><p>Dear '+mailData['pmName']+',</p><p>The Site Supervisor has created a new cart and submitted it for your approval. Please review the cart details and approve or reject it at your earliest convenience.</p><p><strong>Cart Information:</strong></p><table><tr><th>Cart ID</th><td>#CRT00'+mailData['cartId']+'</td></tr><tr><th>Submitted by</th><td>'+mailData['ssName']+' (Site Supervisor)</td></tr><tr><th>Submission Date</th><td>'+mailData['submissionDate']+'</td></tr><tr><th>Item Count</th><td>'+mailData['itemCount']+'</td></tr></table><p>To review the cart and proceed with approval or rejection, click the link below:</p><div style="text-align: center;"><a href="https://chachret.com/dashboard" class="button center">Go to Cart</a></div></div><div class="footer"><p>This is an automated message. Please do not reply to this email.</p></div></div></body></html>';
                                await sendZeptoEmail(to_emailid, subject, htmlContent);
                                // '+mailData['cartLink']+'
                            });
                        }
                    }
                    //send email ends
                    result = {
                        "status": "success",
                        "message": `Cart ${body.action === 'submit' ? 'submitted' : 'saved'} successfully`
                    }
                } else {
                    result = {
                        "status": "failed",
                        "message": addToCart.data,
                        "data": "",
                    }
                }
            } else {
                result.message = "Something went wrong, Please try again";
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

exports.approveCart = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "approveCart") {
            result.message = 'Invlaid API';
        } else if (body.action == "" || body.action == undefined || !['approve', 'reject'].includes(body.action)) {
            result.message = 'Provide valid action';
        } else if (body.cartId == "" || body.cartId == undefined) {
            result.message = 'Provide Cart Id';
        } else if (body.items == "" || body.items == undefined || !Array.isArray(body.items) || body.items.length == 0) {
            result.message = 'Provide Item deatils';
        } else {
            if (body.action == 'reject') {
                var updCart = await productModel.updCartStageByCartId(body, 'R');
                result = {
                    'status': "success",
                    'message': 'Cart rejected successfully',
                    'data' : ""
                }
            } else {
                var users = await userModel.login(body);
                body.roleId = users.data[0]['roleId'];
                body.companyId = users.data[0]['companyId'];
                body.siteId = users.data[0]['siteId'];

                var getCartDet = await productModel.getCartByCartId(body.cartId);
                if (getCartDet.status == 'success' && getCartDet.data.length > 0) {
                    body.siteId = getCartDet.data[0]['csid'];
                    // Remove items not present in the incoming request
                    body.rmvPid = body.items.map(item => item.pid);
                    var rmvCartItems = await productModel.removeCartItems(body);
                    
                    // Add or update incoming items
                    var updItems = await productModel.addUpdCartItems(body);
                    
                    // Update cartstage to 'Approved'
                    var updCartApp = await productModel.updCartStageByCartId(body, 'A');
                    
                    // Insert entry into ordermaster table
                    var newOrd = await productModel.createOrder(body);
                    
                    if (newOrd.status == "success") {
                        if (newOrd.data > 0) {
                            // send email starts
                            var getPMlist = await userModel.getHOByPMUser(body);
                            if (getPMlist.status == 'success' && getPMlist.data.length > 0) {
                                getPMlist.data.forEach(async (userDet) => {
                                    const to_emailid = userDet['emailid'];
                                    const subject = 'New Order Submitted for Processing #ORD00' + newOrd.data;
                                    var mailData = {
                                        'pmName': userDet['fname'] + ' ' + userDet['lname'],
                                        'orderId': newOrd.data,
                                        'pmName': users.data[0]['fname'] + ' ' + users.data[0]['lname'],
                                        'pmEmail': body.emailId,
                                        'submissionDate': constants.currentDateTime,
                                        'itemCount': body.items.length,
                                        'cartLink': req.headers.host + '/cart?number=' + body.cartId
                                    };
                                    const htmlContent = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Order submitted for processing</title><style>body{font-family:Arial,sans-serif;background-color:#f8f8f8;margin:0;padding:0}.container{max-width:600px;margin:20px auto;background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,.1)}.header{text-align: center;background-color: #007bff;color: #ffffff;padding: 10px 0;border-radius: 8px 8px 0 0;}.header h2{margin: 0;font-size: 20px;}.content{font-size:16px;color:#555}.button{display:inline-block;padding:10px 20px;margin-top:20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px}.button:hover{background-color:#0056b3}.footer{font-size:12px;color:#888;text-align:center;margin-top:20px}table{width:100%;margin-top:20px;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd;text-align:left}th{background-color:#f0f0f0}</style></head><body><div class="container"><div class="header"><h2>New Order Submitted for Processing</h2></div><div class="content"><p>Dear HO Team,</p><p>The following order has been approved by the Purchase Manager and is now submitted for your final review and processing.</p><p><strong>Order Details:</strong></p><table><tr><th>Order ID</th><td>#ORD00'+mailData['orderId']+'</td></tr><tr><th>Submitted by</th><td>'+mailData['pmName']+' (Purchase Manager)</td></tr><tr><th>Submission Date</th><td>'+mailData['submissionDate']+'</td></tr><tr><th>Total Items</th><td>'+mailData['itemCount']+'</td></tr></table><div style="text-align: center;"><a href="https://chachret.com/dashboard" class="button center">View Order</a></div></div><p>If you have any questions or need further assistance, please contact the PM at '+mailData['pmEmail']+'</p><div class="footer"><p>This is an automated message. Please do not reply to this email.</p></div></div></body></html>';
                                    await sendZeptoEmail(to_emailid, subject, htmlContent);
                                    // '+mailData['cartLink']+'
                                });
                            }
                            //send email ends
                            result = {
                                "status": "success",
                                "message": "Cart approved successfully",
                                "data": newOrd.data,
                            }
                        } else {
                            result = {
                                "status": "failed",
                                "message": newOrd.data,
                                "data": "",
                            }
                        }
                    } else {
                        result = {
                            "status": "failed",
                            "message": newOrd.data,
                            "data": "",
                        }
                    }
                } else {
                    result = {
                        "status": "failed",
                        "message": 'Wrong cart selected',
                        "data": "",
                    }
                }
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

const saveBase64PDF = (base64String, fileName) => {
    const base64Data = base64String.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(__dirname, '../../uploads', fileName);

    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, pdfBuffer);
    return filePath;
};

exports.confirmCart = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "confirmCart") {
            result.message = 'Invlaid API';
        } else if (body.action == "" || body.action == undefined || !['approve', 'reject'].includes(body.action)) {
            result.message = 'Provide valid action';
        } else if (body.orderId == "" || body.orderId == undefined) {
            result.message = 'Provide Order Id';
        } else if (body.poNumber == undefined) {
            result.message = 'Provide PO Number';
        } else if (body.poLink == undefined) {
            result.message = 'Provide PO Document';
        } else {
            if (body.action == 'reject') {
                body.ordStatus = 'R';
                body.poNumber = null;
                body.poLink = null;
            } else {
                body.ordStatus = 'A';
                var fileName = 'orderId_'+body.orderId+'_'+body.poNumber+'.pdf';
                body.poLink = saveBase64PDF(body.poLink, fileName);
            }

            var updOrd = await productModel.updateOrder(body);
            result = {
                "status": updOrd.status,
                "message": updOrd.data
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

exports.getCartDetail = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "getCartDetail") {
            result.message = 'Invlaid API';
        } else {
            var users = await userModel.login(body);
            body.roleId = users.data[0]['roleId'];
            body.companyId = users.data[0]['companyId'];
            body.siteId = users.data[0]['siteId'];
            var prodCartDet = await productModel.getCartDetail(body);
            if (prodCartDet.status == "success") {
                if (prodCartDet.data.length > 0) {
                    prodCartDet.data.map((data)=>{
                        data.imagelink = `${req.protocol}://${req.get('host')}/products/${data.imagelink}`;
                    })
                    result = {
                        'status': "success",
                        'message': 'Data Found Successfully',
                        'data' : prodCartDet.data
                    }
                } else {
                    result.message = 'No Data Found';
                }
            } else {
                result.message = prodCartDet.data;
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

const sendZeptoEmail = async (to, subject, html) => {
    try {
        var transport = nodemailer.createTransport({
            host: constants.zeptoMailConfig['host'],
            port: constants.zeptoMailConfig['port'],
            auth: {
                user: constants.zeptoMailConfig['user'],
                pass: constants.zeptoMailConfig['pass']
            }
        });

        var mailOptions = {
            from: '"Chachret Support" <noreply@chachret.com>',
            to: to,
            subject: subject,
            html: html,
        };

        // transport.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return { 'success': false, 'msg': error };
        //     } else {
        //         console.log('Successfully sent');
        //         return { 'success': true, 'msg' : 'Successfully sent' };
        //     }
        // });
        let info = await transport.sendMail(mailOptions);
        console.log('Successfully sent:', info);
        return { 'success': true, 'msg': 'Successfully sent' };
    } catch (error) {
        console.error('Mail sending Error:', error);
        return { 'success': false, 'msg': error.message };
    }
};

exports.sendEmail = async (req, res) => {
    let body = req.body;
    var result = {
        'status': "failed",
        'message': 'Something Went Wrong.',
        'data' : ""
    }
    try {
        if (Object.keys(body).length == 0) {
            result.message = 'Please Prvoide Required Details.';
        } else if (body.api_name == "" || body.api_name == undefined || body.api_name != "sendEmail") {
            result.message = 'Invlaid API';
        } else {
            const { to, subject, html } = req.body;
            if (!to || !subject || !html) {
                return res.status(400).json({ success: false, message: 'Invalid email data provided' });
            }
            try {
                const result = await sendZeptoEmail(to, subject, html);
                
                if (result.success) {
                    res.status(200).json({ 
                        success: true, 
                        message: 'Email sent successfully', 
                        data: result.msg 
                    });
                } else {
                    res.status(500).json({ 
                        success: false, 
                        message: result.msg 
                    });
                }
            } catch (error) {
                res.status(500).json({ 
                    success: false, 
                    message: 'An error occurred while sending the email' 
                });
            }
        }
    } catch (err) {
        result = {
            "status": "failed",
            "message": err,
            "data": "",
        }
        res.status(200).json(result);
    }
}
