// para encriptar la contraseña del usuario voy a importar una de las librerias que se descargaron
import bcryptjs from "bcryptjs";
import jsonWebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const usuarios = [{
  user: "Jose David Gonzalez",
  email: "programacionjose2@gmail.com",
  password: "$2a$05$7YK1r03OKnR0/OaIws/ty.dVZGX9h1Ul4/wiX1ERdZjVQ5GDF6ciO",
  phone: "3102569291"
},
{
  user: "Lina Gonzalez",
  email: "linagonzalezguevara@hotmail.com",
  password: "lina",
  phone: "3173799232"
}]

// $2a$05$7YK1r03OKnR0/OaIws/ty.dVZGX9h1Ul4/wiX1ERdZjVQ5GDF6ciO

async function login(req,res){
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  if(!email || !password){
    return res.status(400).send({status:"Error",message:"Los campos estan incompletos."})
  }
  const usuarioARevisar = usuarios.find(usuario => usuario.email === email);
  if (!usuarioARevisar){
    return res.status(400).send({status:"Error",message:"Error durante el login"})
  }
  // aca vamos a revisar que la contraseña hasheada coincida con la ingresada.
  const loginCorrecto = await bcryptjs.compare(password,usuarioARevisar.password);
  // ahrora generaramos token de autorizacion 
  if (!loginCorrecto){
    return res.status(400).send({status:"Error",message:"Error durante el login"})
  }
  const token = jsonWebtoken.sign(
    {email:usuarioARevisar.email},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXPIRATION})

    // inicia proceso de creacin de cookie
    const cookieOption = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 *60 *1000),
      path: "/"
    }
    // tenemos que mandarle la cookie al cliente
    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok",message: "Usuario logueado.",redirect: "/admin"})
}

async function register(req,res){
  
  const user = req.body.user;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  if(!user || !email || !password || !phone){
     return res.status(400).send({status:"Error",message:"Los campos estan incompletos."})
  }
  const usuarioARevisar = usuarios.find(usuario => usuario.email === email);
  if (usuarioARevisar){
    return res.status(400).send({status:"Error",message:"Este usuario ya existe."})
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password,salt);
  const nuevoUsuario = {
    user, email, password: hashPassword, phone
  }
  console.log(nuevoUsuario);
  usuarios.push(nuevoUsuario);
  console.log(usuarios);
   return res.status(201).send({status:"ok",message:`Usuario ${nuevoUsuario.user} Agregado`,redirect:"/"})
}

export const methods = {
  login,
  register
}