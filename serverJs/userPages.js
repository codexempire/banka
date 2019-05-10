class Dashboard{
 constructor() {
  this.header = document.querySelector('.amount');
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
  <h3> Welcome to MyBanka ${user.data.firstname[0].toUpperCase()}${user.data.firstname.slice(1).toLowerCase()} ${user.data.lastname[0].toUpperCase()}${user.data.lastname.slice(1).toLowerCase()}
  `;
 }
 async getAccounts() {
  this.table.innerHTML = '';
  document.querySelector('.diva').innerHTML = '';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${user.token}`
   })
  };
  const result = await fetcher(`${endpoint}/api/v1/user/${user.data.email}/accounts`, options);
  this.checkAccounts(result);
  return;
 }
 checkAccounts(result) {
  this.end();
  if (result.status === 200) {
   this.accDetails(result);
   return;
  }
  if (result.status === 401) {
   logout();
  }
  if (result.status === 404) {
   this.accountDetails.innerHTML = `You have not Opened an Account yet.`;
   return;
  }
  this.accountDetails.innerHTML = result.error;
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
     <p>${user.data.firstname[0].toUpperCase()}${user.data.firstname.slice(1).toLowerCase()} ${user.data.lastname[0].toUpperCase()}${user.data.lastname.slice(1).toLowerCase()}</p>
    </li>
    <li><strong>Account Status</strong><br>
     <p class="active">${item.status}</p>
    </li>
    <li><strong>Account Type</strong><br>${item.type}</li>
    <li><strong>Account Balance</strong><br><span>&#8358;</span>${item.balance.toFixed(2)}</li>
   </ul><br>
  `
   document.querySelector('.fills').innerHTML += `
    <option value='${item.accountnumber}'>
     ${item.accountnumber}
    </option>
   `;
  });
 }
 async fetchAllTransactions() {
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${user.token}`
   })
  };
  const accounts = await fetcher(`${endpoint}/api/v1/user/${user.data.email}/accounts`, options);
  this.getAccountsTransactions(accounts, options);
  return;
 }
 getAccountsTransactions(accounts, options) {
  (() => {
   this.table.innerHTML = `
    <tr>
     <th>Acc Number</th>
     <th>Amount</th>
     <th>Date</th>
     <th>Type</th>
    </tr>
   `
   accounts.data.map(async (item) => {
    let transactions = await fetcher(`${endpoint}/api/v1/accounts/${item.accountnumber}/transactions`, options);
    if (typeof transactions === undefined) {
     console.log(undefined);
     return;
    }
    this.fillTransactionTable(transactions);
   });
   return;
  })();
 }
 async fetchSingleAccountTransactions(accountNumber) {
  this.table.innerHTML = '';
  // this.box.classList.remove('alert-danger');
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${user.token}`
   })
  };
  const transactions = await fetcher(`${endpoint}/api/v1/accounts/${accountNumber}/transactions`, options);
  console.log(transactions.data);
  if (transactions.status === 200 && transactions.data.length >= 1) {
   this.fillTransactionTable(transactions);
   return;
  }
  if (transactions.status === 200 && transactions.data.length === 0) {
   this.end();
   this.header.innerHTML = `<h3>Your Accounts Transactions</h3>`;
   this.table.innerHTML = transactions.message;
   return;
  }
  this.table.innerHTML = transactions.error;
  return;
 }
 fillTransactionTable(res) {
  this.end();
  this.header.innerHTML = `<h3>Your Accounts Transactions</h3>`;
  this.table.style.display = '';
  this.table.innerHTML = `
    <tr>
     <th>Acc Number</th>
     <th>Amount</th>
     <th>Date</th>
     <th>Type</th>
    </tr>
   `
  res.data.forEach(item => {
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
