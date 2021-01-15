var helpModel = require('../models/helperModel');

module.exports.produtList = function (page, callback) {
  console.log("Model produtList List Loaded")
  var limit = 10
  var offset = (parseInt(page) - 1) * limit
  var query = "SELECT * from  products LIMIT " + limit + " OFFSET " + offset

  helpModel.selectQuery("ProdutList", query).then(results => {
    console.log("results : ", results)
        callback(null, results);
  
  }).catch(error => {
    callback(error, null);
  });
}



module.exports.productData = function (pro_id, callback) {
  console.log('productData  model');
  var query = "SELECT * from products where id = " + pro_id;
  console.log(query);

  helpModel.selectQuery("productData", query).then(results => {
    // console.log("results : ", results)
    if (results.length > 0) {
      callback(null, results);
    } else {
      callback(null, null);
    }

  }).catch(error => {
    callback(error, null);
  });

}


// Update Product data
module.exports.ProductUpdate = function (data, callback) {
  console.log('APIdata  model', data);
  var status = 0;
  if (data.status) {
    status = 1;
  }
  console.log("********ProductUpdate**********************", data);

  var query = "UPDATE products SET name = '" + data.product_name + "' , stock = '" + data.product_stock + "' , status = " + status + " WHERE id =" + data.pro_id;

  helpModel.updateQuery("ProductUpdate", query).then(results => {
    if (results) {
      callback(null, results);
    } else {
      callback(null, null);
    }

  }).catch(error => {
    callback(error, null);
  });

}

module.exports.productAdd = function (data, callback) {
  console.log('CoproductAdd    model')
  var table = "products"
  var fields = new Array()
  var status = 0
  if (data.status) {
    status = 1
  }
  fields["name"] = data.product_name
  fields["stock"] = data.product_stock
  fields["status"] = status

  // Insert into api_data table
  helpModel.insertQuery("productAdd", table, fields, "id").then(results => {
    callback(null, results);
  }).catch(error => {
    callback(error, null);
  });

}