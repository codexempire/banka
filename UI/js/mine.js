const time = (timer) => {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const seconds = date.getSeconds();

  timer.style.fontWeight = '500';
  timer.textContent = `${hour}:${minute}:${seconds}`;
}
const startApp = () => {
  const timer = document.getElementById('time');
  const btn = document.getElementById('login');

  if (btn) {
    btn.onclick = () => {
      location.replace('profile.html');
    }
  }
  if (timer) {
    const create = document.getElementById('create');
    const view = document.getElementById('view');
    const credit = document.getElementById('credit');
    const debit = document.getElementById('debit');

    create.onclick = () => {
      location.replace("create_staff.html");
    };
    view.onclick = () => {
      location.replace("list.html");
    };
    credit.onclick = () => {
      location.replace("credit.html");
    };
  }
  setInterval(time(timer), 1000);
}
startApp();
