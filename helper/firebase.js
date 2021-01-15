var admin = require("firebase-admin");
var serviceAccount = require("../cert/spyce-minig-firebase-adminsdk-qu6a3-4f64270ea1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spyce-minig.firebaseio.com"
});

var registrationToken = "elvO1qQOfRE:APA91bHBv1W6NJPooU7bfVQ5AlKaeypsZkTOzWE85f8JDpa41RR4TMch8wd_uPpkmV_8mQ0e2ONcejYBdVk9TR71inOwAqRNfZMzVeQLS4nRjN9gPLyO52Xz0HwUYvf6bKLPX2vYYVDK"
// var payload = {
//   data : {
//     myKey1 : "hello"
//   }
// }

// var payload = {
//   notification: {
//     title: "This is a Notification",
//     body: "This is the body of the notification message."
//   }
// };

var payload = {
  notification: {
    title: "Account Deposit",
    body: "A deposit to your savings account has just cleared."
  },
  data: {
    account: "Savings",
    balance: "$3020.25"
  }
};

var options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};

// admin.messaging().sendToDevice(registrationToken, payload, options).then(response =>{
//   console.log("Successfully sent message : ",response)
// }).catch(error => {
//   console.log("Error sending message : ", error)
// })

// admin.messaging().subscribeToTopic(registrationToken, "test").then(response => {
//   console.log("Successfully Subscribed : ", response)
// }).catch(error => {
//   console.log("Error on Subscribe : ", error)
// })

admin.messaging().sendToTopic("test", payload, options).then(response => {
  console.log("Successfully sent message : ", response)
}).catch(error => {
  console.log("Error sending message : ", error)
})

// admin.messaging().sendToCondition("'test' in topics", payload, options).then(response => {
//   console.log("Successfully sent message : ", response)
// }).catch(error => {
//   console.log("Error sending message : ", error)
// })


// admin.messaging().send(payload).then(response => {
//   console.log("Successfully sent message : ", response)
// }).catch(error => {
//   console.log("Error sending message : ", error)
// })

module.exports.sendToDevice = (device_token) => {
  if (device_token && device_token != 'undefined' && device_token != undefined)
    return admin.messaging().sendToDevice(device_token, payload, options)
}