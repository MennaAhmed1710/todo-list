class Auth {
  static getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
  static saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  static findUserByEmail(email) {
    const users = Auth.getUsers();
    return users.find(u=>u.email.toLowerCase() === email.toLowerCase());
  }
  static register({firstName,lastName,email,password}) {
    if (Auth.findUserByEmail(email)) return {ok:false, msg:'exists'};
    const users = Auth.getUsers();
    users.push({firstName,lastName,email,password});
    Auth.saveUsers(users);
    localStorage.setItem('currentUser', email);
    return {ok:true};
  }
  static login({email,password}) {
    const user = Auth.findUserByEmail(email);
    if (!user) return {ok:false, msg:'no_user'};
    if (user.password !== password) return {ok:false, msg:'wrong_pass'};
    localStorage.setItem('currentUser', email);
    return {ok:true, user};
  }
  static logout() {
    localStorage.removeItem('currentUser');
    window.location = 'index.html';
  }
  static currentUser() {
    const email = localStorage.getItem('currentUser');
    return email ? Auth.findUserByEmail(email) : null;
  }
}

// Page logic
document.addEventListener('DOMContentLoaded', ()=>{
  const path = location.pathname.split('/').pop();
  if (path === '' || path === 'index.html') setupLogin();
  if (path === 'register.html') setupRegister();
  if (path === 'home.html') {
    const u = Auth.currentUser();
    if (!u) window.location = 'index.html';
    else document.getElementById('welcome').textContent = (localStorage.getItem('lang')==='ar' ? 'أهلاً، ' : 'Welcome, ') + u.firstName;
    document.getElementById('logoutBtn').addEventListener('click', ()=>Auth.logout());
  }
});

function showMsg(el, text){ el.textContent = text; setTimeout(()=>el.textContent='','3000'); }

function setupLogin(){
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('message');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!email || !password) { msg.textContent = (localStorage.getItem('lang')==='ar' ? 'املأ الحقول' : 'Please fill inputs'); return; }
    const res = Auth.login({email,password});
    if (!res.ok) {
      if (res.msg==='no_user') msg.textContent = (localStorage.getItem('lang')==='ar' ? 'المستخدم غير موجود، سجل أولاً' : 'User not found, please register first');
      else msg.textContent = (localStorage.getItem('lang')==='ar' ? 'كلمة المرور خاطئة' : 'Wrong password');
      return;
    }
    window.location = 'home.html';
  });
}

function setupRegister(){
  const form = document.getElementById('registerForm');
  const msg = document.getElementById('message');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    if (!firstName || !lastName || !email || !password) { msg.textContent = (localStorage.getItem('lang')==='ar' ? 'املأ الحقول' : 'Please fill inputs'); return; }
    const res = Auth.register({firstName,lastName,email,password});
    if (!res.ok) {
      msg.textContent = (localStorage.getItem('lang')==='ar' ? 'الايميل مستخدم بالفعل' : 'Email already exists');
      return;
    }
    // registered -> redirected automatically (currentUser set in register)
    window.location = 'home.html';
  });
}
