class Authet{
 constructor() {
  this.endpoint = 'https://banka-pro-app.herokuapp.com';
  this.email = document.querySelector('#email').value;
  this.password = document.querySelector('#password').value;
  this.box = document.querySelector('.alert');
 }
 
 logIn() {
  const error = this.auth();
  console.log(error);

  if (error) {
   // error
   this.box.classList.add('alert-danger');
   this.box.innerHTML = `<i class='icofont-error'><i> ${error}`;
   return;
  }

  fetch(`${this.endpoint}/api/vi/auth/signin`)
   .then(res => res.json())
   .then(data => logUser(data))
   .catch(err => {
    // error
    err = JSON.parse(JSON.stringify(err));
    this.box.classList.add('alert-danger');
    this.box.innerHTML = `<i class='icofont-error'><i> ${err.error}`;
   });
 }

 auth() {
  if (!this.email || this.email.trim() === '') {
   // error
   return 'Enter an email address';
  }
  // regex for email validation from stack overflow
  if (!(/^\S+@\S+\.\S+$/.test(this.email))) {
   return 'Enter a valid email';
  }

  if(!this.password || this.password.trim() === ''){
   // error
   return 'Enter your password';
  }

  if (this.password.length < 8) {
   // too short
   return 'Enter password of at least 8 characters';
  }

  // test passed
  return null;
 }
}