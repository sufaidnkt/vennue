const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('error', function (err) {
    console.log('Something went wrong ', err)
});

const { promisify } = require('util');
// const getAsync = promisify(redisClient.get).bind(redisClient);
// const setAsync = promisify(redisClient.set).bind(redisClient);
module.exports.getAsync = promisify(redisClient.get).bind(redisClient);
module.exports.setAsync = promisify(redisClient.set).bind(redisClient);

// setAsync('mykey', "abc").then((res) => {
//     console.log(res);
// }).catch((error) => {
//     console.log(error);
// });

// getAsync('mykey').then((res) => {
//     console.log(res);
// }).catch((error) => {
//     console.log(error);
// });
// // callback based method
// redisClient.set('my test key', 'my test value', redis.print);
// redisClient.get('my test key', function (error, result) {
//   if (error) throw error;
//   console.log('GET result ->', result)
// });



// *************************** Redis CODE START  ***************************
// const redis = require('./helper/redis')

// redis.setAsync('mykey', new Date().getTime()).then((res) => {
//     console.log(res);
// }).catch((error) => {
//     console.log(error);
// });

// redis.getAsync('mykey').then((res) => {
//     console.log(res);
// }).catch((error) => {
//     console.log(error);
// });
// *************************** Redis CODE END   ***************************