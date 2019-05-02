class Dashboard{
 constructor() {
  this.table = document.querySelector('.hover');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.box = document.querySelector('.alert');
 }
 fetchAccounts() {
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/accounts`, options)
   .then(res => res.json())
   .then(res => {
    console.log(res.error);
    this.fillTable(res);
   })
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
 }
 fillTable(res) {
  return res.data.map(item => {
   console.log(item.createdon.slice(0,10));
   this.table.innerHTML += `
   <tr>
    <td>${item.accountnumber}</td>
    <td><span class="status status-green">${item.status}</span></td>
    <td><span>&#8358;</span>${item.balance}</td>
    <td>${item.type}</td>
    <td>${item.createdon.slice(0,10)}</td>
    <td>
     <div class="dropdown">
      <button class="drop-btn">Action</button>
      <div class="dropdown-content">
       <a href="#" value='active' class='${item.status === 'active' ? 'active' : ''}'>Active</a>
       <a href="#" value='dormant' class = '${item.status==='dormant'? 'active': ''}'>Deactivate</a>
       <a href="#" value= 'delete'>Delete</a>
      </div>
     </div>
    </td>
   </tr>`;
  });
 }
}

class Signup {
 constructor() {
  this.firstname = document.querySelector('#firstName');
  this.lastname = document.querySelector('#lastName');
  this.email = document.querySelector('#email');
  this.password = document.querySelector('#password');
  this.box = document.querySelector('.alert');
  this.btn = document.querySelector('#createStaffAdmin');
  this.accountType = document.querySelector('#select');
  this.user = JSON.parse(localStorage.getItem('user'));
 }
 signup() {
  this.btn.disabled = true;
  this.btn.style.opacity = '0.5';
  this.btn.textContent = 'Creating...';
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const selectedOption = this.accountType.options[this.accountType.selectedIndex].value;
  let isAdmin = '';
  selectedOption === 'admin' ? isAdmin = 'true' : isAdmin = 'false';
  console.log(typeof isAdmin);
  const data = {
   firstname: this.firstname.value,
   lastname: this.lastname.value,
   email: this.email.value,
   password: this.password.value,
   isAdmin: isAdmin
  };
  const options = {
   method: 'POST',
   body: JSON.stringify(data),
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/auth/signup/staff`, options)
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
  console.log(data);
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
 redirect(res) {
  this.btn.disabled = false;
  this.btn.textContent = 'Create';
  this.btn.style.opacity = '1';
  this.box.classList.add('alert-success');
  console.log(res.data.data.isadmin);
  if (res.data.data.isadmin) {
   this.box.textContent = `The Administrator account has been created`;
   return;
  }
  this.box.textContent = `The staff account has been created`;
  return;
 }
}