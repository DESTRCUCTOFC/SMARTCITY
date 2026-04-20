import { hideAlert, showAlert , setButtonLoading , registerUser , getFirebaseErrorMessage } from "./auth.js"

const form = document.getElementById('registerForm')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const cityInput = document.getElementById('city')
const passwordInput = document.getElementById('password')
const confirmPasswordInput = document.getElementById('confirmPassword')
const registerBtn = document.getElementById('registerBtn')
const successBox = document.getElementById('registerSuccess')


form?.addEventListener('submit',(e) => {
    e.preventDefault()

    hideAlert('registerAlert')
    successBox.classList.add('d-none')
    successBox.textContent = ''


    const name = nameInput.value.trim()
    const email = emailInput.value.trim()
    const favoriteCity = cityInput.value.trim()
    const password = passwordInput.value.trim()
    const confirmPassword = confirmPasswordInput.value.trim()

    if(!name || !email || !password || !confirmPassword){
        showAlert('registerAlert','Todos los datos son obligatorios')
        return 
    }

    //Agregar if para contraseña menor a 6 caracateres 
    if (password.length < 6) {
    showAlert('registerAlert', 'La contraseña debe tener al menos 6 caracteres');
    return;
}
    if(!password )

    if(password!==confirmPassword){
        showAlert('registerAlert','Las contraseñas no son iguales')
        return 
    }

    try {
            setButtonLoading(
                registerBtn,
                true,
                '<i class = "bi bi-box-arrow-in-right me-2"></i>Crear Cuenta ,Creando Cuenta'
            )
            await registerUser({name,email,password,favoriteCity})

            successBox.textContent = 'Cuenta creada correctamente'
            successBox.classList.remove = 'd-none'

            setTimeout(() => {
                window.location.href = './../../dashboard.html'

            },1200)

        } catch (error) {
            showAlert('registerAlert',getFirebaseErrorMessage(error))
        }finally{
            setButtonLoading(
                registerBtn,
                false,
                '<i class = ""bi bi-box-arrow-in-right me-2></i>Crear Cuenta'
            )
            
        }

})