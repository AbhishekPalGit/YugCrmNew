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
    // "zeptoMailConfig" : {
    //     "kylium"
    //     "host": "smtp.zeptomail.in",
    //     "port": 587,
    //     "user": "emailapikey",
    //     "pass": "PHtE6r1eRu7tjzYtpEIAtPCxEZWtNo59/+4zeQVOsIoRXKNSH01QqdF4wTK3ok0rA/QUQf/Oyt1qtLOYur2DIz7qZz5JWWqyqK3sx/VYSPOZsbq6x00asF8efkLdUYLnc9Fr1SDTv9jfNA=="
    // },
    "zeptoMailConfig" : {
        // "Chachret"
        "host": "smtp.zeptomail.in",
        "port": 587,
        "user": "emailapikey",
        "pass": "PHtE6r1ZRO7s3WQp9BlT7aftRc+kMYMu+Ok2fVVFs48TWKACFk1R+dF9mmXh+R4pUvJLEfaYyIo7uL6ft7rWLGjkZzlPXWqyqK3sx/VYSPOZsbq6x00ct10cdkDZUIDmct5r1iHSvteX"
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
    "statusMap" : {
      "CartStatus": {
        "A": "Approved",
        "S": "Submitted",
        "R": "Rejected"
      },
      "OrderStatus": {
        "A": "Approved",
        "P": "Pending",
        "R": "Rejected"
      }
    }
};