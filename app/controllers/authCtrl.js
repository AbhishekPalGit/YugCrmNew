const aesjs = require('aes-js');
const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
const cookieKey = [ 99, 89, 79, 69, 59, 49, 39, 29, 19, 9, 109, 119, 129, 139, 149, 169 ];

const constants = require('../../config/constants.js');
const jwt = require('jsonwebtoken');


exports.dummyLogin = async function(req, res) {
    const secret = constants.TokenSecret;
    let response = {
        "status": "failed",
        "authorizationToken": "",
        "message": "Something Went Wrong. Please try again later"
    };
    let requestJSON = {
        "userId": 6,
        "userName": "Shukrant Pawar",
        "emailId" : "shukrant@yopmail.com"
    };
    const token = jwt.sign(requestJSON, secret, {
        expiresIn: '1h'
    });
    response = {
        "status": "success",
        "authorizationToken": token,
        "message": "login successful"
    }
    res.status(200).json(response);
}

exports.generateToken = async function(req, res) {
    const secret = constants.TokenSecret;
    const credentials = constants.TokenCred;
    let tokenJSON = {
        "status": "",
        "authorizationToken": "",
        "message": ""
    };
    try {
        if (req.body.userName !== undefined && req.body.password !== undefined) {
            let requestJSON = {
                "userName": req.body.userName,
                "password": req.body.password
            };
            if (requestJSON.userName === credentials.userName && requestJSON.password === credentials.password) {
                try {
                    const token = jwt.sign(requestJSON, secret, {
                        expiresIn: '1h'
                    });
                    console.log("token=>>>>>", token);
                    let textBytes = aesjs.utils.utf8.toBytes(token);
                    let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
                    let encryptedBytes = aesCtr.encrypt(textBytes);
                    let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
                    console.log("encryptedHex=>>>>>>>", encryptedHex);
                    tokenJSON = {
                        "status": "success",
                        "authorizationToken": encryptedHex,
                        "message": ""
                    }
                } catch (err) {
                    tokenJSON = {
                        "status": "failed",
                        "authorizationToken": "",
                        "message": err.message
                    }
                }
                res.json(tokenJSON);
            } else {
                tokenJSON = {
                    "status": "failed",
                    "authorizationToken": "",
                    "message": "Invalid Credentials"
                }
                res.json(tokenJSON);
            }
        } else {
            tokenJSON = {
                "status": "failed",
                "authorizationToken": "",
                "message": "Invalid Request"
            }
            res.json(tokenJSON);
        }
    } catch (err) {
        tokenJSON = {
            "status": "failed",
            "authorizationToken": "",
            "message": "Invalid Request"
        }
        res.json(tokenJSON);
    }
}

exports.validateToken = async function(req, res) {
    let tokenJSON = {
        "status": "",
        "message": ""
    };
    var reqToken = req.body.authorizationToken;
    if (reqToken != "" && reqToken !== undefined) {
        let encryptedHex = req.body.authorizationToken;
        console.log("Encrypted Text :::::::::: ", encryptedHex);
        let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        console.log("Decrypted Text :::::::::: ", decryptedText);
        let authorizationToken = decryptedText;
        if (!authorizationToken) {
            response = {
                "status": "failed",
                "message": "Unauthorized: No token provided",
            }
            res.json(response);
        } else {
            jwt.verify(authorizationToken, constants.TokenSecret, function(err, decoded) {
                console.log("err :::::::::", err);
                console.log("decoded :::::::::", decoded);
                if (err) {
                    response = {
                        "status": "failed",
                        "message": "Unauthorized: Invalid token - " + err,
                    }
                    res.json(response);
                } else {
                    response = {
                        "status": "success",
                        "message": "Token Verified",
                    }
                    res.json(response);
                }
            });
        }
    } else {
        response = {
            "status": "failed",
            "message": "Invalid Token"
        }
        res.json(response);
    }
}

exports.decodeToken = async function(req, res) {
    let tokenJSON = {
        "status": "",
        "message": ""
    };
    var reqToken = req.body.authorizationToken;
    if (reqToken != "" && reqToken !== undefined) {
        let encryptedHex = req.body.authorizationToken;
        console.log("Encrypted Text :::::::::: ", encryptedHex);
        let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        console.log("Decrypted Text :::::::::: ", decryptedText);
        let authorizationToken = decryptedText;
        if (!authorizationToken) {
            response = {
                "status": "failed",
                "message": "Unauthorized: No token provided",
            }
            res.json(response);
        } else {
            var dceodedToken = jwt.decode(authorizationToken);
            response = {
                "status": "success",
                "message": "Token Verified",
                "token" : dceodedToken
            }
            console.log("dceodedToken=>>>>>>", dceodedToken);
            res.json(response);
        }
    } else {
        response = {
            "status": "failed",
            "message": "Invalid Token"
        }
        res.json(response);
    }
}

async function verifyToken(token) {
    console.log("in verify token==>>");
    let response = {
        "status": "",
        "message": ""
    };
    if (token != "" && token !== undefined) {
        let encryptedHex = token;
        console.log("Encrypted Text :::::::::: ", encryptedHex);
        let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
        let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        let decryptedBytes = aesCtr.decrypt(encryptedBytes);
        let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        console.log("Decrypted Text :::::::::: ", decryptedText);
        let authorizationToken = decryptedText;
        if (!authorizationToken) {
            console.log('in if');
            response = {
                "status": "failed",
                "message": "Unauthorized: No token provided",
            }
            return response;
        } else {
            console.log('in else');
            jwt.verify(authorizationToken, constants.TokenSecret, function(err, decoded) {
                if (err) {
                    console.log('in err');
                    response = {
                        "status": "failed",
                        "message": "Unauthorized: Invalid token - " + err,
                    }
                    return response;
                } else {
                    console.log('in success');
                    response = {
                        "status": "success",
                        "message": "Token Verified",
                    }
                    console.log("response==>>>>>>>>>", response);
                    return true;
                }
            });
        }
    } else {
        console.log('in invalid');
        response = {
            "status": "failed",
            "message": "Invalid Token"
        }
        return response;
    }
}

exports.encrypt = async function(req, res){
	let responseData = {
		"status": "",
		"data": {},
		"message": ""
	};

	let requestData = req.body.plainText;
	if(req.body.plainText !== undefined && req.body.plainText != ""){
		// Encrypt plain text using AES CTR algo.
		let requestData = req.body.plainText;
		var textBytes = aesjs.utils.utf8.toBytes(JSON.stringify(requestData));
		var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
		var encryptedBytes = aesCtr.encrypt(textBytes);
		var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

		responseData = {
			"status": "success",
			"data": encryptedHex,
			"message": ""
		};
		// responseData = {
		// 	"status": "success",
		// 	"data": requestData,
		// 	"message": ""
		// };
	}else{
		responseData = {
			"status": "failed",
			"data": "",
			"message": "Error Encrypting Data"
		};
	}
	res.json(responseData);
}

exports.decrypt = async function(req, res){
	let responseData = {
		"status": "",
		"data": {},
		"message": ""
	};

	if(req.body.encryptedText !== undefined && req.body.encryptedText != ""){
		// Decrypt encrypted text using AES CTR algo.
		encryptedHex = req.body.encryptedText;
		let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
		let aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
		let decryptedBytes = aesCtr.decrypt(encryptedBytes);
		let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		let decryptedJSON = JSON.parse(decryptedText);
		responseData = {
			"status": "success",
			"data": decryptedJSON,
			"message": ""
		};
		// responseData = {
		// 	"status": "success",
		// 	"data": encryptedHex,
		// 	"message": ""
		// };
	}else{
		responseData = {
			"status": "failed",
			"data": "",
			"message": "Error Encrypting Data"
		};
	}
	res.json(responseData);
}