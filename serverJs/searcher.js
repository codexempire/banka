class Searcher extends Dashboard{
 constructor(){
  super();
 }
 async search() {
  this.start();
  const accountNumber = document.querySelector('.search').value;
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const options = {
   method: 'GET',
   headers: new Headers({
    'Content-Type': 'application/json',
    'x-access-token': `${this.user.token}`
   })
  };
  const accountTransactions = await fetcher(`${endpoint}/api/v1/accounts/${accountNumber}/transactions`, options);
  this.end();
  if (accountTransactions.status === 200) {
   this.fillTransactionTable(accountTransactions);
   return;
  }
  this.error(accountTransactions);
  return;
 }
}