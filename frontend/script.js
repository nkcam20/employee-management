// ===================== CURSOR =====================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let rx=0,ry=0,cx=0,cy=0;
document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  cursor.style.left = cx+'px'; cursor.style.top = cy+'px';
});
function animRing(){
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
}
animRing();

// ===================== PARTICLES =====================
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
  window.addEventListener('resize', resize); resize();
  for(let i=0;i<60;i++) pts.push({
    x: Math.random()*W, y: Math.random()*H,
    vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
    r: Math.random()*1.5+.5,
    a: Math.random()*.4+.1
  });
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(124,110,250,${p.a})`;
      ctx.fill();
    });
    // lines
    pts.forEach((a,i)=>{
      pts.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(124,110,250,${.08*(1-d/120)})`;
          ctx.lineWidth=.5; ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ===================== SCRAMBLE TEXT =====================
function scramble(el, final, duration=1000){
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let start = null;
  function step(ts){
    if(!start) start = ts;
    const prog = Math.min((ts-start)/duration, 1);
    const revealed = Math.floor(prog * final.length);
    let txt = '';
    for(let i=0;i<final.length;i++){
      if(i<revealed) txt += final[i];
      else txt += chars[Math.floor(Math.random()*chars.length)];
    }
    el.textContent = txt;
    if(prog<1) requestAnimationFrame(step);
    else el.textContent = final;
  }
  requestAnimationFrame(step);
}

// ===================== COUNT UP =====================
function countUp(el, target, duration=1200){
  let start=0, s=null;
  const isFloat = target % 1 !== 0;
  function step(ts){
    if(!s) s=ts;
    const prog = Math.min((ts-s)/duration,1);
    const ease = 1-Math.pow(1-prog,3);
    const val = Math.round(ease*target*10)/10;
    el.textContent = isFloat ? '$'+val.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g,',')+'K' : val.toLocaleString();
    if(prog<1) requestAnimationFrame(step);
    else el.textContent = isFloat ? '$'+target.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')+'K' : target.toLocaleString();
  }
  requestAnimationFrame(step);
}

// ===================== TOAST =====================
function toast(msg, type='success'){
  const icons = {success:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',error:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'};
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]||icons.info}</span>${msg}`;
  document.getElementById('toasts').appendChild(t);
  setTimeout(()=>{ t.classList.add('fade-out'); setTimeout(()=>t.remove(),350); }, 3500);
}

let state = {
  currentUser: null,
  employees: [],
  currentFilter: 'all',
  editId: null,
  deleteId: null,
};

const getToken = () => localStorage.getItem('emp_token');
const setToken = (t) => localStorage.setItem('emp_token', t);
const clearToken = () => localStorage.removeItem('emp_token');
const authHeader = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` });

// ===================== AUTH =====================
function switchTab(tab){
  document.getElementById('form-login').style.display = tab==='login'?'block':'none';
  document.getElementById('form-register').style.display = tab==='register'?'block':'none';
  document.getElementById('tab-login').className = 'tab-btn'+(tab==='login'?' active':'');
  document.getElementById('tab-register').className = 'tab-btn'+(tab==='register'?' active':'');
}
function showError(id,msg){
  const el=document.getElementById(id);
  el.textContent=msg; el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),3500);
}
function doLogin(){
  const email=document.getElementById('login-email').value.trim();
  const pass=document.getElementById('login-pass').value;
  if(!email||!pass){showError('login-error','Please fill in all fields.');return;}
  document.getElementById('login-btn-text').textContent='Signing in...';
  fetch('/api/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: pass })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(({ status, body }) => {
    if (status !== 200) { showError('login-error', body.message || 'Login failed'); document.getElementById('login-btn-text').textContent='Sign In →'; return; }
    setToken(body.token);
    state.currentUser = body.user;
    enterApp();
  })
  .catch(err => { showError('login-error', 'Server error'); document.getElementById('login-btn-text').textContent='Sign In →'; });
}
function doRegister(){
  const fname=document.getElementById('reg-fname').value.trim();
  const lname=document.getElementById('reg-lname').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value;
  if(!fname||!lname||!email||!pass){showError('reg-error','Please fill in all fields.');return;}
  if(pass.length<6){showError('reg-error','Password must be at least 6 characters.');return;}
  document.getElementById('reg-error').classList.remove('show');
  fetch('/api/signup', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fname, lname, email, password: pass })
  })
  .then(res => res.json().then(data => ({ status: res.status, body: data })))
  .then(({ status, body }) => {
    if (status !== 201) { showError('reg-error', body.message || 'Registration failed'); return; }
    toast('Account created! You can now sign in.','success');
    switchTab('login');
    document.getElementById('login-email').value=email;
  })
  .catch(err => showError('reg-error', 'Server error'));
}
function enterApp(){
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('main-app').classList.add('show');
  const u=state.currentUser;
  document.getElementById('sb-avatar').textContent=u.fname[0]+u.lname[0];
  document.getElementById('sb-name').textContent=u.fname+' '+u.lname;
  document.getElementById('sb-role').textContent=u.role==='admin'?'Administrator':'Standard User';
  document.getElementById('user-display').textContent=u.fname;
  // Show admin features
  if(u.role==='admin'){
    document.getElementById('admin-section').style.display='';
    document.getElementById('nav-roles').style.display='';
  }
  const el=document.getElementById('dash-greeting');
  const hour=new Date().getHours();
  const greet=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
  scramble(el,greet,1200);
  
  fetch('/api/employees', { headers: authHeader() })
    .then(res => res.json())
    .then(data => {
      state.employees = data.employees || [];
      renderDashboard();
      navigate('dashboard');
    })
    .catch(err => { toast('Failed to load employees', 'error'); });
}
function doLogout(){
  state.currentUser=null;
  clearToken();
  document.getElementById('auth-screen').style.display='';
  document.getElementById('main-app').classList.remove('show');
  document.getElementById('login-email').value='';
  document.getElementById('login-pass').value='';
  document.getElementById('login-btn-text').textContent='Sign In →';
  switchTab('login');
  toast('Signed out successfully.','info');
}

// ===================== NAVIGATION =====================
function navigate(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(i=>i.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const nav=document.getElementById('nav-'+page);
  if(nav) nav.classList.add('active');
  if(page==='employees') renderEmployeeTable();
  if(page==='roles') renderRolesPage();
}

// ===================== DASHBOARD =====================
const avatarColors = ['av-purple','av-cyan','av-pink','av-green','av-orange','av-red'];
function getAvatarColor(name){
  let h=0; for(let c of name) h=(h+c.charCodeAt(0))%avatarColors.length;
  return avatarColors[h];
}
function renderDashboard(){
  const emps=state.employees;
  const active=emps.filter(e=>e.status==='active').length;
  const admins=emps.filter(e=>e.role==='admin').length;
  const depts=[...new Set(emps.map(e=>e.dept))].length;
  const avgSal=emps.length?Math.round(emps.reduce((a,b)=>a+b.salary,0)/emps.length/1000):0;
  const stats=[
    {label:'Total Employees',val:emps.length,icon:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',c1:'rgba(124,110,250,.08)',c2:'#7C6EFA',c3:'#A78BFA',change:'+2 this month',up:true},
    {label:'Active Staff',val:active,icon:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',c1:'rgba(52,211,153,.06)',c2:'#10B981',c3:'#34D399',change:`${Math.round(active/emps.length*100)}% active`,up:true},
    {label:'Departments',val:depts,icon:'<rect x="2" y="3" width="4" height="18"/><rect x="10" y="3" width="4" height="18"/><rect x="18" y="3" width="4" height="18"/>',c1:'rgba(34,211,238,.06)',c2:'#22D3EE',c3:'#67E8F9',change:'Across teams',up:true},
    {label:'Avg. Salary',val:avgSal,icon:'<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',c1:'rgba(244,114,182,.06)',c2:'#EC4899',c3:'#F472B6',change:'$K avg.',up:true,isMoney:true},
  ];
  const grid=document.getElementById('stats-grid');
  grid.innerHTML=stats.map((s,i)=>`
    <div class="stat-card" style="--c1:${s.c1};--c2:${s.c2};--c3:${s.c3};animation-delay:${i*.1}s">
      <div class="stat-orbit" style="--c2:${s.c2}"></div>
      <div class="stat-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">${s.icon}</svg>
      </div>
      <div class="stat-value" id="stat-v-${i}">0</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-change up">▲ ${s.change}</div>
    </div>
  `).join('');
  setTimeout(()=>{
    stats.forEach((s,i)=>{
      const el=document.getElementById('stat-v-'+i);
      if(s.isMoney){
        let start=0,duration=1200,t=null;
        const step=ts=>{ if(!t)t=ts; const p=Math.min((ts-t)/duration,1),e=1-Math.pow(1-p,3);
          el.textContent='$'+Math.round(e*s.val)+'K';
          if(p<1)requestAnimationFrame(step); else el.textContent='$'+s.val+'K';
        }; requestAnimationFrame(step);
      } else countUp(el,s.val);
    });
  },100);
  // Recent employees table
  const recent=emps.slice(-5).reverse();
  document.getElementById('recent-body').innerHTML=recent.map((e,i)=>`
    <tr class="emp-row" style="animation-delay:${i*.07}s">
      <td>
        <div class="emp-name-cell">
          <div class="emp-avatar ${getAvatarColor(e.fname)}" style="width:32px;height:32px;font-size:11px">${e.fname[0]}${e.lname[0]}</div>
          <div>
            <div class="emp-name" style="font-size:13px">${e.fname} ${e.lname}</div>
            <div class="emp-email">${e.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${getDeptClass(e.dept)}">${e.dept}</span></td>
      <td><span class="badge ${e.status==='active'?'badge-active':'badge-inactive'}"><span class="status-dot"></span>${e.status}</span></td>
    </tr>
  `).join('');
  // Dept chart
  const deptCounts={};
  emps.forEach(e=>{ deptCounts[e.dept]=(deptCounts[e.dept]||0)+1; });
  const maxC=Math.max(...Object.values(deptCounts));
  const deptColors={'Engineering':'#7C6EFA','Design':'#F472B6','Marketing':'#FBBF24','HR':'#34D399','Finance':'#22D3EE','Operations':'#F87171'};
  document.getElementById('dept-bars').innerHTML=Object.entries(deptCounts).map(([d,c])=>`
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;margin-bottom:5px">
        <span style="font-size:12px;color:var(--text2)">${d}</span>
        <span style="font-size:12px;font-family:'JetBrains Mono',monospace;color:var(--text3)">${c}</span>
      </div>
      <div style="background:var(--surface2);border-radius:4px;height:6px;overflow:hidden">
        <div style="height:100%;border-radius:4px;background:${deptColors[d]||'#7C6EFA'};width:0;transition:width 1.2s cubic-bezier(.23,1,.32,1);box-shadow:0 0 6px ${deptColors[d]||'#7C6EFA'}" class="bar-fill" data-w="${Math.round(c/maxC*100)}%"></div>
      </div>
    </div>
  `).join('');
  setTimeout(()=>{ document.querySelectorAll('.bar-fill').forEach(b=>b.style.width=b.dataset.w); },300);
}

function getDeptClass(d){
  const m={'Engineering':'dept-eng','Design':'dept-design','Marketing':'dept-mkt','HR':'dept-hr','Finance':'dept-fin','Operations':'dept-ops'};
  return m[d]||'badge-dept';
}

// ===================== EMPLOYEE TABLE =====================
function renderEmployeeTable(){
  const q=(document.getElementById('search-input').value||'').toLowerCase();
  const filter=state.currentFilter;
  const isAdmin=state.currentUser?.role==='admin';
  let emps=state.employees.filter(e=>{
    const match=!q||(`${e.fname} ${e.lname} ${e.email} ${e.dept} ${e.position}`).toLowerCase().includes(q);
    const filt=filter==='all'||e.status===filter;
    return match&&filt;
  });
  const tbody=document.getElementById('emp-tbody');
  const empty=document.getElementById('emp-empty');
  if(!emps.length){tbody.innerHTML='';empty.style.display='';return;}
  empty.style.display='none';
  tbody.innerHTML=emps.map((e,i)=>`
    <tr class="emp-row" style="animation-delay:${i*.05}s">
      <td>
        <div class="emp-name-cell">
          <div class="emp-avatar ${getAvatarColor(e.fname)}">${e.fname[0]}${e.lname[0]}</div>
          <div>
            <div class="emp-name">${e.fname} ${e.lname}</div>
            <div class="emp-email">${e.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${getDeptClass(e.dept)}">${e.dept}</span></td>
      <td style="color:var(--text2);font-size:13px">${e.position}</td>
      <td><span class="badge ${e.role==='admin'?'badge-admin':'badge-user'}">${e.role}</span></td>
      <td><span class="badge ${e.status==='active'?'badge-active':'badge-inactive'}"><span class="status-dot"></span>${e.status}</span></td>
      <td>
        <div class="action-group">
          ${isAdmin?`
          <button class="act-btn act-edit" onclick="openEditModal(${e.id})" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="act-btn act-del" onclick="openDeleteModal(${e.id})" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
          </button>
          `:
          `<span style="color:var(--text3);font-size:12px;font-family:'JetBrains Mono',monospace">View only</span>`}
        </div>
      </td>
    </tr>
  `).join('');
}

function setFilter(f){
  state.currentFilter=f;
  ['all','active','inactive'].forEach(x=>document.getElementById('filter-'+x).className='filter-btn'+(x===f?' active':''));
  renderEmployeeTable();
}

// ===================== MODAL OPEN/CLOSE =====================
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){ document.getElementById(id).classList.remove('show'); }

function openAddModal(){
  if(state.currentUser?.role!=='admin'){toast('Admin access required.','error');return;}
  state.editId=null;
  document.getElementById('modal-title').textContent='Add Employee';
  document.getElementById('modal-sub').textContent='Fill in the details to add a new team member.';
  ['f-fname','f-lname','f-email','f-pos','f-salary'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('f-dept').value='';
  document.getElementById('f-role').value='user';
  document.getElementById('f-status').value='active';
  document.getElementById('emp-error').classList.remove('show');
  openModal('emp-modal');
}

function openEditModal(id){
  if(state.currentUser?.role!=='admin'){toast('Admin access required.','error');return;}
  const e=state.employees.find(e=>e.id===id);
  if(!e) return;
  state.editId=id;
  document.getElementById('modal-title').textContent='Edit Employee';
  document.getElementById('modal-sub').textContent='Update the employee information below.';
  document.getElementById('f-fname').value=e.fname;
  document.getElementById('f-lname').value=e.lname;
  document.getElementById('f-email').value=e.email;
  document.getElementById('f-dept').value=e.dept;
  document.getElementById('f-pos').value=e.position;
  document.getElementById('f-role').value=e.role;
  document.getElementById('f-status').value=e.status;
  document.getElementById('f-salary').value=e.salary;
  document.getElementById('emp-error').classList.remove('show');
  openModal('emp-modal');
}

function saveEmployee(){
  const fname=document.getElementById('f-fname').value.trim();
  const lname=document.getElementById('f-lname').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const dept=document.getElementById('f-dept').value;
  const pos=document.getElementById('f-pos').value.trim();
  const role=document.getElementById('f-role').value;
  const status=document.getElementById('f-status').value;
  const salary=parseInt(document.getElementById('f-salary').value)||0;
  if(!fname||!lname||!email||!dept||!pos){
    showError('emp-error','Please fill in all required fields.');return;
  }
  if(!email.includes('@')){showError('emp-error','Please enter a valid email.');return;}

  const payload = { fname, lname, email, dept, position: pos, role, status, salary };
  const url = state.editId ? `/api/employees/${state.editId}` : '/api/employees';
  const method = state.editId ? 'PUT' : 'POST';

  fetch(url, {
    method, headers: authHeader(),
    body: JSON.stringify(payload)
  }).then(res => res.json())
  .then(data => {
    if(state.editId) {
      const idx=state.employees.findIndex(e=>e.id===state.editId);
      state.employees[idx] = data.employee;
      toast('Employee updated successfully!','success');
    } else {
      state.employees.push(data.employee);
      toast('Employee added successfully!','success');
    }
    closeModal('emp-modal');
    renderEmployeeTable();
    if(document.getElementById('page-dashboard').classList.contains('active')) renderDashboard();
  })
  .catch(err => showError('emp-error', 'Failed to save employee'));
}

function openDeleteModal(id){
  if(state.currentUser?.role!=='admin'){toast('Admin access required.','error');return;}
  state.deleteId=id;
  openModal('del-modal');
}

function confirmDelete(){
  const id = state.deleteId;
  fetch(`/api/employees/${id}`, { method: 'DELETE', headers: authHeader() })
  .then(() => {
    state.employees=state.employees.filter(e=>e.id!==id);
    state.deleteId=null;
    closeModal('del-modal');
    toast('Employee deleted.','info');
    renderEmployeeTable();
    if(document.getElementById('page-dashboard').classList.contains('active')) renderDashboard();
  })
  .catch(err => toast('Failed to delete employee', 'error'));
}

// ===================== ROLES PAGE =====================
function renderRolesPage(){
  const adminPerms=[
    {label:'View All Employees',granted:true},
    {label:'Add New Employees',granted:true},
    {label:'Edit Employee Records',granted:true},
    {label:'Delete Employees',granted:true},
    {label:'Manage User Roles',granted:true},
    {label:'View System Reports',granted:true},
  ];
  const userPerms=[
    {label:'View All Employees',granted:true},
    {label:'Add New Employees',granted:false},
    {label:'Edit Employee Records',granted:false},
    {label:'Delete Employees',granted:false},
    {label:'Manage User Roles',granted:false},
    {label:'View System Reports',granted:false},
  ];
  function renderPerms(perms){
    return perms.map(p=>`
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:14px;color:var(--text2)">${p.label}</span>
        <span class="badge ${p.granted?'badge-active':'badge-inactive'}">
          <span class="status-dot"></span>${p.granted?'Granted':'Denied'}
        </span>
      </div>
    `).join('');
  }
  document.getElementById('role-perms-admin').innerHTML=renderPerms(adminPerms);
  document.getElementById('role-perms-user').innerHTML=renderPerms(userPerms);
  document.getElementById('users-tbody').innerHTML=state.users.map((u,i)=>`
    <tr class="emp-row" style="animation-delay:${i*.06}s">
      <td>
        <div class="emp-name-cell">
          <div class="emp-avatar ${getAvatarColor(u.fname)}" style="width:32px;height:32px;font-size:11px">${u.fname[0]}${u.lname[0]}</div>
          <span style="font-size:14px;font-weight:500">${u.fname} ${u.lname}</span>
        </div>
      </td>
      <td style="color:var(--text2);font-size:13px">${u.email}</td>
      <td><span class="badge ${u.role==='admin'?'badge-admin':'badge-user'}">${u.role}</span></td>
      <td>
        <button class="act-btn act-edit" onclick="toggleUserRole(${u.id})" title="Toggle Role" style="width:auto;padding:6px 12px">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          <span style="font-size:12px;margin-left:4px">Toggle</span>
        </button>
      </td>
    </tr>
  `).join('');
}

function toggleUserRole(id){
  const user=state.users.find(u=>u.id===id);
  if(!user)return;
  if(user.id===state.currentUser?.id){toast("Can't change your own role.","error");return;}
  user.role=user.role==='admin'?'user':'admin';
  toast(`${user.fname}'s role changed to ${user.role}.`,'success');
  renderRolesPage();
}

// ===================== KEYBOARD =====================
document.addEventListener('keydown', e => {
  if(e.key==='Escape'){
    document.querySelectorAll('.modal-overlay.show').forEach(m=>m.classList.remove('show'));
  }
});
document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',function(e){
  if(e.target===this) this.classList.remove('show');
}));

// ===================== ENTER KEY ON LOGIN =====================
document.getElementById('login-pass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
document.getElementById('login-email').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});

// ===================== LOADING SCREEN =====================
const loadTexts=['INITIALIZING SYSTEM','LOADING MODULES','ESTABLISHING SECURE CONNECTION','SYSTEM READY'];
let li=0;
const ltEl=document.getElementById('loader-text');
const ltInt=setInterval(()=>{
  li++;
  if(li<loadTexts.length) scramble(ltEl,loadTexts[li],600);
  else {
    clearInterval(ltInt);
    setTimeout(()=>{
      const loader=document.getElementById('loader');
      loader.style.transition='opacity .5s';
      loader.style.opacity='0';
      setTimeout(()=>loader.style.display='none',500);
    },300);
  }
},700);
