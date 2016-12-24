// var request = require('request')
// var purest = require('purest')
// // var config = require('@purest/config')
// var facebook = new purest({provider:'facebook', promise:true})
//
// exports.getProfile = function(access_token) {
//   const references = ['id','first_name','last_name','email','birthday','gender','timezone','locale','location'];
//   return new Promise(function (resolve, reject) {
//     facebook.get('me?fields='+ references.join(','))
//       .auth(access_token)
//       .request(function (err, res, body) {
//         if (err) return reject(err)
//         resolve(body)
//       })
//   })
// };
