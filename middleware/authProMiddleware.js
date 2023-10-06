import jwt from 'jsonwebtoken';
import Profesional from '../models/Profesional.js';

const AuthPro= async(req, res , next ) =>{

let tokenPro;

if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
{
try {
    tokenPro = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(tokenPro, process.env.JWT_SECRET);
    req.profesional = await Profesional.findById(decoded.id).select(
        "-password -token -confirmado"      
    );
 

    return next();
    
} catch (error) {
    const errortoken = new Error("Token no valido ");
    res.status(403).json( {msg:errortoken.message} );
}
}

if(!tokenPro){
    const error = new Error("Token no valido o inexistente");
    res.status(403).json( {msg:error.message} );
}


next();
};

export default AuthPro;