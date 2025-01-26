const showSpinner = (spinner)=>{
    spinner.classList.add('show')
}
const hideSpinner = (spinner)=>{
    spinner.classList.remove('show')
}

export const spinner_animation = {
    showSpinner,
    hideSpinner
}