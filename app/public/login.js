const mensajeError = document.getElementsByClassName("error")[0];


// capturamos el formulario de login con la instruccion document.getElementById y le agregamos un listener para
// un evento Submit o de envio usando una funcion flecha. 

document.getElementById('login-form').addEventListener('submit',async(e)=> {
  e.preventDefault();
  const email = e.target.children.email.value;
  const password = e.target.children.password.value;
  const respuesta= await fetch("http://localhost:4000/api/login",{
    method:"POST",
    headers: {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({
      email,password
    })
  });
  if(!respuesta.ok) return mensajeError.classList.toggle("oculto",false);
  const resJson = await respuesta.json();
  if (resJson.redirect){
    window.location.href = resJson.redirect;
  }
})