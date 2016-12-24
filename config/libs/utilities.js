'use strict';

var jwt = require('koa-jwt');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../env/'+env+'.js');

exports.randomString = function(size) {
    var liste = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
    var result = '';
    for (var i = 0; i < size; i++) {
        result += liste[Math.floor(Math.random() * liste.length)];
    }
    return result;
};

exports.emailHTML = function(title, text) {
  var result = '<!DOCTYPE html><html lang=en><meta content="text/html; charset=UTF-8"http-equiv=Content-Type><meta content="width=device-width,initial-scale=1"name=viewport><meta content="IE=edge"http-equiv=X-UA-Compatible><meta content="telephone=no"name=format-detection><title>'+title+'</title><style>body{margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-spacing:0}table td{border-collapse:collapse}.ExternalClass{width:100%}.ExternalClass,.ExternalClass div,.ExternalClass font,.ExternalClass p,.ExternalClass span,.ExternalClass td{line-height:100%}.ReadMsgBody{width:100%;background-color:#ebebeb}table{mso-table-lspace:0;mso-table-rspace:0}img{-ms-interpolation-mode:bicubic}.yshortcuts a{border-bottom:none!important}@media screen and (max-width:599px){.container,.force-row{width:100%!important;max-width:100%!important}}@media screen and (max-width:400px){.container-padding{padding-left:12px!important;padding-right:12px!important}}.ios-footer a{color:#aaa!important;text-decoration:underline}</style><body bgcolor=#F0F0F0 leftmargin=0 marginheight=0 marginwidth=0 style=margin:0;padding:0 topmargin=0><table border=0 cellpadding=0 cellspacing=0 width=100% bgcolor=#F0F0F0 height=100%><tr><td align=center style=background-color:#F0F0F0 bgcolor=#F0F0F0 valign=top><br><table border=0 cellpadding=0 cellspacing=0 width=600 class=container style=width:600px;max-width:600px><tr><td align=left style=font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:700;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px class="container-padding header">SecretProject<tr><td align=left style=padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#fff class="container-padding content"><br><div class=title style=font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;color:#374550>'+title+'</div><br><div class=body-text style=font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333>'+text+'</div><tr><td align=left style=font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:16px;color:#aaa;padding-left:24px;padding-right:24px class="container-padding footer-text"><br><br><a href=http://www.acme-inc.com style=color:#aaa>www.acme-inc.com</a> - © 2016 Secret Project.<br><br>You are receiving this email because you opted in on our website. Update your <a href=# style=color:#aaa>email preferences</a> or <a href=# style=color:#aaa>unsubscribe</a>.<br><br></table></table>';

    return result;
};

exports.createJwt = function(profile) {
    return jwt.sign(profile, config.server.secret, {
        expiresIn: '2h'
    });
};
