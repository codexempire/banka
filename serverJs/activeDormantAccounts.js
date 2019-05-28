class ActiveDormant extends Dashboard{
 constructor() {
  super();
 }
 async fetchActiveAccounts() {
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
  const activeAccounts = await this.fetch(`${endpoint}/api/v1/accounts?status=active`, options);
  this.end();
  if (activeAccounts.status === 200) {
   this.fillTable(activeAccounts);
   return;
  }
  this.error(activeAccounts);
  return;
 }
 async fetchDormantAccounts() {
  this.start();
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  const dormantAccounts = await this.fetch(`${endpoint}/api/v1/accounts?status=dormant`, options);
  console.log(dormantAccounts);
  this.end();
  if (dormantAccounts.status === 200) {
   this.fillTable(dormantAccounts);
   return;
  }
  this.error(dormantAccounts);
  return;
 }
 async fetch(endpoint, options) {
  const activeDormant = await fetcher(endpoint, options);
  return activeDormant;
 }
}
