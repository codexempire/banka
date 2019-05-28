class Dashboard{
  constructor() {
    this.table = document.querySelector('.hover');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.box = document.querySelector('.alert');
    this.header = document.querySelector('.form-head');
  }
  start() {
    this.header.textContent = '';
    this.box.classList.remove('alert-danger');
    this.box.textContent = '';
    document.querySelector('.diva').innerHTML = '';
    document.querySelector('.hover').innerHTML = `<img class='top' src='../images/ajax-loader.gif'>`;
  }
  end() {
    document.querySelector('.hover').innerHTML = '';
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
  error(res) {
    if (res.status === 401 || res.status === 403) logout();
    this.table.innerHTML = `<div>${res.error || res.message}</div>`;
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
}

class Signup{
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
  start() {
    this.btn.disabled = true;
    this.btn.style.opacity = '0.5';
    this.btn.textContent = 'Creating...';    
  }
  end() {
    this.btn.disabled = false;
    this.btn.style.opacity = '1';
    this.btn.textContent = 'Create';    
  }
  error(res) {
    if (res.status === 401 || res.status === 403) logout();
    this.box.classList.add('alert-danger');
    this.box.innerHTML = `${res.error || res.msg}`;
    this.btn.disabled = false;
    this.btn.textContent = 'Create';
    this.btn.style.opacity = '1';    
  }
  async signup() {
    this.start();
    const endpoint = 'https://banka-pro-app.herokuapp.com';
    const selectedOption = this.accountType.options[this.accountType.selectedIndex].value;
    let isAdmin = '';
    selectedOption === 'admin' ? isAdmin = 'true' : isAdmin = 'false';
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

    const staff = await fetcher(`${endpoint}/api/v1/auth/signup/staff`, options);
    this.end();
    console.log(staff);
    if (staff.status === 200) {
      this.connectUser(staff);
      return;
    } else {
      this.error(staff);
      return;
    }
  }
  connectUser(data) {
    this.redirect(data);
    return;
  }
  redirect(res) {
    document.querySelector('.form-card').style.display = 'none';
    this.box.classList.remove('alert-danger');
    this.box.textContent = '';
    document.querySelector('.dialog').style.display = 'block';
    console.log(res.data.data.isadmin);
    if (res.data.data.isadmin) {
      document.querySelector('.dialog').innerHTML = `
        <h3>The Administrator account has been created</h3>
        <button type='button' class='btn btn-green transactions' onclick = 'dashboard()'>Okay</button>
      `;
    return;
    }
    document.querySelector('.dialog').innerHTML = `
        <h3>The Staff account has been created</h3>
        <button type='button' class='btn btn-green transactions' onclick = 'dashboard()'>Okay</button>
      `;
    return;
  }
}
