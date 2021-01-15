var productModel = require('../models/products.js');

/* ----------------------------------------------------------- 
*  List all products 
---------------------------------------------------------------*/
module.exports.productList = function (req, res, next) {
  var page = req.query.page
  page = page ? page : 1;
  var data = {}
  data.title = "Product Details"
  console.log("productList  Controller")
  productModel.produtList(page, function (error, response) {
      data.apidata = response;
      res.render('products', data)
   
  });
}


module.exports.productEdit = function (req, res, next) {
  var pro_id = (req.params.pro_id)
  var data = {}
  console.log("Admin Conf Controller")
  data.title = "Product Edit"

  productModel.productData(pro_id, function (error, response) {
    if (response) {
      response.forEach(function (element) {
        data.pro_id = pro_id
        data.product_name = element.name
        data.product_stock = element.stock
        data.product_status = element.status
        data.message_status = req.header.status
        data.message = req.header.message
        req.header.status = ""
        req.header.message = ""
      });
    } else {
      // data.message_status = "danger"
      // data.message = "Please Choose correct API"
       data.title = "Product Add"
    }
    console.log("sfjdghsd", data)
    res.render('productConf', data)
  });
}





module.exports.productConfSave = function (req, res, next) {
  var data = {}
  console.log("req.body 5444: ", req.body);

  var product_name = req.body.product_name;
  var product_stock = req.body.product_stock;
  var pro_id = req.body.pro_id;


  // if (!pro_id || !product_name) {
  //   res.redirect('/dashboard');
  //   return;
  // }
  if (req.body.pro_id) {
    console.log("111111111111111111111")
    // Update
    productModel.ProductUpdate(req.body, function (error, response) {
      console.log("apiKeyUpdate Controler---------")
      if (error) {
        console.log(error)
        req.header.status = "danger"
        req.header.message = "an error occured, Please try again later"
        res.redirect('/')
        return
      }
      // console.log("-----------response-----------------",response);

      if (response) {
        req.header.status = "success"
        req.header.message = "Successfully Saved"
        req.session.auth = true;
        console.log("Suscess fully Updated")
        res.redirect('/products')
      } else {
        req.header.status = "danger"
        req.header.message = "an error occured, Please try again later"
        res.redirect('/products')
      }
    });
  } else {
    // Insert new one
    console.log("------------------------93------------")
    productModel.productAdd(req.body, function (error, response) {
      console.log("Configuration Controller---------")
      if (error) {
        req.header.status = "danger"
        req.header.message = "an error occured, Please try again later"
        res.redirect('/admin/api-add')
        return
      }
      if (response) {
        req.header.status = "success"
        req.header.message = "Successfully Saved"
        req.session.auth = true;
        res.redirect('/products')
      } else {
        req.header.status = "danger"
        req.header.message = "an error occured, Please try again later"
        res.redirect('/products')
      }
    });
  }

  console.log("Admin api conf save")
}
