
let curUrl = (window.location.href).includes('localhost')? "https://chachret.com/crm/api/v1/" :`${window.location.protocol}//${window.location.host}/crm/api/v1/`
export const Frontconstants ={
    "company": {
        getApiUrl: curUrl + 'company/getCompanyList',
        addApiUrl: curUrl + 'company/addCompany',
        delApiUrl: curUrl + 'company/deleteCompany',
        getApiName: "getCompanyList",
        delApiName: "deleteCompany",
        addApiName: "addCompany"
    },
    "site":{
        getApiUrl: curUrl + 'site/getSiteList',
        addApiUrl: curUrl + 'site/addSite',
        delApiUrl: curUrl + 'site/deleteSite',
        getApiName: "getSiteList",
        delApiName: "deleteSite",
        addApiName: "addSite"

    },
    "users":{
        getApiUrl: curUrl + 'user/getUserList',
        addApiUrl: curUrl + 'user/addUser',
        delApiUrl: curUrl + 'user/deleteUser',
        getApiName: "getUserList",
        delApiName: "deleteUser",
        addApiName: "addUser"
    },
    "product":{
        getApiUrl: curUrl + 'product/getProductList',
        addApiUrl: curUrl + 'product/addProduct',
        delApiUrl: curUrl + 'product/deleteProuct',
        getApiName: "getProductList",
        delApiName: "deleteCompany",
        addApiName: "addProduct"

    },
    "pendingCart":{
      getApiUrl: curUrl + 'product/getCartDetail',
      getApiName: "getCartDetail",

    },
    "getHodashboard":{
      getApiUrl: curUrl + 'dashboard/getHODashboard',
      getApiName: "getHODashboard",
    },
    "SiteSupervisor":{
      getApiUrl: curUrl + 'dashboard/getSSDashboard',
      getApiName: "getSSDashboard",
    },
    "ProductManager":{
      getApiUrl: curUrl + 'dashboard/getPMDashboard',
      getApiName: "getPMDashboard",
    },
    "saveCart":{
      getApiUrl: curUrl + 'product/addUpdateCart',
      getApiName: "addUpdateCart",
    },
    "approveCart":{
      getApiUrl: curUrl + 'product/approveCart',
      getApiName: "approveCart",
    },
    "Confirmcart":{
      getApiUrl: curUrl + 'product/confirmCart',
      getApiName: "confirmCart",
    },
    'cardNames' : {
      "SS": {
          'pending' : 'Pending Carts',
          'approved' : 'Approved Carts',
          'rejected' : 'Rejected Carts',
          'submitted' : 'Submitted Carts',
          "pid": 'Product Id',
          "productname": 'Item Name', 
          "productdesc": 'Item Description', 
          "brand": 'Brand',
          "gstext": 'GST', 
          "hsncode": 'HSN Code', 
          "imagelink": 'Image', 
          "quantity": 'Quantity',
          "cartid": 'Cart Id',
      },
      "PM": {
          'pending_tasks' : 'Pending Carts',
          'rejected_carts' : 'Rejected Carts',
          'pending_orders' : 'Pending Orders',
          'approved_orders' : 'Approved Orders',
          'rejected_orders' : 'Rejected Orders',
      },
      "HO": {
          'pending' : 'Pending Orders',
          'approved' : 'Approved Orders',
          'rejected' : 'Rejected Orders',
      },
      "ADM": {
          'ccname' : 'Company Name',
          "siteName": "Site Name",
          "companyName": "Company Name",
          'isactive' : 'Active Status',
          "name": "User Name",
          "email": "EmailId",
          "mobileno": "Mobile No.",
          "roleName": "Role Name",
          "userActive": 'Active Status',
          "SiteName": "Site Name",
          "brand": "Brand",
          "gstext": "GST", 
          "hsncode": "HSN Code", 
          "image": "Image", 
          "pid": "Product Id", 
          "productdesc": "Item Description", 
          "productname": "Item Name", 
      },
    }
}

export const InputObj = {
    company: [
      {
        label: "Company Name",
        type: "text",
        placeholder: "Enter Comapny Name",
        required: true,
        id: "companyName",
        val: "ccname"
      },
    ],
    site: [
        {
          label: "Site Name",
          type: "text",
          placeholder: "Enter Site Name",
          required: true,
          id: "siteName",
        },
        {
            label: "Company Name",
            type: "dropdown",
            placeholder: "Enter Comapny Id",
            required: true,
            id: "companyId",
            val: "companyName"
          },
      ],
      users:[
        {
          label: "First Name",
          type: "text",
          placeholder: "Enter First Name",
          required: true,
          id: "fname",
        },
        {
          label: "Last Name",
          type: "text",
          placeholder: "Enter Last Name",
          required: true,
          id: "lname",
        },
        {
          label: "Email",
          type: "email",
          placeholder: "Enter Email",
          required: true,
          id: "email",
        },
        {
          label: "Mobile Number",
          type: "tel",
          placeholder: "Enter Mobile Number",
          required: true,
          id: "mobileno",
        },
        {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
          required: true,
          id: "usrpass",
        },
        {
          label: "Role ID",
          type: "dropdown",
          placeholder: "Enter Role ID",
          required: true,
          id: "roleId",
        },
        {
          label: "Company Name",
          type: "dropdown",
          placeholder: "Enter Comapny Id",
          required: true,
          id: "companyId",
        },
        {
          label: "Site ID",
          type: "dropdown",
          placeholder: "Enter Site ID",
          required: true,
          id: "siteId",
        },

      ],
      product:[
        {
          label: "Product Name",
          type: "text",
          placeholder: "Enter Product Name",
          required: true,
          id: "ProductName",
        },
        {
          label: "Product Description",
          type: "text",
          placeholder: "Enter Product Description",
          required: true,
          id: "ProductDesc",
        },
        {
          label: "Brand",
          type: "text",
          placeholder: "Enter Brand Name",
          required: true,
          id: "Brand",
        },
        {
          label: "HSN Code",
          type: "text",
          placeholder: "Enter HSN Code",
          required: true,
          id: "HsnCode",
        },
        {
          label: "GST",
          type: "number",
          placeholder: "Enter GST",
          required: true,
          id: "Gst",
        },
        {
          label: "Company ID",
          type: "dropdown",
          placeholder: "Enter Company ID",
          required: true,
          id: "companyId",
        },
        {
          label: "Image",
          type: "text",
          placeholder: "Upload Image",
          required: true,
          id: "Img",
        },
      ]
  };

export const UserMenus ={
        SA :["company","site","users","product"],
        ADM :["company","site","users","product"],
        SS :["Dashboard", "Raise Cart", "Cart"],
        PM :["Dashboard"],
        HO:["Dashboard"],
}

export const RoleConstant =[
  {
    'roleName' : 'Super Admin',
    'roleId' : 1,
  },
  {
    'roleName' : 'Admin',
    'roleId' : 2,
  },
  {
    'roleName' : 'Head Office',
    'roleId' : 5,
  },
  {
    'roleName' : 'Purchase Manager',
    'roleId' : 3,
  },
  {
    'roleName' : 'Site Supervisor',
    'roleId' : 4,
  }
]
