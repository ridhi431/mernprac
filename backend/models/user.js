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
    bio: { type: String, default: '', trim: true },  
    photo: { type: String, default: '', trim: true }
},{ timestamps: true })

userschema.pre("save", async function(next){
    if(!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
});

userschema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const user = mongoose.model("user", userschema);
module.exports = user;