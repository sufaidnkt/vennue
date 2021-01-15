
var apiModel = require('../models/apiModel');
// var socketController = require('../controllers/socketController');
var helpFunc = require('../helper/helperFunctions');
var productModel = require('../models/products.js');

module.exports.middleware = function (req, res, next) {
  // console.log("Host :", req.hostname)
  console.log("Client Header :", req.headers)
  console.log("Client body :", req.body)

  // console.log("Ip : ",req.connection.remoteAddress);

  res.setHeader('Content-Type', 'application/json')
  var header = req.headers

  apiModel.checkApiKey(header, function (error, response) {

    console.log("checkApiKey response ", response);
    console.log("checkApiKey error ", error);

    if (!error) {
      console.log("response API:   ", response);
      next()

    } else {
      res.statusCode = 401;
      res.send({ "status": 401, "message": 'UNAUTHORIZED11' })
      res.end()
      return;
    }
  });
}


module.exports.getAllProducts = function (req, res, next) {
  console.log("--------Controller getAllProducts Details---------");
  
  var page = req.query.page
  page = page ? page : 1;
  var data = {}
  data.title = "Product Details"
  console.log("productList  Controller")
  
 productModel.produtList(page, function (error, response) {
        console.log("*********************", response);
        if (!error) {
          if (response) {
            res.statusCode = 200;
            res.send({ "status": 200, "message": 'Success', "description": 'Successfully Registered', "registartion_id": response });
            res.end()
          } else {
            res.statusCode = 403;
            res.send({ "status": 403, "message": 'Forbidden123' });
            res.end()
          }
        } else {
          res.statusCode = 401;
          res.send({ "status": 401, "message": 'Invalid Data', 'Description': error })
          res.end()
          // return;
        }
      });


}


