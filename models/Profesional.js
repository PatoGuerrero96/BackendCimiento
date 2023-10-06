import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarid.js"

const profesionalSchema = mongoose.Schema({
    nombres:{
        type: String,
        required: true,
        trim: true
    },
    //cambias estos dos despues
    apellidos:{
        type: String,
        default: null,
        trim: true
    },
    rut:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true,
        default: 'Sin datos',

    },
    celularvisible:{
        type: Boolean,
        default: false
    },
    correovisible:{
        type: Boolean,
        default: false
    },

    token:{
        type: String,
        default: generarId(),

    },
    confirmado:{
        type:Boolean,
        default: false
    },
    fecha:{
        type:Date,
        default: Date.now(),
    
    },
    sexo:{
        type: String, 
        enum:['Masculino','Femenino','Hombre','Mujer','No específica','Sin datos'],
        default:'Sin datos',
         },
    fechaNacimiento:{
        type:Date,
        default: Date.now(),
        },     
    role: {
        type: String, 
        required: true,
        default: 'profesional',
         },
    especialidad: {
            type: String, 
            default:'Sin datos',
        },
        image:{
            public_id: String,
            secure_url: String,
        },
        presentacion: {
            type: String,
            default:null
        },
        celulartrabajo:{
            type: String,
            required:false,
        },
       emailtrabajo:{
            type: String,
            required:false,
        },
        numeroregistrosalud:{
            type: String,
            required:false,

        },
        firma:{
            public_id: String,
            secure_url: String,
        },
        tarifa:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Tarifa",
        },
        experiencia:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Experiencia",
        },
        educacion:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Educacion",
        },
    
})

profesionalSchema.pre("save",  async function(next){
    if(!this.isModified("password")){
        next();
    }
 const salt = await bcrypt.genSalt(10)
 this.password = await bcrypt.hash(this.password, salt);
})

profesionalSchema.methods.comprobarPassword = async function(
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
}
const Profesional = mongoose.model("Profesional", profesionalSchema);
export default Profesional;