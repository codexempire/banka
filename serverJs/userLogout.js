const logout = () => {
 localStorage.removeItem('user');
 location.replace('login.html');
}
