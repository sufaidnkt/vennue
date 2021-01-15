var pool = global.pool;
var helpFun = require('../helper/helperFunctions');


const selectQuery = (functionName, query) => {
    return new Promise((resolve, reject) => {
        let response = {}
        
        // pool.connect(function (err, client, done) {
        //     if (err) {
        //         reject("[db error] " + err.code);
        //         return helpFun.logErrror('error fetching client from pool ' + functionName +" - "+ err);
        //     }
        //     client.query(query, [], function (error, results) {
        //         done();
        //         if (error) {
        //             reject("[db error] " + error.code);
        //             return helpFun.logErrror('error at query execution ' + functionName + error.stack);
        //         }
        //         if (results.rowCount > 0) {
        //             response = results.rows;
        //         }
        //         resolve(response);
        //     });
        // });

        pool.connect().then(client => {
            return client.query(query,[]).then(results => {
                client.release()
                // console.log(res.rows[0])
                if (results.rowCount > 0) {
                    response = results.rows;
                }
                resolve(response)
            }).catch(error => {
                client.release()
                // console.log(err.stack)
                helpFun.logErrror('[db error] ' + functionName + " - " + error)
                reject("[db error] " + error.code)
            })
        })
    });
};




// module.exports.insertQuery = function (functionName, table, data, callback) {
module.exports.insertQuery = (functionName, table, fields, retuning_field = '') => {
    return new Promise((resolve, reject) => {
        let response = {}
        // console.log("helper")
        var count =  Object.keys(fields).length 
        if (count && table){
            var sqlStmt = "INSERT INTO " + table + " ("
            var values = "( "
            let i = 0;
    
            for (var key in fields) { 
                i++
                if (i < count) {
                    sqlStmt += key  + " ,"
                    values  += "'"+ fields[key] + "', " 
                    
                } else {
                    sqlStmt += key + " )"
                    values += "'"+fields[key] + "')" 
                    
                }
            }
            sqlStmt += " VALUES " + values
            if(retuning_field != ''){
                sqlStmt += " RETURNING " + retuning_field
            }
console.log(sqlStmt);

            pool.connect(function (err, client, done) {
                if (err) {
                    reject("[db error] " + err.code);
                    return helpFun.logErrror('error fetching client from pool ' + functionName + " - " + err);
                }
                client.query(sqlStmt, [], function (error, results) {
                    done();
                    if (error) {
                        reject("[db error] " + error.code);
                        return helpFun.logErrror('error at query execution ' + functionName + error.stack);
                    }
                    response = results.rows[0][retuning_field]
                    resolve(response);
                });
            });
        }else{
            reject("[arguments error]  fields required");
        }
        
    });
};
const updateQuery = (functionName, query) => {
    return new Promise((resolve, reject) => {
        let response = {data : "true"}

        // pool.connect(function (err, client, done) {
        //     if (err) {
        //         reject("[db error] " + err.code);
        //         return helpFun.logErrror('error fetching client from pool ' + functionName + " - " + err);
        //     }
        //     client.query(query, function (error, results) {
        //         done();
        //         if (error) {
        //             reject("[db error] " + error.code);
        //             return helpFun.logErrror('error at query execution ' + functionName + error.stack);
        //         }
                
        //         resolve(response);
        //     });
        // });

        pool.connect().then(client => {
            return client.query(query, []).then(results => {
                client.release()
                // console.log(res.rows[0])
                resolve(response)
            }).catch(error => {
                client.release()
                // console.log(err.stack)
                helpFun.logErrror('[db error] ' + functionName + " - " + error)
                reject("[db error] " + error.code)
            })
        })
    });
};
module.exports.selectQuery = selectQuery;
module.exports.updateQuery = updateQuery;

module.exports.truncate = (functionName, table) => {
    return new Promise((resolve, reject) => {
        let response = { data: "true" }

    if (table) {
        var sqlStmt = "TRUNCATE TABLE " + table 

        // pool.connect(function (err, client, done) {
        //     if (err) {
        //         reject("[db error] " + err.code);
        //         return helpFun.logErrror('error fetching client from pool ' + functionName + " - " + err);
        //     }
        //     client.query(sqlStmt, [], function (error, results) {
        //         done();
        //         if (error) {
        //             reject("[db error] " + error.code);
        //             return helpFun.logErrror('error at query execution ' + functionName + error.stack);
        //         }
        //         resolve(response);
        //     });
        // });

        pool.connect().then(client => {
            return client.query(sqlStmt, []).then(results => {
                client.release()
                resolve(response)
            }).catch(error => {
                client.release()
                helpFun.logErrror('[db error] ' + functionName + " - " + error)
                reject("[db error] " + error.code)
            })
        })
    } else {
        reject("[arguments error]  fields required");
    }
})

}
module.exports.deleteQuery = (functionName, table, condition) => {
    return new Promise((resolve, reject) => {
        let response = { data: "true" }

        if (table) {
            var sqlStmt = "DELETE  FROM " + table + " WHERE " + condition

            // pool.connect(function (err, client, done) {
            //     if (err) {
            //         reject("[db error] " + err.code);
            //         return helpFun.logErrror('error fetching client from pool ' + functionName + " - " + err);
            //     }
            //     client.query(sqlStmt, [], function (error, results) {
            //         done();
            //         if (error) {
            //             reject("[db error] " + error.code);
            //             return helpFun.logErrror('error at query execution ' + functionName + error.stack);
            //         }
            //         resolve(response);
            //     });
            // });

            pool.connect().then(client => {
                return client.query(sqlStmt, []).then(results => {
                    client.release()
                    resolve(response)
                }).catch(error => {
                    client.release()
                    helpFun.logErrror('[db error] ' + functionName + " - " + error)
                    reject("[db error] " + error.code)
                })
            })

        } else {
            reject("[arguments error]  fields required");
        }
    })

}



/* 
***********************************************************
            |     Multiple Insert     |
***********************************************************
* @param functionName : Calling Function name For error identifing
* @param table  : Table Name
* @param args   : Table Coumn name 
*           Format : var fields = ["uid", "name"]
* @param values : Inserted values
*           Format :  var values = [ ["10", "NAME1"], [11, "NAME2"], ['12', "NAME3"] ]
* @return : Inserted Row count
*/


module.exports.multiInsert = (functionName, table, args, values ) => {
    console.log(values  );
    
    return new Promise((resolve, reject) => {
        let response = {}
        console.log("helper Multi insert")
        var count = Object.keys(args).length
        if (count && table) {
            var sqlStmt = "INSERT INTO " + table + " ("
            // var values = "( "
            let i = 0;

            for (var key in args) {
                
                i++
                if (i < count) {
                    sqlStmt += args[key] + " ,"
                } else {
                    sqlStmt += args[key] + " )"
                }
            }
            sqlStmt += " VALUES " 
            
            var k = 0;
            var v_count = Object.keys(values).length
            console.log("v_counr", v_count);
            for (var key1 in values) {
                k++
                let j = 0; 
                sqlStmt += "("
                for (key2 in values[key1]){
                    j++
                    
                    
                    if (j < count) {
                        sqlStmt += "'"+values[key1][key2] + "',"
                    } else {
                        sqlStmt += "'"+values[key1][key2] + "')"
                    }
                }
                if(k < v_count){
                    sqlStmt += "," 
                }
                
             }

            console.log(sqlStmt);
            
            
            pool.connect(function (err, client, done) {
                if (err) {
                    reject("[db error] " + err.code);
                    return helpFun.logErrror('error fetching client from pool ' + functionName + " - " + err);
                }
                client.query(sqlStmt, [], function (error, results) {
                    done();
                    if (error) {
                        reject("[db error] " + error.code);
                        return helpFun.logErrror('error at query execution ' + functionName + error.stack);
                    }
                    resolve(results.rowCount);
                });
            });
        } else {
            reject("[arguments error]  fields required");
        }

    });
};