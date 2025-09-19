
class Todo {
  constructor(id, text, done=false, createdAt=Date.now()) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.createdAt = createdAt;
  }
}

class TodoApp {
  constructor(listEl, inputEl) {
    this.listEl = listEl;
    this.inputEl = inputEl;
    this.user = this._getUserEmail();
    this.todos = this._loadTodos();
    this.render();
  }
  _getUserEmail() { return localStorage.getItem('currentUser'); }
  _storageKey() { return `todos_${this.user}`; }
  _loadTodos() {
    if (!this.user) return [];
    return JSON.parse(localStorage.getItem(this._storageKey()) || '[]').map(t=>new Todo(t.id,t.text,t.done,t.createdAt));
  }
  _save() { localStorage.setItem(this._storageKey(), JSON.stringify(this.todos)); }
  add(text) {
    const id = Date.now().toString(36);
    const t = new Todo(id, text);
    this.todos.unshift(t);
    this._save();
    this.render();
  }
  toggle(id) {
    const t = this.todos.find(x=>x.id===id);
    if (t) t.done = !t.done;
    this._save(); this.render();
  }
  remove(id) {
    this.todos = this.todos.filter(x=>x.id!==id);
    this._save(); this.render();
  }
  edit(id, newText) {
    const t = this.todos.find(x=>x.id===id);
    if (t) t.text = newText;
    this._save(); this.render();
  }
  render() {
    this.listEl.innerHTML = '';
    if (!this.todos.length) {
      const li = document.createElement('li'); li.className='todo-item';
      li.textContent = localStorage.getItem('lang')==='ar' ? 'لا توجد مهام بعد' : 'No tasks yet';
      this.listEl.appendChild(li); return;
    }
    this.todos.forEach(t=>{
      const li = document.createElement('li'); li.className='todo-item';
      const left = document.createElement('div'); left.className='todo-left';
      const cb = document.createElement('input'); cb.type='checkbox'; cb.checked = t.done;
      cb.addEventListener('change', ()=>this.toggle(t.id));
      const span = document.createElement('span'); span.className='todo-text'; span.textContent = t.text;
      if (t.done) span.classList.add('completed');
      left.appendChild(cb); left.appendChild(span);
      const actions = document.createElement('div'); actions.className='todo-actions';
      const editBtn = document.createElement('button'); editBtn.textContent = localStorage.getItem('lang')==='ar' ? 'تعديل' : 'Edit';
      editBtn.className='small';
      editBtn.addEventListener('click', ()=>{
        const newText = prompt(localStorage.getItem('lang')==='ar' ? 'عدّل المهمة' : 'Edit task', t.text);
        if (newText !== null && newText.trim()!=='') this.edit(t.id, newText.trim());
      });
      const delBtn = document.createElement('button'); delBtn.textContent = localStorage.getItem('lang')==='ar' ? 'حذف' : 'Delete';
      delBtn.className='small';
      delBtn.addEventListener('click', ()=>{ if(confirm(localStorage.getItem('lang')==='ar' ? 'متأكد؟' : 'Are you sure?')) this.remove(t.id); });
      actions.appendChild(editBtn); actions.appendChild(delBtn);
      li.appendChild(left); li.appendChild(actions);
      this.listEl.appendChild(li);
    });
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  if (location.pathname.split('/').pop() !== 'home.html') return;
  const todoList = document.getElementById('todoList');
  const taskInput = document.getElementById('taskInput');
  const app = new TodoApp(todoList, taskInput);
  document.getElementById('todoForm').addEventListener('submit', e=>{
    e.preventDefault();
    const v = taskInput.value.trim();
    if (!v) return alert(localStorage.getItem('lang')==='ar' ? 'اكتب المهمة' : 'Enter a task');
    app.add(v);
    taskInput.value = '';
  });
});
