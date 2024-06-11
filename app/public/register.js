const mensajeError = document.getElementsByClassName('error')[0];



// capturamos el formulario de registro con la instruccion document.getElementById y le agregamos un listener para
// un evento Submit o de envio usando una funcion flecha. 

document.getElementById('register-form').addEventListener('submit',async(e)=> {
  e.preventDefault();
  console.log(e.target.children.user.value)
  // vamos a conectarnos con el backend
  const respuesta = await fetch("http://localhost:4000/api/register",{
    method:"POST",
    headers:{
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      user: e.target.children.user.value,
      email: e.target.children.email.value,
      password: e.target.children.password.value,
      phone: e.target.children.phone.value,

    })
  });
  if(!respuesta.ok) return mensajeError.classList.toggle("oculto", false);
  const resJson = await respuesta.json();
  if(resJson.redirect){
    window.location.href = resJson.redirect;
  }
})
