const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
 location.replace('../login.html');
}
if (!user.data.isadmin) {
 location.replace('../login.html');
}