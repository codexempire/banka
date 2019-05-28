class UserInformation { 
 constructor() {
  this.firstname = document.querySelector('#firstName');
  this.lastname = document.querySelector('#lastName');
  this.email = document.querySelector('#email');
  this.password = document.querySelector('#password');
  this.box = document.querySelector('.alert');
  this.btn = document.querySelector('#signup');
 }
 disableButton(text) {
  this.btn.disabled = true;
  this.btn.style.opacity = '0.5';
  this.btn.textContent = text;
 }
 enableButton(text) {
  this.btn.disabled = false;
  this.btn.textContent = text;
  this.btn.style.opacity = '1';
  return;
 }
 error(data) {
  this.box.classList.add('alert-danger');
  this.box.innerHTML = `${data.error || data.msg}`;
  return;
 }
 connectUser(data, info, btnInfo) {
  if (data.status === 201 || data.status === 200) {
   this.redirect(data, info);
   return;
  }
  this.error(data);
  this.enableButton(btnInfo);
  return;
 }
 redirect(data, info) {
  this.box.classList.add('alert-success');
  this.box.innerHTML = info;
  localStorage.setItem('user', JSON.stringify(data.data));
  setTimeout(() => {
   if (data.data.data.type === 'staff') {
    location.replace('./admin/dashboard.html');
    return;
   }
   location.replace('profile.html');
  }, 5000);
  return;
 }
}
