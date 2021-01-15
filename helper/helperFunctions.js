var helpModel = require('../models/helperModel');

const crypto = require('crypto');
var AESCrypt = require('../helper/aesCrypt');

const iv = 'a2xhcgAAAAAAAAAA';
const front_key = 'Zx*}kn@bf>(sX8Ep';
const back_key = 'TrVMD/+_mG(j76,8';

function generateCryptKey(key) {
	var cryption_key = "%^&+@=$-%#-#@" + key + "+^&_-!@#&^&=";
	var cryptkey = crypto.createHash('md5').update(cryption_key, 'utf-8').digest('hex').toUpperCase();
	// console.log(cryptkey);
	return cryptkey;
}

module.exports.getDecryptedText = function (encryptdata, tokentime, callback) {
	cryptkey = generateCryptKey(tokentime);
	var dec = '';
	dec = AESCrypt.decrypt(cryptkey, iv, encryptdata);

	if (dec) {
		decoded_front_key = dec.substr(0, 16);
		decoded_back_key = dec.substr(-16);

		//check these string matches our key, if matches remove these strings from the decoded string
		if (decoded_front_key == front_key && decoded_back_key == back_key) {
			//remove first 16 char
			dec = dec.substr(16);
			//remove end 16 char
			dec = dec.slice(0, -16)
		}
	}

	callback(dec);
};

module.exports.getEncryptedText = function (text, tokentime, callback) {
	cryptkey = generateCryptKey(tokentime)
	var enc = '';
	enc_string = front_key + text + back_key;
	enc = AESCrypt.encrypt(cryptkey, iv, enc_string);

	callback(enc);
};

module.exports.logErrror = function (text) {
	// console.log("\x1b[31m",text, "\x1b[31m");
	console.log(text);
};

// Funcion getting Current date and time in unix time format
module.exports.getDateTime = function () {
	var datetime = new Date().getTime() / 1000 | 0
	return datetime
}

// Function to md5 encryption
module.exports.md5Encryption = function (text) {
	var md5 = require('md5');
	// console.log(text)
	var encrypted = md5(text);
	return encrypted
}

// Get uid using mlm_id
module.exports.uidFromMlmId = function (mlm_id, callback) {
	console.log("************************uidFromMlmId*************************", mlm_id);
	return new Promise((resolve, reject) => {
		if (mlm_id) {
			let uid = 0
			var query = "SELECT uid FROM users WHERE mlm_uid = " + mlm_id
			helpModel.selectQuery("uidFromMlmId", query).then(results => {
				if (results.length > 0) {
					uid = results[0].uid
					resolve(uid)
				} else {
					reject("MLM Uid Not Found");
				}
			}).catch(error => {
				reject(error);
			});
		} else {
			reject("Invalid mlm_id")
		}
	});

}


// Function to Format date
module.exports.getFormattedDate = function () {
	var now = new Date()
	var formatted_date = now.getDate() + "-" + returnMonth(now.getMonth()) + "-" + now.getFullYear()
	return formatted_date
}

function returnMonth(month) {
	month++
	if (month < 10) {
		return "0" + month
	}
	return month
}

module.exports.getDateSplits = function (unix) {
	var new_date = new Date(unix)
	var splits = new Array()
	splits.day = new_date.getDate()
	splits.month = returnMonth(new_date.getMonth())

	splits.year = new_date.getFullYear()
	splits.combined = splits.day + "-" + splits.month + "-" + splits.year
	// console.log(splits)
	return splits;
}


module.exports.isEmptyObject = function (obj) {
	return !Object.keys(obj).length;
}

/**
 * Returns the 4 digit otp
 * @returns {integer} 4 digit otp
 */
module.exports.generateOtp = function () {
	// return Math.floor(1000 + Math.random() * 9000);
	return Math.floor(Math.random() * (999999 - 100000)) + 100000;
}



module.exports.arrayChunk = function (array, size) {
	const chunked_arr = [];
	for (let i = 0; i < array.length; i++) {
		const last = chunked_arr[chunked_arr.length - 1];
		if (!last || last.length === size) {
			chunked_arr.push([array[i]]);
		} else {
			last.push(array[i]);
		}
	}
	return chunked_arr;
}

// function arrayChunk(array, size) {

// }
module.exports.getStartingTime = function (unix) {
	unix = unix * 1000
	var new_date = new Date(unix)
	new_date.setHours(0, 0, 0, 0);
	timestamp = new_date.getTime() / 1000 | 0
	return timestamp
}

module.exports.getFormattedDateWithDate = function (unix) {
	if (unix < 10000000000) {
		unix = unix * 1000
	}
	var now = new Date(unix)
	var formatted_date = now.getDate() + "-" + returnMonth(now.getMonth()) + "-" + now.getFullYear()
	return formatted_date
}

