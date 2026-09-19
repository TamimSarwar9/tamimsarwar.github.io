const doctors=[
{id:1,n:"Dr. Arif Rahman",s:"Cardiology",q:"MBBS, FCPS (Cardiology)",t:"10:30 AM",f:1200,i:"🫀",d:"Cardiology"},
{id:2,n:"Dr. Nusrat Jahan",s:"Obstetrics & Gynecology",q:"MBBS, FCPS, MRCOG",t:"11:00 AM",f:1000,i:"👩‍⚕️",d:"Gynecology"},
{id:3,n:"Dr. Samiul Karim",s:"Neurology",q:"MBBS, MD (Neurology)",t:"12:30 PM",f:1400,i:"🧠",d:"Neurology"},
{id:4,n:"Dr. Farhana Ahmed",s:"Pediatrics",q:"MBBS, DCH, FCPS",t:"02:00 PM",f:900,i:"🧸",d:"Pediatrics"},
{id:5,n:"Dr. Mahmud Hasan",s:"Orthopedics",q:"MBBS, MS (Ortho)",t:"03:30 PM",f:1100,i:"🦴",d:"Orthopedics"},
{id:6,n:"Dr. Tareq Hossain",s:"Dermatology",q:"MBBS, DDV",t:"05:00 PM",f:900,i:"✨",d:"Dermatology"}
];
const depts=[["Cardiology","Heart & vascular care","🫀"],["Neurology","Brain & nerve care","🧠"],["Orthopedics","Bone & joint care","🦴"],["Gynecology","Women’s health","🌸"],["Pediatrics","Child healthcare","🧸"],["Dermatology","Skin & hair care","✨"],["General Medicine","Adult primary care","🩺"],["Surgery","Advanced surgical care","🏥"]];
const times=["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:30 PM","02:00 PM","02:30 PM","03:30 PM","04:00 PM","05:00 PM"];
let appointments=JSON.parse(localStorage.getItem("mpV2")||"[]"), activeFilter="All";

const $=x=>document.querySelector(x);
function renderFilters(){let cats=["All",...new Set(doctors.map(d=>d.d))];$("#filters").innerHTML=cats.map(c=>`<button class="filter ${c===activeFilter?"active":""}" data-filter="${c}">${c}</button>`).join("");document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{activeFilter=b.dataset.filter;renderFilters();renderDoctors()})}
function renderDoctors(){let q=$("#search").value.toLowerCase();let list=doctors.filter(d=>(activeFilter==="All"||d.d===activeFilter)&&(d.n+d.s+d.d).toLowerCase().includes(q));$("#doctorsGrid").innerHTML=list.map(d=>`<article class="doctor"><div class="docline"><div class="avatar">${d.i}</div><div><h3>${d.n}</h3><span class="spec">${d.s}</span></div></div><p>${d.q}</p><div class="docfoot"><span class="avail">● Available · ${d.t}</span><button class="btn softbtn" onclick="chooseDoctor(${d.id})">Book</button></div></article>`).join("")||"<div>No matching doctor found.</div>"}
function renderDepts(){$("#deptGrid").innerHTML=depts.map(d=>`<article class="dept"><i>${d[2]}</i><h3>${d[0]}</h3><span>${d[1]}</span></article>`).join("");$("#dept").innerHTML=depts.map(d=>`<option>${d[0]}</option>`).join("");updateDocs()}
function updateDocs(){let list=doctors.filter(d=>d.d===$("#dept").value);$("#doc").innerHTML=list.map(d=>`<option value="${d.id}">${d.n} — ${d.t}</option>`).join("")}
function renderTimes(){$("#time").innerHTML=times.map(t=>`<option>${t}</option>`).join("")}
function chooseDoctor(id){let d=doctors.find(x=>x.id===id);$("#dept").value=d.d;updateDocs();$("#doc").value=id;$("#booking").scrollIntoView({behavior:"smooth"});$("#name").focus()}
function toast(m){let t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function openModal(html){$("#modalBody").innerHTML=html;$("#modal").classList.add("show")}
function closeModal(){$("#modal").classList.remove("show")}
document.querySelectorAll("[data-book]").forEach(b=>b.onclick=()=>$("#booking").scrollIntoView({behavior:"smooth"}));
$("#search").oninput=renderDoctors;$("#dept").onchange=updateDocs;
$("#form").onsubmit=e=>{e.preventDefault();let d=doctors.find(x=>x.id===$("#doc").value), serial="A-"+String(20+appointments.length+1).padStart(2,"0"), a={serial,doctor:d.n,date:$("#date").value,time:$("#time").value,patient:$("#name").value,phone:$("#phone").value};appointments.push(a);localStorage.setItem("mpV2",JSON.stringify(appointments));openModal(`<div class="success"><div class="check">✓</div><span class="kicker">APPOINTMENT CONFIRMED</span><div class="serial">${serial}</div><h2>Your place is reserved.</h2><p><b>${d.n}</b><br>${d.s}<br>${a.date} · ${a.time}<br><br>Patient: ${a.patient}</p><button class="btn primary" onclick="closeModal()">Done</button></div>`);e.target.reset();setDate();renderTimes();updateDocs()};
$("#close").onclick=closeModal;$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
$("#loginBtn").onclick=()=>openModal(`<div class="login"><span class="kicker">PATIENT PORTAL</span><h2>Welcome back.</h2><p>Demo login screen — connect this form to your secure authentication backend.</p><label>Email<input type="email" placeholder="patient@example.com"></label><label>Password<input type="password" placeholder="••••••••"></label><button class="btn primary">Sign in</button><p>New here? Your production version can include registration, OTP and password recovery.</p></div>`);
$("#portalBtn").onclick=()=>openModal(`<div class="login"><span class="kicker">PATIENT DASHBOARD</span><h2>Your care, together.</h2><p>Production-ready sections planned for this portal include appointments, live serial, prescriptions, lab reports, invoices, profile and notifications.</p><button class="btn primary" onclick="closeModal()">Continue</button></div>`);
let qn=8;$("#queueAdvance").onclick=()=>{qn++;$("#queueNumber").textContent="A-"+String(qn).padStart(2,"0");$("#queueCurrent").textContent="A-"+String(qn).padStart(2,"0");$("#wait").textContent="~ "+(12+qn-8)*2+" min";$("#track").style.width=Math.min(92,63+(qn-8)*6)+"%";toast("Queue updated · next patient is being served.")};
$("#hamb").onclick=()=>$("#nav").classList.toggle("open");
function setDate(){let d=new Date();$("#date").min=d.toISOString().slice(0,10);$("#date").value=d.toISOString().slice(0,10)}
renderFilters();renderDoctors();renderDepts();renderTimes();setDate();
setInterval(()=>{let n=7+Math.floor(Math.random()*5);$("#heroPatients").textContent=String(n).padStart(2,"0")},4500);
