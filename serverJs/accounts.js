class Transaction {
 constructor() {
  this.amount = document.querySelector('#amount');
  this.btnDebit = document.querySelector('#debit');
  this.btnCredit = document.querySelector('#credit');
  this.box = document.querySelector('.alert');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.balance = document.querySelector('#accountBalance');
 }
 getAccount() {
  const accountNumber = document.querySelector('#accountNumber').value;
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/accounts/${accountNumber}`, options)
   .then(res => res.json())
   .then(res => {
    if (res.status === 200) {
     this.balance.value = `${res.data.balance}`;
     return;
    }
    this.box.classList.add('alert-danger');
    this.box.textContent = `${res.error}`;
    return;
   })
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
 }
}

class Credit extends Transaction {
 constructor() {
  super();
 }
 creditAccount() {
  const accountNumber = document.querySelector('#accountNumber').value;
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
   amount: parseInt(this.amount.value, 10)
  };
  const options = {
   method: 'POST',
   body: JSON.stringify(data),
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/transactions/${accountNumber}/credit`, options)
   .then(res => res.json())
   .then(res => {
    if (res.status === 403) {
     location.replace('../login.html');
     return;
    }
    if (res.status === 200) {
     document.querySelector('.form-card').style.display = 'none';
     document.querySelector('.dialog').style.display = 'block';
     document.querySelector('.dialog').innerHTML = `
        <h4>Credited ${res.data.accountnumber} with ${res.data.amount}</h4>
        <button type='button' class='btn btn-green' onclick = 'dashboard()'>Okay</button>
     `;
     return;     
    }
    this.box.classList.add('alert-danger');
    this.box.textContent = `${res.error}`;
    return;
   })
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;  
 }
}

class Debit extends Transaction {
 constructor() {
  super();
 }
 debitAccount() {
  const accountNumber = document.querySelector('#accountNumber').value;
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
   amount: parseInt(this.amount.value, 10)
  };
  const options = {
   method: 'POST',
   body: JSON.stringify(data),
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  fetch(`${endpoint}/api/v1/transactions/${accountNumber}/debit`, options)
   .then(res => res.json())
   .then(res => {
    if (res.status === 403) {
     location.replace('../login.html');
     return;
    }
    if (res.status === 200) {
     document.querySelector('.form-card').style.display = 'none';
     document.querySelector('.dialog').style.display = 'block';
     document.querySelector('.dialog').innerHTML = `
        <h4>Debited ${res.data.accountnumber} with ${res.data.amount}</h4>
        <button type='button' class='btn btn-green' onclick = 'dashboard()'>Okay</button>
     `;
     return;
    }
    this.box.classList.add('alert-danger');
    this.box.textContent = `${res.error}`;
    return;
   })
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
 }
}
const dashboard = () => {
 location.replace('dashboard.html');
}
const logout = () => {
 localStorage.removeItem('user');
 location.replace('../login.html');
}
