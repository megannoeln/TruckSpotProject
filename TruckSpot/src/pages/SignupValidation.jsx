function Validation(values){
    let errors = {}
    const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const phone_pattern = /^[0-9]{10}$/;

    if(!values.firstname || values.firstname === "") {
        errors.firstname = "Please fill your first name"
    }

    if(!values.lastname || values.lastname === "") {
        errors.lastname = "Please fill your last name"
    }

    if(!values.phone || values.phone === "") {
        errors.phone = "Please fill your phone number"
    } else if(!phone_pattern.test(values.phone)) {
        errors.phone = "Please enter a valid 10-digit phone number"
    }

    if(!values.email || values.email === "") {
        errors.email = "Please fill your email"
    } else if(!email_pattern.test(values.email)) {
        errors.email = "Invalid email address"
    }

    if(!values.password || values.password === "") {
        errors.password = "Please fill your password"
    } else if(values.password.length < 8) {
        errors.password = "Password must be at least 8 characters long"
    }

    return errors;
}

export default Validation;