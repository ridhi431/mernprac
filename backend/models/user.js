const mongoose = require ("mongoose");
const bcrypt = require ('bcrypt')

const userschema = new mongoose.Schema({
    name: {
        type: String,   
        required: true
    },
    email: {
        type: String,   
        required: true,
        unique: true
    },
    password: {  type: String, 
        required: true
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    bio: { type: String, default: '', trim: true },  
    photo: { type: String, default: '', trim: true }
},{ timestamps: true })

userschema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const user = mongoose.model("user", userschema);
module.exports = user;