class Dashboard{
 constructor() {
  this.table = document.querySelector('.hover');
  this.user = JSON.parse(localStorage.getItem('user'));
  this.box = document.querySelector('.alert');
 }
 fetchAccounts() {
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
    console.log(res.error);
    this.fillTable(res);
   })
   .catch(err => {
    this.box.classList.add('alert-danger');
    this.box.textContent = `${err.message}`;
    return;
   });
  return;
 }
 fillTable(res) {
  return res.data.map(item => {
   console.log(item.createdon.slice(0,10));
   this.table.innerHTML += `
   <tr>
    <td>${item.accountnumber}</td>
    <td><span class="status status-green">${item.status}</span></td>
    <td><span>&#8358;</span>${item.balance}</td>
    <td>${item.type}</td>
    <td>${item.createdon.slice(0,10)}</td>
    <td>
     <div class="dropdown">
      <button class="drop-btn">Action</button>
      <div class="dropdown-content">
       <a href="#" value='active' class='${item.status === 'active' ? 'active' : ''}'>Active</a>
       <a href="#" value='dormant' class = '${item.status==='dormant'? 'active': ''}'>Deactivate</a>
       <a href="#" value= 'delete'>Delete</a>
      </div>
     </div>
    </td>
   </tr>`;
  });
 }
}