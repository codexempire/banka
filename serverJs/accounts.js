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
    console.log(res);
    if (res.status === 200) {
     this.balance+=`${res.data.balance}`;
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
}

// const credit = new Credit();
// console.log(credit.getAccount());