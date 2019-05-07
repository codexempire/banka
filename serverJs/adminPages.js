class Dashboard{
 constructor() {
  this.table = document.querySelector('.hover');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.box = document.querySelector('.alert');
  this.header = document.querySelector('.form-head');
  }

  start() {
    document.querySelector('.hover').innerHTML = `<img class='top' src='../images/ajax-loader.gif'>`;
  }
  end() {
    document.querySelector('.hover').innerHTML = '';
  }
  fetchAccounts() {
    this.header.textContent = '';
    this.box.classList.remove('alert-danger');
    this.box.textContent = '';
    document.querySelector('.diva').innerHTML = '';
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
      this.end();
     if (res.status === 200) {
       this.header.textContent = 'List of Accounts';
      this.fillTable(res);
      return;
    }
    this.box.textContent = `${res.error}`;
    return;
   })
    .catch(err => {
      this.end();
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
  }

  fetchTransactions() {
    this.header.textContent = '';
    this.box.textContent = '';
    this.box.classList.remove('alert-danger');
    document.querySelector('.diva').innerHTML = '';
    const endpoint = 'https://banka-pro-app.herokuapp.com';
    const options = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': `${this.user.token}`
      })
    };
    fetch(`${endpoint}/api/v1/transactions`, options)
      .then(res => res.json())
      .then(res => {
        this.end();
        if (res.status === 200) {
          this.header.textContent = 'List of Transactions';
          this.fillTransactionTable(res);
          return;
        }
        this.box.textContent = `${res.error}`;
        return;
      })
      .catch(err => {
        this.end();
        this.box.classList.add('alert-danger');
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
    <th>Action</th>
   </tr>
  `;
    return res.data.map(item => {
      this.table.innerHTML += `
   <tr>
    <td class='accountnumber'>${item.accountnumber}</td>
    <td><span class="status status-green"><span>&#8358</span>${item.amount}</span></td>
    <td>${item.createdon.slice(0, 10)}</td>
    <td>${item.type}</td>
    <td>
     <div class="dropdown">
      <button class="drop-btn">Action</button>
      <div class="dropdown-content">
       <a href="#" onclick = 'viewTransaction(${item.id})'>View</a>
      </div>
     </div>
    </td>
   </tr>`;
    });
  }

  fetchActiveAccounts() {
    this.header.textContent = '';
    this.box.textContent = '';
    this.box.classList.remove('alert-danger');
    document.querySelector('.diva').innerHTML = '';
    const endpoint = 'https://banka-pro-app.herokuapp.com';
    const options = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': `${this.user.token}`
      })
    };
    fetch(`${endpoint}/api/v1/accounts?status=active`, options)
      .then(res => res.json())
      .then(res => {
        this.end();
        if (res.status === 200) {
          this.header.textContent = 'List of Active Accounts';
          this.fillTable(res);
          return;
        }
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

  fetchDormantAccounts() {
    this.header.textContent = '';
    this.box.textContent = '';
    this.box.classList.remove('alert-danger');
    document.querySelector('.diva').innerHTML = '';
    const endpoint = 'https://banka-pro-app.herokuapp.com';
    const options = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': `${this.user.token}`
      })
    };
    fetch(`${endpoint}/api/v1/accounts?status=dormant`, options)
      .then(res => res.json())
      .then(res => {
        this.end();
        if (res.status === 200) {
          this.header.textContent = 'List of Dormant Accounts';
          this.fillTable(res);
          return;
        }
        this.box.textContent = `${res.error}`;
        return;
      })
      .catch(err => {
        this.end();
        this.box.classList.add('alert-danger');
        this.box.textContent = `${err.message}`;
        return;
      });
    return;
  }

 fillTable(res) {
  this.table.innerHTML = `
  <tr>
    <th>Acc Number</th>
    <th>Status</th>
    <th>Balance</th>
    <th>Type</th>
    <th>Opening Date</th>
    <th>Actions</th>
   </tr>
  `;
   return res.data.map(item => {
    this.table.innerHTML += `
   <tr>
    <td class='accountnumber'>${item.accountnumber}</td>
    <td><span class="status status-green">${item.status}</span></td>
    <td><span>&#8358;</span>${item.balance}</td>
    <td>${item.type}</td>
    <td>${item.createdon.slice(0, 10)}</td>
    <td>
     <div class="dropdown">
      <button class="drop-btn">Action</button>
      <div class="dropdown-content">
       <a href="#" class='activateDeactivate' onclick = 'activateDeactivate(${item.accountnumber},${item.status})'>${item.status==='dormant'?'Activate':'Deactivate'}</a>
       <a href="#" value= 'delete' onclick = 'deleteAccount(${item.accountnumber})'>Delete</a>
      </div>
     </div>
    </td>
   </tr>`;
  });
 }

  search() {
    this.header.textContent = '';
    this.box.textContent = '';
    this.box.classList.remove('alert-danger');
    const accountNumber = document.querySelector('.search').value;
    document.querySelector('.diva').innerHTML = '';
    const endpoint = 'https://banka-pro-app.herokuapp.com';
    const options = {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-access-token': `${this.user.token}`
      })
    };
    fetch(`${endpoint}/api/v1/accounts/${accountNumber}/transactions`, options)
      .then(res => res.json())
      .then(res => {
        this.end();
        if (res.status === 200) {
          this.header.textContent = `List of Transactions for ${accountNumber}`;
          this.fillTransactionTable(res);
          return;
        }
        this.box.textContent = `${res.error}`;
        return;
      })
      .catch(err => {
        this.end();
        this.box.classList.add('alert-danger');
        this.box.textContent = `${err.message}`;
        return;
      });
    return;    
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

const active = 'active';
const dormant = 'dormant';
const activateDeactivate = (accountNumber, status) => {
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
    status: status === 'dormant' ? 'active' : 'dormant'
  };
  const options = {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': `${user.token}`
    })
  };
  fetch(`${endpoint}/api/v1/accounts/${accountNumber}`, options)
    .then(res => res.json())
    .then(res => {
      const accounts = new Dashboard();
      accounts.fetchAccounts();
      return;
    })
    .catch(err => {
      document.querySelector('.alert').classList.add('alert-danger');
      document.querySelector('.alert').textContent = `${err.message}`;
      return;
    });
  return;  
}

const deleteAccount = (accountNumber) => {
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': `${user.token}`
    })
  };
  fetch(`${endpoint}/api/v1/accounts/${accountNumber}`, options)
    .then(res => res.json())
    .then(res => {
      document.querySelector('.alert').textContent = `${res.message}`;
      const accounts = new Dashboard();
      setTimeout(() => {
        accounts.fetchAccounts();
      }, 3000);
      return;
    })
    .catch(err => {
      document.querySelector('.alert').classList.add('alert-danger');
      document.querySelector('.alert').textContent = err.message;
      return;
    });
  return;
}

const viewTransaction = (id) => {
  document.querySelector('.form-head').textContent = '';
  document.querySelector('.hover').innerHTML = '';
  document.querySelector('.alert').textContent = '';
  document.querySelector('.alert').classList.remove('alert-danger');
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-access-token': `${user.token}`
    })
  };
  fetch(`${endpoint}/api/v1/transactions/${id}`, options)
    .then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        const box = document.querySelector('.diva');
        return box.innerHTML = `
            <div class='form-card centee'>
              <h2 class='text-center'>Transaction Details</h2>
              <table>
                <tr>
                  <td>Account Number</td>
                  <td>${res.data.accountnumber}</td>
                </tr>
                <tr>
                  <td>Amount</td>
                  <td>${res.data.amount}</td>
                </tr>
                <tr>
                  <td>Cashier Id</td>
                  <td>${res.data.cashierid}</td>
                </tr>
                <tr>
                  <td>Old Balance</td>
                  <td>${res.data.oldbalance}</td>
                </tr>
                <tr>
                  <td>New Balance</td>
                  <td>${res.data.newbalance}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>${res.data.type}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>${res.data.createdon.slice(0, 10)}</td>
                </tr>
              </table>
            </div>
          `;
      }
      document.querySelector('.alert').textContent = `${res.error}`;
      return;
    })
    .catch(err => {
      document.querySelector('.alert').classList.add('alert-danger');
      document.querySelector('.alert').textContent = `${err.message}`;
      return;
    });
  return;
}

const logout = () => {
  localStorage.removeItem('user');
  location.replace('../login.html');
}
