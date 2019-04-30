class Signup { 
 constructor() {
  this.firstname = document.querySelector('#firstName');
  this.lastname = document.querySelector('#lastName');
  this.email = document.querySelector('#email');
  this.password = document.querySelector('#password');
  this.box = document.querySelector('.alert');
  this.btn = document.querySelector('#signup');
 }
 signup() {
  this.btn.disabled = true;
  this.btn.style.opacity = '0.5';
  this.btn.textContent = 'Creating...'
  const error = this.validateFields();
  if (error) {
   this.box.classList.add('alert-danger');
   this.box.innerHTML = `<i class='icofont-error'><i> ${error}`;
   this.btn.disabled = false;
   this.btn.style.opacity = '1';
   this.btn.textContent = 'Create'
   return;
  }
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
   firstname: this.firstname.value,
   lastname: this.lastname.value,
   email: this.email.value,
   password: this.password.value
  };
  const options = {
   method: 'POST',
   body: JSON.stringify(data),
   headers: new Headers({
    'Content-Type': 'application/json'
   })
  };
  fetch(`${endpoint}/api/v1/auth/signup`, options)
   .then(response => response.json())
   .then(res => this.connectUser(res))
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.innerHTML = `<i class='icofont-error'><i> ${err.message}`;
    this.btn.disabled = false;
    this.btn.style.opacity = '1';
    this.btn.textContent = 'Create';
   });
  return;
 }
 validateFields() {
  if (!this.firstname.value) {
   return 'Enter your Firstname';
  }
  if (this.firstname.value.trim().replace(/\s+/g, '').length < 3) {
   return 'Firstname must  have at least 3 alphabets';
  }
  if (!this.lastname.value) return 'Enter your Lastname';
  if (this.lastname.value.trim().replace(/\s+/g, '').length < 3) {
   return 'Lastname must  have at least 3 alphabets';
  }
  if (!this.email.value) {
   return 'Enter email';
  }
  // regex used for email validation gotten from stackoverflow
  if (!(/.+@[^@]+\.[^@]{2,}$/.test(this.email.value))) {
   return 'Enter a valid email';
  }
  if (!this.password.value) {
   return 'Enter password';
  }
  if (this.password.value.trim().replace(/\s+/g, '').length < 8) {
   return 'Password should contain at least 8 characters';
  }
  return;
 }
 connectUser(data) {
  if (data.status === 201) {
   this.redirect(data);
   return;
  }
   this.box.classList.add('alert-danger');
   this.box.innerHTML = `<i class='icofont-error'><i> ${data.error || data.msg}`;
   this.btn.disabled = false;
   this.btn.textContent = 'Create';
   this.btn.style.opacity = '1';
  return;
 }
 redirect(data) {
  this.box.classList.add('alert-success');
  this.box.innerHTML = `<i class = 'icofont-success'></i> Created User Redirecting...`;
  localStorage.setItem('user', JSON.stringify(data.data));
  setTimeout(() => { location.replace('profile.html'); }, 5000);
  return;
 }
}
