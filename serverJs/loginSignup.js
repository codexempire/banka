class LoginSignup {
 constructor() {
  this.firstname = document.querySelector('#firstName');
  this.lastname = document.querySelector('#lastName');
  this.email = document.querySelector('#email');
  this.password = document.querySelector('#password');
  this.box = document.querySelector('.alert');
  this.endpoint = 'https://banka-pro-app.herokuapp.com';
 }
 signup() {
  console.log('works');
  const error = this.validateFields();
  console.log(error);
  if (error) {
   this.box.classList.add('alert-danger');
   this.box.innerHTML = `<i class='icofont-error'><i> ${error}`;
   return;
  }

  const data = {
   firstname: this.firstname,
   lastname: this.lastname,
   email: this.email,
   password: this.password
  };
  const method = {
   method: 'POST', // or 'PUT'
   body: data, // data can be `string` or {object}!
   headers: {
    'Content-Type': 'application/json'
   }
  }
  fetch('https://banka-pro-app.herokuapp.com/api/v1/auth/signup', data, method)
   .then(response => response.json())
   .then(data => this.connectUser(data))
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.innerHTML = `<i class='icofont-error'><i> ${err.message}`;
   });
  return;
 }
 validateFields() {
  console.log(this.firstname.value);
  if (!this.firstname.value) return 'Enter your Firstname';
  if (this.firstname.value.trim().replace(/\s+/g, '').length < 3) return 'Firstname must  have at least 3 alphabets';
  if (!this.lastname.value) return 'Enter your Lastname';
  if (this.lastname.value.trim().replace(/\s+/g, '').length < 3) return 'Lastname must  have at least 3 alphabets';
  if (!this.email.value) return 'Enter email';
  if (!this.password.value) return 'Enter password';
  if (this.password.value.trim().replace(/\s+/g, '').length < 8) return 'Password should contain at least 8 characters';
  return;
 }
 connectUser(data) {
  console.log(data);
  data.status === 201 ? this.redirect(data) : this.box.classList.add('alert-danger'); this.box.innerHTML = `<i class='icofont-error'><i> ${data.error || data.msg}`;
 }
}
