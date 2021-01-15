const express = require("express");
// const app = express();
const api_router = express.Router();

var api_controller = require('../controllers/apiController');
// console.log("APi router");

api_router.use(api_controller.middleware);
api_router.all('/get-products', api_controller.getAllProducts);


module.exports = api_router;