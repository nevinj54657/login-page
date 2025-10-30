

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('taskForm'); 
  const list = document.getElementById('taskList');
  const search = document.getElementById('newTask');
  const totalEl = document.getElementById('totalCount');
  const highEl = document.getElementById('highCount');
  const medEl = document.getElementById('medCount');
  const lowEl = document.getElementById('lowCount');

  if (!form || !list) return;

const esc = (s = '') => String(s) // simple HTML escape
   .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  const priorityScore=p=>({high:3, medium:2,low:1}[p?.toLowerCase()]||1); // scoring for sorting

  const updateStats=()=>{ // update task counts
    const items=[...list.children];
    const counts = { high: 0, medium: 0, low: 0 };
    items.forEach(li => counts[li.dataset.priority.toLowerCase()]++);
    totalEl.textContent = items.length;
    highEl.textContent = counts.high;
    medEl.textContent = counts.medium;
    lowEl.textContent = counts.low;
  }

  const sortTasks=()=>{ // sort tasks by priority desc
    [...list.children]
    .sort((a,b)=>priorityScore(b.dataset.priority)-priorityScore(a.dataset.priority))
    .forEach(li=>list.appendChild(li));
  };

  const toggleNoResults = show => { // show/hide no results message
    let msg = document.getElementById('noResults');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'noResults';
      msg.className = 'text-muted mt-2';
      list.after(msg);
    }
    msg.textContent = show ? 'No tasks match your search' : '';
  };
    const filterTasks = () => { // filter tasks based on search input
    const q = (search?.value || '').toLowerCase().trim();
    let visible = 0;
    [...list.children].forEach(li => {
      const text = li.textContent.toLowerCase();
      const show = !q || text.includes(q);
      li.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    toggleNoResults(visible === 0 && list.children.length > 0);
  };
  const createTaskItem=({title, description, dueDate, priority})=>{ // create task list item
    const li=document.createElement('li');
    li.className='list-group-item border-0 px-0 mb-3';
    li.dataset.priority=priority;
    li.innerHTML=
     '<div class="card shadow-sm">' +
        '<div class="card-body d-flex justify-content-between align-items-start">' +
          '<div>' +
            '<h5 class="card-title mb-1">' + esc(title) + '</h5>' +
            (description ? '<p class="card-text text-muted mb-1">' + esc(description) + '</p>' : '') +
            '<small class="text-muted">Due: ' + (dueDate ? esc(dueDate) : '—') + ' • Priority: ' + esc(priority) + '</small>' +
          '</div>' +
          '<div class="d-flex flex-column ms-3">' +
            '<button class="btn btn-sm btn-outline-secondary status-btn mb-2" data-status="To Do" type="button">To Do</button>' +
            '<button class="btn btn-sm btn-outline-warning status-btn mb-2" data-status="In Progress" type="button">In Progress</button>' +
            '<button class="btn btn-sm btn-success complete-btn" type="button">Completed</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    return li;
  
  }

  form.addEventListener('submit',e=>{ // form submit handler
    e.preventDefault();
    const title=document.getElementById('taskTitle').value.trim();
    if (!title) return;

    const li=createTaskItem({ // create task list item
      title,
      description:document.getElementById('taskDescription').value.trim(), 
      dueDate:document.getElementById('dueDate').value||'',
      priority:document.getElementById('taskPriority').value||'Low'
    });
    list.prepend(li);
    form.reset();
   if (window.jQuery && typeof window.jQuery('#taskModal').modal === 'function') {
      window.jQuery('#taskModal').modal('hide');
    }
    sortTasks();
    updateStats();
    filterTasks();
  });
    list.addEventListener('click', e => {
    const btn = e.target.closest('button');
    const li = e.target.closest('li');
    if (!btn || !li) return;

    const card = li.querySelector('.card');

    if (btn.classList.contains('complete-btn')) {
      li.remove();
      updateStats();
      filterTasks();
      return;
    }
        if (btn.classList.contains('status-btn')) {
      li.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      card.classList.remove('border-info', 'border-warning', 'border-success', 'opacity-75');

      const status = btn.dataset.status;
      if (status === 'To Do') card.classList.add('border-info');
      else if (status === 'In Progress') card.classList.add('border-warning');

      return;
    }
  });
  let timer;
  search?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(filterTasks, 150);
  });

  // Initial setup
  sortTasks();
  updateStats();
  filterTasks();
});

  // function createTaskItem({ title, description, dueDate, priority }) {// create task list item
  //   const li = document.createElement('li');
  //   li.className = 'list-group-item border-0 px-0 mb-3'; 
  //   li.dataset.priority = (priority || 'Low');

  //   li.innerHTML = `
  //     <div class="card shadow-sm">
  //       <div class="card-body d-flex justify-content-between align-items-start">
  //         <div>
  //           <h5 class="card-title mb-1">${esc(title)}</h5>
  //           ${description ? `<p class="card-text text-muted mb-1">${esc(description)}</p>` : ''}
  //           <small class="text-muted">Due: ${dueDate ? esc(dueDate) : '—'} • Priority: ${esc(priority)}</small>
  //         </div>
  //         <div class="d-flex flex-column ms-3">
  //         <button class="btn btn-sm btn-outline-secondary status-btn mb-2" data-status="To Do" type="button" >To Do</button>
  //           <button class="btn btn-sm btn-danger done-btn mb-2" type="button" data-status="In Progress">In Progress</button>
  //           <button class="btn btn-sm btn-success complete-btn" id="completeBtn" type="button">Completed</button>
  //         </div>
  //       </div>
  //     </div>
  //   `;
  //   return li;
  // }


  // function priorityScore(p) { // scoring for sorting
  //   const v = (p || 'low').toLowerCase();
  //   return v === 'high' ? 3 : (v === 'medium' ? 2 : 1);
  // }

  // function sortTasksDesc() { // sort tasks by priority desc
  //   const items = Array.from(list.querySelectorAll('li'));
  //   items.sort((a, b) => priorityScore(b.dataset.priority) - priorityScore(a.dataset.priority));
  //   items.forEach(li => list.appendChild(li));
  // }

  // function updateStats() { // update task counts
  //   const items = Array.from(list.querySelectorAll('li'));
  //   const total = items.length;
  //   let h = 0, m = 0, l = 0;
  //   items.forEach(li => {
  //     const p = (li.dataset.priority || '').toLowerCase();
  //     if (p === 'high') h++;
  //     else if (p === 'medium') m++;
  //     else l++;
  //   });
  //   if (totalEl) totalEl.textContent = total;
  //   if (highEl) highEl.textContent = h;
  //   if (medEl) medEl.textContent = m;
  //   if (lowEl) lowEl.textContent = l;
  // }

  // function setNoResults(show) { // show/hide no results message
  //   let el = document.getElementById('noResults');
  //   if (!el) {
  //     el = document.createElement('div');
  //     el.id = 'noResults';
  //     el.className = 'text-muted mt-2';
  //     list.parentNode.insertBefore(el, list.nextSibling);
  //   }
  //   el.textContent = show ? 'No tasks match your search' : '';
  // }

  // function runSearchFilter() { // filter tasks based on search input
  //   if (!search) return setNoResults(false);
  //   const q = search.value.trim().toLowerCase();
  //   const items = Array.from(list.querySelectorAll('li'));
  //   let anyVisible = false;
  //   items.forEach(li => {
  //     const title = (li.querySelector('.card-title')?.textContent || '').toLowerCase();
  //     const desc = (li.querySelector('.card-text')?.textContent || '').toLowerCase();
  //     const meta = (li.querySelector('.card small')?.textContent || '').toLowerCase();
  //     const combined = `${title} ${desc} ${meta}`;
  //     const visible = q === '' || combined.includes(q);
  //     li.style.display = visible ? '' : 'none';
  //     if (visible) anyVisible = true;
  //   });
  //   setNoResults(!anyVisible && items.length > 0);
  // }

  // form submit handler
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const title = document.getElementById('taskTitle').value.trim();
//     if (!title) return;
//     const description = document.getElementById('taskDescription').value.trim();
//     const dueDate = document.getElementById('dueDate').value || '';
//     const priority = document.getElementById('taskPriority').value || 'Low';

//     const li = createTaskItem({ title, description, dueDate, priority });
//     list.prepend(li);

//     form.reset();
//     if (window.jQuery && typeof window.jQuery('#taskModal').modal === 'function') {
//       window.jQuery('#taskModal').modal('hide');
//     }

//     sortTasksDesc();
//     updateStats();
//     runSearchFilter();
//   });

//   // Delegated buttons
//   list.addEventListener('click', (e) => { // handle done/remove buttons
//     const btn = e.target.closest('button');
//     const li = e.target.closest('li');

//     if (!li || !btn) return;
//     if (btn.classList.contains('complete-btn')) {
//       li.remove();
//       sortTasksDesc();
//       updateStats();
//       runSearchFilter(); 
//       return;
//     }
//      // Status buttons (To Do / In Progress) -> highlight
//     if (btn.classList.contains('status-btn')) {
//       const status = btn.dataset.status; // "To Do" or "In Progress"
//       const card = li.querySelector('.card');

//       // remove existing status borders/visuals
//       card.classList.remove('border-info','border-warning','opacity-75');

//       // clear active state on sibling status buttons and set on clicked
//       li.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
//       btn.classList.add('active');

//       if (status === 'To Do') {
//         card.classList.add('border-info');
//       } else if (status === 'In Progress') {
//         card.classList.add('border-warning');
//       }

//       // keep stats/search consistent (status doesn't affect priority counts)
//       runSearchFilter();
//       return;
//     }
//     if (btn.classList.contains('done-btn')) {
//       const card = li.querySelector('.card');
//       card.classList.toggle('border-success');
//       card.classList.toggle('opacity-75');
//       btn.textContent = card.classList.contains('border-success') ? 'Undo' : 'Done';
//     }
//   });

//   // Search input (debounced)
//   let debounce;
//   if (search) {
//     search.addEventListener('input', () => {
//       clearTimeout(debounce);
//       debounce = setTimeout(runSearchFilter, 120);
//     });
//   }

//   // Observe changes and keep sort stable
//   const obs = new MutationObserver(() => {
//     clearTimeout(window.__sortTimeout);
//     window.__sortTimeout = setTimeout(() => {
//       sortTasksDesc();
//       updateStats();
//       runSearchFilter();
//     }, 40);
//   });
//   obs.observe(list, { childList: true });

//   // init
//   sortTasksDesc();
//   updateStats();
//   runSearchFilter();
// });
