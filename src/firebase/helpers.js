function validateEmail (email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

export const validateLoginData = formData => {
  const newErrors = {}

  if (!validateEmail(formData.email)) {
    newErrors.email = 'Invalid email address'
  }

  if (formData.email === '') {
    newErrors.email = "Can't be empty"
  }

  if (formData.password.length < 3) {
    newErrors.password = 'Not long enough'
  }
  if (formData.password === '') {
    newErrors.password = "Can't be empty"
  }
  if (formData.confirmPassword === '') {
    newErrors.confirmPassword = "Can't be empty"
  }

  if (
    formData?.confirmPassword &&
    formData.password !== formData.confirmPassword
  ) {
    newErrors.confirmPassword = 'Passwords do not match'
  }

  return newErrors
}
