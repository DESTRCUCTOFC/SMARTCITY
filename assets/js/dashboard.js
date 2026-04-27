import { observeAuth,logoutUser ,getCurrentUserProfile, showAlert, setButtonLoading, updateCurrentUserProfile, hideAlert } from "./auth.js"

//Import nuevo fase 3 
import { getCityWeather,formatWeatherUpdateTime } from "./weather.js"

const userName = document.getElementById('userName')
const navUserName = document.getElementById('navUserName')
const userEmail = document.getElementById('userEmail')
const favoriteCity = document.getElementById('favoriteCity')
const logoutBtn = document.getElementById('logoutBtn')

// Constantes nuevas para el clima 
const refreshWeatherBtn = document.getElementById('refreshWeatherBtn')
const weatherAlert = document.getElementById('weatherAlert')
const weatherLoading = document.getElementById('weatherLoading')
const weatherContent = document.getElementById('weatherContent')
const weatherCityName = document.getElementById('weatherCityName')
const weatherDescription = document.getElementById('weatherDescription')
const weatherTemperature = document.getElementById('weatherTemperature')
const weatherApparentTemp = document.getElementById('weatherApparentTemp')
const weatherHumidity = document.getElementById('weatherHumidity')
const weatherWind = document.getElementById('weatherWind')
const weatherCoords = document.getElementById('weatherCoords')
const weatherUpdateAt = document.getElementById('weatherUpdateAt')
const weatherIcon = document.getElementById('weatherIcon')

//constantes parsa el perfil
const editProfileForm = document.getElementById('editProfileForm')
const editName = document.getElementById('editName')
const editEmail = document.getElementById('editEmail')
const editCity = document.getElementById('editCity')
const editprofileBtn = document.getElementById('editProfileBtn')

const editProfileModalElement = document.getElementById('editProfileModal')
const editProfileModal = editProfileElement ? bootstrap.Modal.getOrCreateInstance(editProfileModalElement) : null



// Funciones de clima 

let currentFavoriteCity =''

const showWeatherAlert = message =>{
    weatherAlert.textContent = message 
    weatherAlert.classList.remove('d-none')
}
const hideWeatherAlert = () => {
    weatherAlert.textContent = ''
    weatherAlert.classList.add('d-none')
}

const setWeatherLoading = isLoading =>{
    weatherAlert.classList.toggle('d-none' , !isLoading) 
    refreshWeatherBtn.disabled = isLoading
}

const hideWeatherContent = () => {
    weatherContent.classList.add('d-none')
}

const showWeatherContent = () => {
    weatherContent.classList.remove('d-none')
}
const builLocationLabel = location => {
    const parts = [location.name]
    if(location.country){
        parts.push(location.admin1)
    }
    if(location.country) {
        parts.push(location.country)
    }
    return parts.join(", ")
}

const  renderProfile = (user,profile) => {
    const resolvedName  = profile?.name || user.eamil?.split('@') [0] || Usuario
    const resolvedEmail = profile?.email || user.email || '-'
    const resolvedCity = profile?.favoriteCity?.trim() || ''

    userName.textContent = resolvedName
    navUserName.textContent = resolvedName
    userEmail.textContent = resolvedEmail
    favoriteCity.textContent = resolvedCity || 'No definida'

    editName.value = resolvedName
    editEmail.value = resolvedEmail
    editCity.value = resolvedCity 

    currentFavoriteCity = resolvedCity



}

const reloadProfileAndWeather = async () => {
    if(!currentUser) {
        return 
    }

    const profile = await getCurrentUserProfile(currentUser.uid)
    currentProfile = profile 
    renderProfile(currentUser,profile)
    await loadWeather(currentFavoriteCity)
}

const loadWeather = async (city)=>{
    if(!city){
        hideWeatherContent()
        showWeatherAlert('No tienes una ciudad cargada')
        return 
    }

const renderWeather = weatherData =>{
    const {location,current,weatherInfo} = weatherData
    console.log('@@ render - weather => ', {location,current,weatherInfo})

    weatherCityName.textContent = builLocationLabel(location)
    weatherDescription.textContent = weatherInfo.label 
    weatherTemperature.textContent = `${Math.round(current.temperature_2m)} °C`
    weatherApparentTemp.textContent = `${Math.round(current.apparent_temperature_2m)} °C`
    weatherHumidity.textContent = `${current.relative_humidity_2m}%`
    weatherWind.textContent = `${current.wind_speed_10m}Km/h`
    weatherCoords.textContent = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    weatherUpdateAt.textContent = formatWeatherUpdateTime(current.time)
    weatherIcon.className = `bi ${weatherInfo.icon } weather-main-icon`
    showWeatherContent()
}

    hideWeatherAlert()
    hideWeatherContent()
    setWeatherLoading(true)

    try {
        const weatherData = await getCityWeather(city)
        console.log('@@@ weather =>',weatherData)
        renderWeather(weatherData)
    } catch (error) {
        hideWeatherContent()
        showWeatherAlert(error.message || 'No se encontro el clima')
    } finally{
        setWeatherLoading(false)
    }
}
//terminan funciones de clima


observeAuth( async (user) => {
    if(!user){
        window.location.href = './../../login.html'
        return 
    }
    try {
        currentUser = user
        const profile = await getCurrentUserProfile(user.uid)
        currentProfile = profile
        renderProfile(user,profile)

        await loadWeather(currentFavoriteCity)
    } catch (error) {
        showWeatherAlert('No fue posible cargar tu perfil')
    }


    

})

logoutBtn?.addEventListener('click',async() => {
    await logoutUser()
    window.location.href = './../../login.html'

})

editProfileForm?.addEventListener('submit',async (event) => {
    event.preventDefault()

    hideAlert('profileAlert')
    hideAlert('profileSuccess')

    const name=editName.value.trim()
    const city = editCity.value.trim()

    if(!name){
        showAlert('profilelAlert','El nombre es obligatorio')
    }
    if(!city){
        showAlert('profileAlert','La ciudad es obliogatoria')
    }

    try {
        setButtonLoading(
            saveProfileBtn,
            true,
            '<i class ="bi bi-check-circle m2"></i> Guardar Cambios','Guardando...'
        )

        await updateCurrentUserProfile(currentUser.uid,{
            name,
            favoriteCity: city
        })

        showAlert('profileSuccess' , 'Perfil Actualizado')
        await reloadProfileAndWeather()
        setTimeout(() =>{
            editProfileModal?.hide()
            hideAlert('profileSuccess')
        },1500)

    }catch(error){
        showAlert('profileAlert',error.message || 'No se pudo actualizar')

    }finally{
        setButtonLoading(
            saveProfileBtn,
            false,
            '<i class ="bi bi-check-circle m2"></i> Guardar Cambios'
        )
    }
})