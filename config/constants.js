var apiUrl = 'API_URL';

var d = new Date;
var dformat = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-') + ' ' +
    [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

module.exports = {
    "ApiUrl": apiUrl,
    'TokenCred': {
        "userName": "YugCRM-API",
        "password": "yugCrmAPI@#123!"
    },
    'TokenSecret':'wmVeMGCQBCfhMe2iC0Jkgw==', // paras
    'currentDateTime' : dformat,
    "allergen" : {
        "1" : "Milk",
        "2" : "Wheat",
        "3" : "Soy",
        "4" : "Egg",
        "5" : "Peanut",
        "6" : "Treenut",
        "7" : "Fish",
        "8" : "Shellfish",
        "9" : "Gluten",
        "10": "Sesame",
        "11": "Mustard",
        "12": "Other",
    },
    "zeptoMailConfig" : {
        "host": "smtp.zeptomail.in",
        "port": 587,
        "user": "emailapikey",
        "pass": "PHtE6r1eRu7tjzYtpEIAtPCxEZWtNo59/+4zeQVOsIoRXKNSH01QqdF4wTK3ok0rA/QUQf/Oyt1qtLOYur2DIz7qZz5JWWqyqK3sx/VYSPOZsbq6x00asF8efkLdUYLnc9Fr1SDTv9jfNA=="
    },
    "roles" : {
        "SA": {
            'roleName' : 'Super Admin',
            'roleId' : 1,
        },
        "ADM": {
            'roleName' : 'Admin',
            'roleId' : 2,
        },
        "HO": {
            'roleName' : 'Head Office',
            'roleId' : 5,
        },
        "PM": {
            'roleName' : 'Purchase Manager',
            'roleId' : 3,
        },
        "SS": {
            'roleName' : 'Site Supervisor',
            'roleId' : 4,
        },
    },
};