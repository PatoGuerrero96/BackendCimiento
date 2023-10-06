import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarid.js"
import sjcl from "sjcl";
const pacienteSchema = mongoose.Schema({
    nombres:{
        type: String,
        required: true,
        trim: true
    },
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
        default: 'Sin datos',

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
        enum:['Hombre','Mujer','No especifica','Sin datos'],
        default:'Sin datos',
         },
    fechaNacimiento:{
        type:Date,
        required:false,
        },  
    contacto:{
        type: String, 
        enum:['Whatsapp','Correo','Celular','Sin datos'],
        default:'Correo',
            },

    image:{
        public_id: String,
        secure_url: String,
    },
    historiaclinica:{
        fumador:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        alcohol:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        drogas:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        dolor:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        actividadfisica:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        obsactividadfisica:{
            type: String, 
            default:'Sin datos',
        },
        vacuna:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        farmaco:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        farmacoprevio:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        quirurgico:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        ObsFumador:{
            type:String,
            default:'Sin datos'
        },
        alergia:{
            type: String, 
        enum:['Si','No','Sin datos'],
        default:'Sin datos',
        },
        enfermedad:{
         type: String, 
        enum:['Si','No','Sin datos'],
        default:'Sin datos',
        },
        enfermedad:{
            type: String, 
           enum:['Si','No','Sin datos'],
           default:'Sin datos',
           },
        estadogeneral:{
        type: String, 
        enum:['0','1','2','3','4','5','6','7','8','9','10','Sin datos'],
        default:'Sin datos',
        },
        estadogeneralpregunta:{
            type: String, 
            enum:['Si','No','Sin datos','Terminado'],
            default:'Sin datos',
            },
        sueño:{
            type: String, 
            enum:['0','1','2','3','4','5','6','7','8','9','10','Sin datos'],
            default:'Sin datos',
            },
    
        sueñopregunta:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
            },
        saludmental:{
            type: String, 
            enum:['0','1','2','3','4','5','6','7','8','9','10','Sin datos'],
            default:'Sin datos',
            },
        saludmentalpregunta:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
            },
        dolorpregunta:{
            type: String, 
            enum:['Si','No','Sin datos'],
             default:'Sin datos',
            },
            procesopreguntas:{
            type: String, 
            enum:['iniciado','terminado'],
             default:'iniciado',
            },
        alimentacion:{
            type: String, 
            enum:['0','1','2','3','4','5','6','7','8','9','10','Sin datos'],
            default:'Sin datos',
            },
        antecedentesfam:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },
        hospitalizaciones:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        } ,
        urgencia:{
            type: String, 
            enum:['Si','No','Sin datos'],
            default:'Sin datos',
        },     
    },
    obsactividadfisica:{
        type: String, 
        default:null,
    },
    obsalcohol:{
        type: String, 
        default:null,
    },
    obsdrogas:{
        type: String, 
        default:null,
    },
    obsfumador:{
        type: String, 
        default:null,
    },
    obssaludmental:{
        type: String, 
        default:null,
    },
    localidad:{
        type: String, 
        default:null
    },
    ocupacion:{
        type: String, 
        default:null
    },
    previsionsalud:{
        type: String, 
        default:null
    },
    escolaridad:{
        type: String, 
        default:null
    },
    lugardeatencion:{
        type: String, 
        default:null
    },
    gestaciones:{
        type: String, 
        default:null
    },
    perdidas:{
        type: String, 
        default:null
    },
    partos:{
        type: String, 
        default:null
    },
    cesareas:{
        type: String, 
        default:null
    },
    menarquia:{
        type: String, 
        default:null
    },
    ultimaregla:{
        type: String, 
        default:null
    },
    ultimopap:{
        type: String, 
        default:null
    },
    audit:{
        preguntauno:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        },
        preguntados:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntatres:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntacuatro:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntacinco:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntaseis:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntasiete:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntaocho:{
            type: Number, 
            enum:[1,2,3,4,0],
            default:null
        }, 
        preguntanueve:{
              type: Number, 
            enum:[0,2,4],
            default:null
        }, 
        preguntadiez:{
            type: Number, 
            enum:[0,2,4],
            default:null
        }, 
        },
    enfermedades:{ 
         type: mongoose.Schema.Types.ObjectId,
        ref:"Enfermedad",
    },
    
    horariopaciente: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HorarioPaciente'
    }]


       
    }  
)

pacienteSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  if (this.isNew) {
    // Encriptar el campo "rut" utilizando sjcl
    this.rut = encriptarDato(this.rut);
    this.nombres = encriptarDato(this.nombres);
    this.apellidos = encriptarDato(this.apellidos);
  }

  next();
});
// Función para encriptar un dato con sjcl
function encriptarDato(dato) {
    const clave = '1234567890123456';
    const datoEncriptado = sjcl.encrypt(clave, dato);
    return datoEncriptado;
  }

pacienteSchema.methods.comprobarPassword = async function(
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
}
const Paciente = mongoose.model("Paciente", pacienteSchema);
export default Paciente;