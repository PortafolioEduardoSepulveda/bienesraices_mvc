import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) => {
    // Verificar si hay un token
    console.log(req.cookies);
    const { _token } = req.cookies
    if(!_token) {
        console.log("entro 1");
        return res.redirect('/auth/login')
    }
    // Comprobar el Token
    try {
        console.log("entro 2");
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        // Almacenar el usuario al Req
        if(usuario) {
            console.log("entro 3");
            req.usuario = usuario
        }  else {
            console.log("entro 4");
            return res.redirect('/auth/login')
        }
        console.log("entro 5");
        return next();
    } catch (error) {
        console.log("entro 6");
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default protegerRuta