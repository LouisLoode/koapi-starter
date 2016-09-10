var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var MessageSchema = new Schema({
  name: {
        type: String,
        required: true,
        //unique: true
    },
  content: {
        type: String,
        required: true
    },
  validated:  Boolean
},{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

//Transform
MessageSchema.set('toJSON', {
     transform: function (doc, ret, options) {
         ret.id = ret._id;
         delete ret._id;
         delete ret.__v;
     }
});

// MessageSchema.pre('save', function (next) {
//   // console.log(this);
//    console.log('Do anything...');
//   next();
// });

mongoose.model('Message', MessageSchema);
