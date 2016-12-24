var request = require('request');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('../config/env/'+env);

module.exports = function (job, done) {
    // console.log('data:');
    // console.log(job.data);

    var options = { method: 'POST',
      url: 'https://api.mailgun.net/v3/yummyti.me/messages',
      qs:
       { from: config.mailgun.from,
         to: job.data.to,
         subject: job.data.subject,
         text: job.data.text ,
         html: job.data.html
       },
      headers: { authorization: 'Basic '+ new Buffer('api:'+config.mailgun.api_key).toString('base64') } };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

        if (body === 'Forbidden'){
            console.log(body);
        } else {
            console.log('POST mailgun');
        }
      done();
    });
}
