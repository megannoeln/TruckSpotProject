function Validation(values) {
  let errors = {};
  const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const phone_pattern = /^[0-9]{10}$/;

  if (!values.firstname.trim()) {
    errors.firstname = "Please fill your first name";
  }

  if (!values.lastname.trim()) {
    errors.lastname = "Please fill your last name";
  }

  if (!values.phone || values.phone === "") {
    errors.phone = "Please fill your phone number";
  } else if (!phone_pattern.test(values.phone)) {
    errors.phone = "Please enter a valid 10-digit phone number";
  }

  if (!values.email || values.email === "") {
    errors.email = "Please fill your email";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Invalid email address";
  }

  const password_pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!values.password || values.password === "") {
    errors.password = "Please fill your password";
  } else if (!password_pattern.test(values.password)) {
    errors.password =
      "Password must contain at least 8 characters, one uppercase letter, one number, and one special character.";
  }

  if (!values.confirmPassword || values.confirmPassword === "") {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default Validation;
