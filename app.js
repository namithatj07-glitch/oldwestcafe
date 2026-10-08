const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const FILTERS=[["all","All"],["popular","Popular"],["new","New"],["breakfast","Breakfast"],["sweet","Sweet"],["savory","Savory"],["texmex","Tex-Mex"],["lunch","Lunch"],["veg","Vegetarian"]];
const MOODS=[["Sweet","sweet","Sweet tooth activated."],["Savory","savory","Savory mode: on."],["Big Breakfast","big","Big breakfast energy."],["Light","light","Light and still worth it."],["Tex-Mex","texmex","Spice level: yes."],["Lunch","lunch","Lunch, but make it Texas."]];
let M,fil="all",cat="All";
const img=d=>d.image||`images/dishes/${d.slug}.jpg`;
const price=d=>d.price!=null&&d.price!==""?"$"+Number(d.price).toFixed(2):"Price shown when you order";
const bc=b=>b==="New"?"new":/Signature/.test(b)?"sig":"";
function ph(d,sz){return `<div class="ph" data-name="${esc(d.name)}"><img src="${esc(img(d))}" alt="${esc(d.name)}: ${esc(d.desc.split(".")[0])}" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('noimg')">${d.badge?`<span class="tag ${bc(d.badge)}">${esc(d.badge)}</span>`:""}</div>`}
function card(d){return `<article class="dish">${ph(d)}<div class="in"><span class="cat">${esc(d.cat)}</span><h3>${esc(d.name)}</h3><p class="d">${esc(d.desc)}</p>
<div class="row"><span>${price(d)}${d.available===false?" · Sold out":""}</span><button class="link" data-slug="${d.slug}">View details</button></div></div></article>`}
const ordUrl=l=>(l&&l.orderUrl)||M.site.orderUrl;
function open(slug){const d=M.dishes.find(x=>x.slug===slug);$("#dBody").innerHTML=`${ph(d)}<div class="in"><span class="cat">${esc(d.cat)}</span><h3 id="dN">${esc(d.name)}</h3><p>${esc(d.desc)}</p>${d.ing?`<div class="ing">${d.ing.map(i=>`<i>${esc(i)}</i>`).join("")}</div>`:""}<p><b>${price(d)}</b></p><a class="btn" href="${esc(d.orderUrl||M.site.orderUrl)}">Order online</a></div>`;$("#dlg").setAttribute("aria-labelledby","dN");$("#dlg").showModal()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-slug]");if(b)open(b.dataset.slug);if(e.target===$("#dlg"))$("#dlg").close()});
function render(){const q=$("#q").value.trim().toLowerCase();
const l=M.dishes.filter(d=>d.available!==false||true).filter(d=>(cat==="All"||d.cat===cat)&&(fil==="all"||(fil==="popular"?d.popular:fil==="new"?d.badge==="New":d.tags.includes(fil)))&&(!q||(d.name+d.desc+d.cat+(d.ing||[]).join()).toLowerCase().includes(q)));
$("#count").textContent=l.length+(l.length===1?" dish":" dishes");
$("#grid").innerHTML=l.length?l.map(card).join(""):`<div class="empty"><b>Nothing on this trail.</b><br>Try another word or clear the filters.</div>`}
fetch("menu.json").then(r=>r.json()).then(m=>{M=m;
document.querySelectorAll("[data-order]").forEach(a=>a.href=m.site.orderUrl);
$("#feat").innerHTML=m.dishes.filter(d=>d.featured&&d.available!==false).slice(0,3).map(card).join("");
$("#fresh").innerHTML=m.dishes.filter(d=>d.badge==="New").slice(0,4).map(card).join("");
$("#filters").innerHTML=FILTERS.map(f=>`<button aria-pressed="${f[0]==="all"}" data-f="${f[0]}">${f[1]}</button>`).join("");
$("#cats").innerHTML=["All",...m.cats].map(c=>`<button aria-pressed="${c==="All"}" data-c="${c}">${c}</button>`).join("");
$("#mood").innerHTML=MOODS.map(x=>`<button data-m="${x[1]}">${x[0]}</button>`).join("");
$("#hrs").textContent=m.site.hours;$("#mail").textContent=m.site.email;$("#mail").href="mailto:"+m.site.email;
$("#locs").innerHTML=m.locations.map(l=>`<article class="loc"><h3>${l.name}</h3><span>${l.address}</span><span class="mute">${m.site.hours}</span><a href="tel:${l.phone.replace(/\D/g,"")}"><b>${l.phone}</b></a><div class="a"><a class="btn alt" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Oldwest Cafe "+l.address)}">Directions</a><a class="btn" href="${esc(ordUrl(l))}">Order online</a></div></article>`).join("");
$("#orderBtns").innerHTML=m.locations.map(l=>`<a class="btn" href="${esc(ordUrl(l))}">${l.name}</a>`).join("");
$("#flocs").innerHTML=m.locations.map(l=>`<span>${l.name}, TX · ${l.phone}</span>`).join("");
render()});
$("#filters").onclick=e=>{const b=e.target.closest("button");if(!b)return;fil=b.dataset.f;$("#filters").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));render()};
$("#cats").onclick=e=>{const b=e.target.closest("button");if(!b)return;cat=b.dataset.c;$("#cats").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));render()};
$("#q").oninput=render;
$("#mood").onclick=e=>{const b=e.target.closest("button");if(!b)return;const x=MOODS.find(m=>m[1]===b.dataset.m);
const r=M.dishes.filter(d=>d.tags.includes(x[1])).sort((a,c)=>(c.popular?1:0)-(a.popular?1:0)||Math.random()-.5).slice(0,3);
$("#moodMsg").textContent=x[2];$("#moodOut").innerHTML=r.map(card).join("")};
