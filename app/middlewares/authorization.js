import jsonWebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { usuarios } from "./../controllers/authentication.controller.js";

dotenv.config();

function soloAdmin(req,res,next){
  const logueado = revisarCookie(req);
  if (logueado) {
    return next();
    //return res.redirect("/")
  }else {
    return res.status(401).send({ status: "Error", message: "Para acceder a este recurso debe iniciar sesión" });
  }
  
}


function soloPublico(req,res,next){
  const logueado = revisarCookie(req);
  if (!logueado) return next();
  return res.redirect("/admin")
}

function revisarCookie(req){
  // // lo primero que haremos es leer la solicitud y ver si tiene una cookie adentro.
  try{
    const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
  
    console.log("COOKIE",cookieJWT)
    console.log(usuarios)
    
    const decodificada = jsonWebtoken.verify(cookieJWT,process.env.JWT_SECRET);
    console.log(decodificada);
    const usuarioARevisar = usuarios.find(usuario => usuario.email === decodificada.email);
    console.log(usuarioARevisar)

    if(!usuarioARevisar){
      return false
    }
      return true;
  }
  catch{
    return false;
  }
}


export const methods = {
  soloAdmin,
  soloPublico,
}