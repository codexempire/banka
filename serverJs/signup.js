class Signup extends UserInformation {
 constructor() {
  super();
 }
 async signup() {
  this.disableButton('Creating...');
  const endpoint = 'https://banka-pro-app.herokuapp.com';
  const data = {
   firstname: this.firstname.value,
   lastname: this.lastname.value,
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
  const result = await fetcher(`${endpoint}/api/v1/auth/signup`, options);
  this.connectUser(result, `Created User Redirecting...`, 'Create');
  return;
 }
}
