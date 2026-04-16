document.getElementById('registerForm')?.addEventListener('submit',(e) => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const confirmpPassword = document.getElementById('confirmPassword').value

    if(!name || !email || !password || !confirmpPassword){
        showAlert('rgeisterAlert','Todos los datos son obligatorios')
        return 
    }

    if(password!==confirmpPassword){
        showAlert('registerAlert','Las contraseñas no son iguales')
        return 
    }

    //Simulacion de registro
    localStorage.setItem('userName',name)
    showAlert('registerAleert','Registro Satisfactorio')
    window.location.href = 'login.html'
})