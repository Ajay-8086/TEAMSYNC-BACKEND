//checking email format
function emailValidation(email:string){
    const emialRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emialRegex.test(email)
}
// checking password format
function passwordValidation(password:string){
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password)
} 
// checking all fields are provided
function validatioField(fields:string[]){
    return fields.every(field=>field)
}
// password and confirm password match
function passwordMatch(password:string,confirmPwd:string){
    return password === confirmPwd
}

export default {
    emailValidation,
    passwordValidation,
    validatioField,
    passwordMatch
}