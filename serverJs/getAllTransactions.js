class getAllTransactions extends Dashboard{
 constructor() {
  super();
 }
 active = 'active';
 dormant = 'dormant';
 accountStat(res) {
  document.querySelector('.hover').innerHTML = '';
  document.querySelector('.dialog').style.display = 'block';
  document.querySelector('.dialog').innerHTML = `
   <h3>Account has been ${res.data.status === 'active' ? 'Activated' : 'Deactivated'}</h3>
   <button type='button' class='btn btn-green' onclick = 'dashboard()'>Okay</button>
  `;
  return;
 }
 async fetchTransactions() {
  this.start();
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  const transactions = await fetcher(`${endpoint}/api/v1/transactions`, options);
  this.end();
  if (transactions.status === 200) {
   this.fillTransactionTable(transactions);
   return;
  }
  this.error(transactions);
  return;
 }
}
