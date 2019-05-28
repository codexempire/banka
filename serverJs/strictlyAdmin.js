const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
 location.replace('../login.html');
}
if (!user.data.isadmin) {
 alert('Page is only accessible by an Administrator');
 user.data.type === 'staff' ? location.replace('dashboard.html') : location.replace('../login.html');
}
