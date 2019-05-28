const active = 'active';
const dormant = 'dormant';
const activateDeactivate = async (accountNumber, status) => {
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
   document.querySelector('.hover').innerHTML = '';
   document.querySelector('.dialog').style.display = 'block';
   document.querySelector('.dialog').innerHTML = `
        <h3>Account has been ${res.data.status === 'active' ? 'Activated' : 'Deactivated'}</h3>
        <button type='button' class='btn btn-green' onclick = 'dashboard()'>Okay</button>
     `;
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
   document.querySelector('.hover').innerHTML = '';
   document.querySelector('.alert').textContent = `${res.message}`;
   document.querySelector('.dialog').style.display = 'block';
   document.querySelector('.dialog').innerHTML = `
        <h3>${res.message}</h3>
        <button type='button' class='btn btn-green' onclick = 'dashboard()'>Okay</button>
     `;
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

const dashboard = () => {
 location.replace('dashboard.html');
}

const logout = () => {
 localStorage.removeItem('user');
 location.replace('../login.html');
}
