var express = require('express');
var path = require('path');
var app = express();
var middlware = require('../config/middleware');
// const upload = require('../config/multerConfig');
var authCtrl = require('../app/controllers/authCtrl');
var companyCtrl = require('../app/controllers/company');
var siteCtrl = require('../app/controllers/site');
var userCtrl = require('../app/controllers/user');
var productCtrl = require('../app/controllers/product');
var dashboardCtrl = require('../app/controllers/dashboard');


module.exports = function (app) {
	// appName/api/version/APIType/urlName

	// Tokenisation
	app.post('/crm/api/v1/token/dummyLogin', authCtrl.dummyLogin);
	app.post('/crm/api/v1/token/generateToken', authCtrl.generateToken);
	app.post('/crm/api/v1/token/validateToken', authCtrl.validateToken);
	app.post('/crm/api/v1/token/decodeToken', authCtrl.decodeToken);
	
	// Company Module
	app.post('/crm/api/v1/company/getCompanyList', middlware, companyCtrl.getCompanyList);
	app.post('/crm/api/v1/company/addCompany', middlware, companyCtrl.addCompany);
	app.post('/crm/api/v1/company/updateCompany', middlware, companyCtrl.updateCompany);
	app.post('/crm/api/v1/company/deleteCompany', middlware, companyCtrl.deleteCompany);

	// Site Module
	app.post('/crm/api/v1/site/getSiteList', middlware, siteCtrl.getSiteList);
	app.post('/crm/api/v1/site/addSite', middlware, siteCtrl.addSite);
	app.post('/crm/api/v1/site/updateSite', middlware, siteCtrl.updateSite);
	app.post('/crm/api/v1/site/deleteSite', middlware, siteCtrl.deleteSite);

	// User Module
	app.post('/crm/api/v1/user/getUserList', middlware, userCtrl.getUserList);
	app.post('/crm/api/v1/user/addUser', middlware, userCtrl.addUser); //signup
	app.post('/crm/api/v1/auth/login', middlware, userCtrl.login); //login
	app.post('/crm/api/v1/user/updateUser', middlware, userCtrl.updateUser);
	app.post('/crm/api/v1/user/deleteUser', middlware, userCtrl.deleteUser);

	// Product Module
	app.post('/crm/api/v1/product/getProductList', middlware, productCtrl.getProductList);
	app.post('/crm/api/v1/product/addProduct', middlware, productCtrl.addProduct);
	app.post('/crm/api/v1/product/addBulkProduct', middlware, productCtrl.addBulkProduct);
	app.post('/crm/api/v1/product/updateProduct', middlware, productCtrl.updateProduct);
	app.post('/crm/api/v1/product/deleteProduct', middlware, productCtrl.deleteProduct);
	app.post('/crm/api/v1/product/addUpdateCart', middlware, productCtrl.addUpdateCart);
	app.post('/crm/api/v1/product/approveCart', middlware, productCtrl.approveCart);
	app.post('/crm/api/v1/product/confirmCart', middlware, productCtrl.confirmCart);
	app.post('/crm/api/v1/product/getCartDetail', middlware, productCtrl.getCartDetail);

	// Dashbaord Module
	app.post('/crm/api/v1/dashboard/getSSDashboard', middlware, dashboardCtrl.getSSDashboard);
	app.post('/crm/api/v1/dashboard/getPMDashboard', middlware, dashboardCtrl.getPMDashboard);
	app.post('/crm/api/v1/dashboard/getHODashboard', middlware, dashboardCtrl.getHODashboard);
	app.post('/crm/api/v1/dashboard/superAdminDashboard', middlware, dashboardCtrl.superAdminDashboard);


	// front route *********************************
	app.use('/template', express.static(path.join(__dirname, '../public/template')));
	app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/template/login.html')); 
    });
	app.get('/dashboard', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/template/dashboard.html')); 
    });

};
