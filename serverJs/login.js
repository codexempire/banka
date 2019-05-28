class Logger extends UserInformation {
 constructor() {
  super();
  this.btn = document.querySelector('#login');
 }
 async access() {
  this.disableButton('Login...');
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
   email: this.email.value,
   password: this.password.value
  };
  const options = {
   method: 'POST',
   body: JSON.stringify(data),
   headers: new Headers({
    'Content-Type': 'application/json'
   })
  };
  const result = await fetcher(`${endpoint}/api/v1/auth/signin`, options);
  this.connectUser(result, `Login successful Redirecting...`, 'Login');
  return;
 }
}
