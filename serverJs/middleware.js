class validator {
 contructor(firstname, lastname, email, password) {
  this.firstname = firstname;
  this.lastname = lastname;
  this.email = email;
  this.password = password;
 }
 validateFields(firstname,lastname,email,password) {
  if (!firstname) return 'Enter your Firstname';
  if (firstname.trim().replace(/\s+/g, '').length < 3) return 'Firstname must  have at least 3 alphabets';
  if (!lastname) return 'Enter your Lastname';
  if (lastname.trim().replace(/\s+/g, '').length < 3) return 'Lastname must  have at least 3 alphabets';
  if (!email) return 'Enter email';
  if (!password) return 'Enter password';
  if (password.trim().replace(/\s+/g, '').length < 8) return 'Password should contain at least 8 characters';
  return false;
 }
}