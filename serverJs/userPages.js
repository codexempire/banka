class Dashboard{
 constructor() {
  this.header = document.querySelector('.amount');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.accountDetails = document.querySelector('.info');
  this.history = document.querySelector('.form-head');
  this.box = document.querySelector('.alert');
  this.table = document.querySelector('.table');
 }
 start(){
  this.accountDetails.innerHTML = `<img class='top' src='./images/ajax-loader.gif'>`;
 }
 end() {
  this.accountDetails.innerHTML = '';
 }
 welcome() {
  return this.header.innerHTML = `
  <h3> Welcome to MyBanka ${this.user.data.firstname[0].toUpperCase()}${this.user.data.firstname.slice(1).toLowerCase()} ${this.user.data.lastname[0].toUpperCase()}${this.user.data.lastname.slice(1).toLowerCase()}
  `;
 }
 getAccounts() {
  this.table.innerHTML = '';
  document.querySelector('.diva').innerHTML = '';
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/user/${this.user.data.email}/accounts`, options)
   .then(response => response.json())
   .then(res => {
    this.end();
    if (res.status === 200) {
     this.accDetails(res)
     return;
    }
    if (res.status === 401) {
     logout();
    }
    this.accountDetails.innerHTML = `You have not Opened an Account yet.`;
   })
   .catch(err => {
    this.accountDetails.innerHTML = `${err.message}`;
   });
  return;
 }
 accDetails(res) {
  return res.data.map(item => {
   this.accountDetails.innerHTML += `
   <ul class = 'account-info'>
    <li>
     <strong>Account number</strong><br>
     <p>${item.accountnumber}</p>
    </li>
    <li><strong>Email</strong><br>
     <p>${item.owneremail}</p>
    </li>
    <li><strong>Account Name</strong><br>
     <p>${this.user.data.firstname[0].toUpperCase()}${this.user.data.firstname.slice(1).toLowerCase()} ${this.user.data.lastname[0].toUpperCase()}${this.user.data.lastname.slice(1).toLowerCase()}</p>
    </li>
    <li><strong>Account Status</strong><br>
     <p class="active">${item.status}</p>
    </li>
    <li><strong>Account Type</strong><br>${item.type}</li>
    <li><strong>Account Balance</strong><br><span>&#8358;</span>${item.balance.toFixed(2)}</li>
   </ul><br>
  `
  });
 }
 
 fetchTransactions() {
  // this.box.textContent = '';
  // this.box.classList.remove('alert-danger');
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/accounts/${document.querySelector('.search').value}/transactions`, options)
   .then(res => res.json())
   .then(res => {
    this.end();
    if (res.status === 200) {
     this.header.innerHTML = `<h2 class='text-center'>List of Account Transactions</h2>`;
     this.fillTransactionTable(res);
     return;
    }
    this.box.textContent = `${res.error}`;
    return;
   })
   .catch(err => {
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
 }

 fillTransactionTable(res) {
  this.table.innerHTML = `
   <tr>
    <th>Acc Number</th>
    <th>Amount</th>
    <th>Date</th>
    <th>Type</th>
   </tr>
  `;
  return res.data.map(item => {
   this.table.innerHTML += `
   <tr>
    <td class='accountnumber'>${item.accountnumber}</td>
    <td><span class="status status-green"><span>&#8358</span>${item.amount}</span></td>
    <td>${item.createdon.slice(0, 10)}</td>
    <td>${item.type}</td>
   </tr>
   </table>`;
  });
 }
}
class CreateAccount {
 constructor(){
  this.accountType = document.querySelector('#select');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.box = document.querySelector('.alert')
 }
 createAccount() {
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
  fetch(`${endpoint}/api/v1/accounts`, options)
   .then(res => res.json())
   .then(res => {
    this.checkAccountCreated(res);
   })
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
 }
 checkAccountCreated(res) {
  if (res.status === 401) {
   logout();
  }
  res.status === 201 ? this.success(res) : this.error(res);
  return;
 }
 error(res) {
  // if (res.status === 401) {
  //  this.box.classList.add('alert-danger');
  //  this.box.textContent = `${res.error}`;
  //  setTimeout(() => {
  //   localStorage.clear();
  //   location.replace('login.html');
  //  }, 5000);
  //  return;
  // }
  this.box.classList.add('alert-danger');
  this.box.textContent = `${res.error}`;
  return;
 }
 success(res){
  this.box.classList.add('alert-success');
  this.box.textContent = `Account successfully created this is your account number ${res.data.accountnumber}`;
  return;
 }
}
const logout = () => {
 localStorage.removeItem('user');
 location.replace('login.html');
}