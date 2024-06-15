//La libreria express nos permitira levantar nuestro servidor.
import express from "express";
import cookieParser from "cookie-parser";

//fix para __dirname
import path from 'path';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as authorization } from "./middlewares/authorization.js";




//Server
//creo una instancia de express
const app = express();

//defino el puerto que voy a utilizar
app.set("port",4000);
// le digo a express que escuche el puerto.
const server = app.listen(app.get("port"), () => {
  console.log("Servidor corriendo en puerto", app.get("port"));
});


//en mi servidor tengo que escribir el codigo necesario para acceder a todo lo que este a dentro de la carpeta
//public como archivos estaticos (se sirven tal cual como estan sin ninguna modificacion.)
//configuracion

app.use(express.static(__dirname + "/public"));
// tengo que configurar express para que lea json.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Rutas
//endpoints.
app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin",authorization.soloAdmin, (req,res)=> res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);

