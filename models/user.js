const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const queue = require('../config/kue').kue;
const utilities = require('../config/libs/utilities');
const bcrypt = require('bcrypt');

// set up a mongoose model
var UserSchema = new Schema({
  username: {
        type: String,
        required: true,
        unique: true,
        index: true
  },
  email: {
        type: String,
        required: true,
        unique: true,
        index: true
  },
  password: {
        type: String,
        required: true,
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  apikey: { type: String, default: null },
  connectionsTokens: { type: Array },
  connections: {
    facebook: {type: String, default: null}
  },
  rights: {
      type: {type: String, enum: ['user', 'admin'], default: 'user'},
  },
  pictures: {
    avatar: {type: String, default: null},
    cover: {type: String, default: null}
  },
  infos: {
    description: {type: String, default: null},
    location: {type: String, default: null},
    gender: {type: String, default: null},
    website: {type: String, default: null}
  },
  followers: [{type: Schema.ObjectId, ref: 'User'}],
  following: [{type: Schema.ObjectId, ref: 'User'}],
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

//Transform
UserSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret.password;
         delete ret.social;
         delete ret.tokens;
         delete ret.resetPasswordToken;
         delete ret.resetPasswordExpires;
         delete ret.pictures;
         delete ret.infos;
         delete ret._id;
         delete ret.__v;
     }
});


/**
 * Password hash middleware.
 */
 UserSchema.pre('save', function (next) {
   // console.log(this);
   // console.log('Do anything...');
   var user = this;
   if (!user.isModified('password')) { return next(); }
   bcrypt.hash(user.password, 10, function(err, hash) {
     if (err) { return next(err); }
       // Store hash in your password DB.
       user.password = hash;
       next();
   });
 });

/**
 * Middleware for updating the date.
 */
UserSchema.pre('update', function() {
  this.update({},{ $set: { updated: new Date() } });
});

/**
 * Helper method for validating user's password.
 */
UserSchema.methods.comparePassword = function *(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

/**
 * Helper method for match user in the b.
 */
UserSchema.statics.matchUser = function *(email, password) {
  // console.log('email in helper model :'+email);
  // console.log('password in helper model :'+password);
  var user = yield this.findOne({ 'email': email }).exec();
  if (!user) throw new Error('User not found');
  if (user.comparePassword(password))
    return user;

  throw new Error('Password does not match');
};

/**
 * Send email to user
 */
UserSchema.pre('save', function (next) {

  // console.log(this);
  var html = utilities.emailHTML('Hello new user','Hello '+this.username+' ! <br><br> Your email: '+this.email);
  var data = {
    to: this.email,
    subject: 'Register',
    text: 'Hello '+this.username+' ! \n '+this.email,
    html: html
  };

    queue.create('email', data).priority('high').attempts(3).save();

    // On crée l'alert
    //  queue.create('alerts', {
    //     user: this._id,
    //     msg: 'Welcome to the site',
    //     type: 'warning'
    // }).priority('high').attempts(3).save();

  next();
});

mongoose.model('User', UserSchema);
