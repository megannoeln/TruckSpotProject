function Validation(values) {
    let errors = {};
    const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const password_pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  

    if (!values.strEmail || values.strEmail === "") {
      errors.email = "Please fill your email";
    } else if (!email_pattern.test(values.strEmail)) {
      errors.email = "Invalid email address";
    }
  
    if (!values.strPassword || values.strPassword === "") {
      errors.password = "Please fill your password";
    } else if (!password_pattern.test(values.strPassword)) {
      errors.password =
        "Password must contain at least 8 characters, one uppercase letter, one number, and one special character.";
    }
    return errors;
  }
  
  export default Validation;
  