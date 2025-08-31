// app/models/user.server.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 50,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 50,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,                 // predefined modifier
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    index: true                      // secondary index (non-unique)
  },
  username: {
    type: String,
    trim: true,                      // predefined modifier
    lowercase: true,                 // predefined modifier (use uppercase: true if your text prefers)
    required: [true, 'Username is required'],
    unique: true,                    // unique index
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username must be at most 30 characters'],
    match: [/^[a-z0-9._-]+$/, 'Username may contain letters, numbers, dot, underscore, and hyphen only']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
    // If your course wants it hidden by default, add: select: false
  },

  // Custom setter + getter example field
  website: {
    type: String,

    // custom setter: normalize before save
    set: function (url) {
      if (!url) return url;
      const startsWithHttp = url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
      return startsWithHttp ? url : 'http://' + url;
    },

    // custom getter: normalize on read (useful for legacy data)
    get: function (url) {
      if (!url) return url;
      const startsWithHttp = url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
      return startsWithHttp ? url : 'http://' + url;
    },

    trim: true                       // predefined modifier
  },

  // Defining default values (created date)
  created: {
    type: Date,
    default: Date.now
  }
});

// Virtual attribute: fullName (getter + setter)
UserSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`.trim();
  })
  .set(function (fullName) {
    const splitName = String(fullName || '').split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName.slice(1).join(' ') || '';
  });

// Include getters and virtuals in JSON/objects (important for custom getters/virtuals)
UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.set('toObject', { getters: true, virtuals: true });

module.exports = mongoose.model('User', UserSchema);
