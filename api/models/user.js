var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var queue = require('../../config/kue').kue;
var bcrypt = require('bcrypt');

// set up a mongoose model
var UserSchema = new Schema({
  username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
  password: {
        type: String,
        required: true,
    },
  email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
  apikey: { type: String, default: null },
  rights: {
        type: {type: String, enum: ['user', 'admin'], default: 'user'},
    },
  pictures: {
        avatar: {type: String, default: null},
        cover: {type: String, default: null},
    },
  informations: {
        // genre: {type: String, enum: ['male', 'femal']},
        description: {type: String, default: null},
        location: {type: String, default: null},
        website: {type: String, default: null},
    }
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

//Transform
UserSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret.password;
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
UserSchema.statics.matchUser = function *(username, password) {
  // console.log('username in helper model :'+username);
  // console.log('password in helper model :'+password);
  var user = yield this.findOne({ 'username': username }).exec();
  if (!user) throw new Error('User not found');
  if (yield user.comparePassword(password))
    return user;

  throw new Error('Password does not match');
};



/**
 * Helper method for getting user's gravatar.
 */
// UserSchema.methods.gravatar = function (size) {
//   if (!size) {
//     size = 200;
//   }
//   if (!this.email) {
//     return `https://gravatar.com/avatar/?s=${size}&d=retro`;
//   }
//   const md5 = crypto.createHash('md5').update(this.email).digest('hex');
//   return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
// };

/**
 * Send email to user
 */
UserSchema.pre('save', function (next) {
  // console.log(this);

    queue.create('email', {
       title: 'Welcome to the site'
     , to: 'user@example.com'
     , template: 'welcome-email'
   }).priority('high').attempts(3).save();

  next();
});

mongoose.model('User', UserSchema);
