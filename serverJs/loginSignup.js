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
  this.btn.textContent = 'Creating...';
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
    this.box.innerHTML = `${err.message}`;
    this.btn.disabled = false;
    this.btn.style.opacity = '1';
    this.btn.textContent = 'Create';
   });
  return;
 }
 connectUser(data) {
  if (data.status === 201) {
   this.redirect(data);
   return;
  }
   this.box.classList.add('alert-danger');
   this.box.innerHTML = `${data.error || data.msg}`;
   this.btn.disabled = false;
   this.btn.textContent = 'Create';
   this.btn.style.opacity = '1';
  return;
 }
 redirect(data) {
  this.box.classList.add('alert-success');
  this.box.innerHTML = `Created User Redirecting...`;
  localStorage.setItem('user', JSON.stringify(data.data));
  setTimeout(() => { 
   location.replace('profile.html'); 
  }, 5000);
  return;
 }
}

class Logger { 
 constructor() {
  this.email = document.querySelector('#email');
  this.password = document.querySelector('#password');
  this.box = document.querySelector('.alert');
  this.btn = document.querySelector('#login');
 }
 access() {
  this.btn.disabled = true;
  this.btn.style.opacity = '0.5';
  this.btn.textContent = 'Login...';
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
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
  fetch(`${endpoint}/api/v1/auth/signin`, options)
   .then(response => response.json())
   .then(res => this.connectUser(res))
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.innerHTML = `${err.message}`;
    this.btn.disabled = false;
    this.btn.style.opacity = '1';
    this.btn.textContent = 'Login';
   });
  return;
 }
 connectUser(data) {
  if (data.status === 200) {
   this.redirect(data);
   return;
  }
   this.box.classList.add('alert-danger');
   this.box.innerHTML = `${data.error || data.msg}`;
   this.btn.disabled = false;
   this.btn.textContent = 'Login';
   this.btn.style.opacity = '1';
  return;
 }
 redirect(data) {
  this.box.classList.add('alert-success');
  this.box.innerHTML = `<i class = 'icofont-success'></i> Login successful Redirecting...`;
  localStorage.setItem('user', JSON.stringify(data.data));
  setTimeout(() => { 
   if(data.data.data.type==='staff') {
    location.replace('./admin/dashboard.html');
    return;
   }
   location.replace('profile.html');
   return;
  }, 5000);
  return;
 }
}
