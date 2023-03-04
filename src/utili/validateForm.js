function validateForm(formData) {
  const errors = {};

  if (!formData.name) {
    errors.name = "Please enter a name";
  } else if (formData.name.includes(" ")) {
    errors.name = "Please enter a valid name without space";
  }

  if (!formData.email) {
    errors.email = "Please enter an email address";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Please enter password";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  if (!formData.file) {
    errors.file = "Please upload an avartar";
  }

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid };
}

export default validateForm;
