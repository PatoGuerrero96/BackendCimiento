import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const checkAuth = async(req, res , next ) =>{

let tokenAdm;

if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
{
try {
    tokenAdm = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(tokenAdm, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select(
        "-password -token -confirmado"
    );
    return next();
    
} catch (error) {
    const errortoken = new Error("Token no valido ");
    res.status(403).json( {msg:errortoken.message} );
}
}

if(!tokenAdm){
    const error = new Error("Token no valido o inexistente");
    res.status(403).json( {msg:error.message} );
}


next();
};

export default checkAuth;