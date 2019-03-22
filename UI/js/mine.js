const startApp = () => {
  const btn = document.getElementById('login');
  btn.onclick = () => {
    location.replace('profile.html');
  }
}
startApp();
