const crypto = require('crypto');

module.exports.decrypt = function(cryptkey, iv, encryptdata) {
	try{
		var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
		decoded = decipher.update(encryptdata, 'base64', 'utf8');
		decoded += decipher.final('utf8');
		return decoded;
	}catch(e){
		console.log("exception occured at decrypt");
		return false;
	}
}

module.exports.encrypt = function(cryptkey, iv, cleardata) {
	try{
		var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
		encryptdata = encipher.update(cleardata, 'utf8', 'base64');
		encryptdata += encipher.final('base64');
		return encryptdata;
	}catch(e){
		console.log("exception occured at encrypt");
	}
}

