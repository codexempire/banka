class CreateAccount {
 constructor() {
  this.accountType = document.querySelector('#select');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.box = document.querySelector('.alert');
  this.form = document.querySelector('.form-card');
 }
 async createAccount() {
  const selectedOption = this.accountType.options[this.accountType.selectedIndex].value;
  const data = {
   type: selectedOption
  };
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'POST',
   body: JSON.stringify(data),
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  const result = await fetcher(`${endpoint}/api/v1/accounts`, options);
  this.checkAccountCreated(result);
  return;
 }
 checkAccountCreated(res) {
  if (res.status === 401) {
   logout();
  }
  if (res.status === 201) {
   this.success(res);
   return;
  }
  this.error(res);
  return;
 }
 error(res) {
  this.box.classList.add('alert-danger');
  this.box.textContent = `${res.error}`;
  return;
 }
 success(res) {
  this.form.style.display = 'none';
  document.querySelector('.dialog').style.display = 'block';
  document.querySelector('.dialog').innerHTML = `
   <h4>Account has been Opened.<br> Your Account Number is ${res.data.accountnumber}</h4>
   <button type='button' class='btn btn-green' onclick = 'dashboard()'>Okay</button>
  `;
  return;
 }
}

const dashboard = () => {
 setTimeout(() => {
  location.replace('profile.html');
 }, 3000);
}
