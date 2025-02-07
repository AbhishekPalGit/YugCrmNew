
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
        SS :["Home", "Raise Cart", "Cart"],
        PM :["Home"],
        HO:["Home"],
}

export const RoleConstant =[{
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
