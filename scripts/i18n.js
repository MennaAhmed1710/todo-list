// Simple i18n toggle stored in localStorage ('lang' = 'en' or 'ar')
const translations = {
  en: {
    login_title: "Login",
    register_title: "Register",
    first_name: "First Name",
    last_name: "Last Name",
    first_email: "Email",
    password: "Password",
    register: "Register",
    login: "Login",
    logout: "Logout",
    add: "Add",
    your_todos: "Your Todos",
    welcome: "Welcome",
    task_placeholder: "Write a task..."
  },
  ar: {
    login_title: "تسجيل الدخول",
    register_title: "انشاء حساب",
    first_name: "الاسم الاول",
    last_name: "اسم العائلة",
    first_email: "البريد الالكترونى",
    password: "كلمة المرور",
    register: "تسجيل",
    login: "دخول",
    logout: "تسجيل خروج",
    add: "اضف",
    your_todos: "مهامي",
    welcome: "أهلاً",
    task_placeholder: "اكتب المهمة..."
  }
};

function applyTranslations() {
  const lang = localStorage.getItem('lang') || 'en';
  document.documentElement.lang = (lang === 'ar') ? 'ar' : 'en';
  const rtl = lang === 'ar';
  if (rtl) document.body.classList.add('rtl'); else document.body.classList.remove('rtl');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
  // placeholders
  const tp = document.getElementById('taskInput');
  if (tp) tp.placeholder = translations[lang].task_placeholder;
}

document.addEventListener('click', (e)=>{
  if (e.target && e.target.id === 'toggleLang') {
    const cur = localStorage.getItem('lang') || 'en';
    localStorage.setItem('lang', cur === 'en' ? 'ar' : 'en');
    applyTranslations();
  }
});

document.addEventListener('DOMContentLoaded', applyTranslations);
