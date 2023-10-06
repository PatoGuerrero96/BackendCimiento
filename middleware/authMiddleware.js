import jwt from "jsonwebtoken"
import Paciente from "../models/Paciente.js";
const Auth = async (req, res, next)=> {

    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.paciente = await Paciente.findById(decoded.id).select("-password -token -confirmado");
            return next();

        } catch (error) {
            const e = new Error ("Token no Válido");
           return res.status(403).json({msg:e.message});
        }
    }
    if(!token){
        const e = new Error ("Token Inexistente");
            res.status(403).json({msg:e.message});
    }


    next();
}
export default Auth;