import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarid.js";

const adminSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true,
    },
    apellidos:{
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: false,
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    telefono:{
        type: String,
        default: null,
        trim: true,
    },
    rut: {
        type:String,
        default : null,

    },
    token:{
        type: String,
        default: generarId(),

    },
    confirmado: {
        type: Boolean,
        default: false,
    },
    fecha:{
        type:Date,
        default: Date.now(),

    }


});

adminSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
const salt = await bcrypt.genSalt(10)
this.password = await bcrypt.hash(this.password, salt)
} );

adminSchema.methods.comprobarPassword =  async function(
passwordFormulario
){
return await bcrypt.compare(passwordFormulario, this.password);
};
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;