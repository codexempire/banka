class getAllAccounts extends Dashboard{
 constructor() {
  super();
 }
 async fetchAccounts() {
  this.start();
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  const accounts = await fetcher(`${endpoint}/api/v1/accounts`, options);
  this.end();
  if (accounts.status === 200) {
   this.fillTable(accounts);
   return;
  }
  this.error(accounts);
  return;
 }
}
