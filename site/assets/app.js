(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],K=window.KB,inr=n=>'₹'+n.toLocaleString('en-IN'),enc=encodeURIComponent;
const track=n=>{try{window.plausible&&window.plausible(n)}catch(e){}};
document.addEventListener('click',e=>{const a=e.target.closest('[data-track]');if(a)track(a.dataset.track)});
/* nav */
const nv=$('#nv'),bg=$('#bg');bg.onclick=()=>{const o=nv.classList.toggle('o');bg.setAttribute('aria-expanded',o)};
/* language toggle: nav and hero only (Malayalam strings need proofreading) */
const lg=$('#lg');let ml=false;$$('[data-ml]').forEach(e=>e.dataset.en=e.innerHTML);
lg.onclick=()=>{ml=!ml;$$('[data-ml]').forEach(e=>e.innerHTML=ml?e.dataset.ml:e.dataset.en);lg.textContent=ml?'English':'മലയാളം';document.documentElement.lang=ml?'ml':'en'};
/* themes: search, filter, sort */
const tg=$('#tg');if(tg&&$('#q')){const cards=$$('#tg .tc');const f=()=>{const q=$('#q').value.trim().toLowerCase(),s=$('#sty').value,p=+$('#prc').value||1e9,o=$('#srt').value;let n=0;
cards.forEach(c=>{const ok=c.dataset.n.includes(q)&&(!s||c.dataset.tg.split(' ').includes(s))&&+c.dataset.p<=p;c.hidden=!ok;n+=ok});
[...cards].sort((a,b)=>o=='1'?a.dataset.p-b.dataset.p:o=='2'?b.dataset.p-a.dataset.p:b.dataset.o-a.dataset.o).forEach(c=>tg.append(c));$('#cnt').textContent=n+(n==1?' theme':' themes')+' shown'};
['#q','#sty','#prc','#srt'].forEach(i=>$(i).oninput=f);f()}
/* theme page: add-on calculator */
const tt=$('#tt');if(tt){$('#ad').onchange=()=>{const x=$$('#ad input:checked'),sum=x.reduce((a,c)=>a+ +c.dataset.p,0);tt.querySelector('b').textContent=inr(+tt.dataset.base+sum);const g=$('#go');g.href=g.href.split('&a=')[0]+(x.length?'&a='+x.map(c=>c.value).join(','):'')}}
/* order wizard */
const of=$('#of');if(of){let s=0;const S=$$('#of .s'),L=$$('#sts li'),nx=$('#nx'),bk=$('#bk'),th=$('#t'),ad=$('#ad'),val=id=>$('#'+id).value.trim();
th.innerHTML=K.themes.map(t=>`<option value="${t.id}">${t.n} · ${inr(t.p)}</option>`).join('')+`<option value="bespoke">Bespoke Studio · from ${inr(K.bespoke)}</option>`;
ad.innerHTML=K.addons.map((a,i)=>`<label><input type="checkbox" value="${i}"> ${a[0]} (+${inr(a[1])})</label>`).join('');
const q=new URLSearchParams(location.search),qt=q.get('theme');if(qt&&[...th.options].some(o=>o.value==qt))th.value=qt;(q.get('a')||'').split(',').forEach(i=>{const c=ad.querySelector(`[value="${i}"]`);if(c)c.checked=true});
const tot=()=>{const b=th.value=='bespoke'?K.bespoke:K.themes.find(t=>t.id==th.value).p,v=b+$$('#ad input:checked').reduce((a,c)=>a+K.addons[c.value][1],0);$('#tot').textContent=inr(v)+(th.value=='bespoke'?'+':'')};of.onchange=tot;tot();
const msg=()=>{const a=$$('#ad input:checked').map(c=>K.addons[c.value][0]),t=th.value=='bespoke'?'Bespoke Studio':K.themes.find(x=>x.id==th.value).n;
return `Hello ${K.brand}! I would like to order a wedding invitation.\nName: ${val('n')}\nWhatsApp: ${val('ph')}`+(val('em')?`\nEmail: ${val('em')}`:'')+(val('ct')?`\nCity: ${val('ct')}`:'')+`\nTheme: ${t}\nAdd-ons: ${a.length?a.join(', '):'None'}\nEstimated total: ${$('#tot').textContent}\nBride: ${val('br')}\nGroom: ${val('gr')}\nWedding date: ${val('dt')}\nCeremony: ${val('cm')}\nLanguage: ${val('lg2')}`+(val('vn')?`\nVenue: ${val('vn')}`:'')+(val('nt')?`\nNotes: ${val('nt')}`:'')};
function valid(){$$('#of .er').forEach(e=>e.textContent='');let g=true;const f=(id,c,m)=>{const el=$('#'+id);if(!c(el.value.trim())){el.parentNode.querySelector('.er').textContent=m;if(g)el.focus();g=false}};
if(s==0){f('n',x=>x.length>1,'Please enter your name.');f('ph',x=>/^[6-9]\d{9}$/.test(x.replace(/\D/g,'').slice(-10)),'Enter a valid 10-digit mobile number.')}
if(s==2){f('br',x=>x.length>1,'Enter the bride’s name.');f('gr',x=>x.length>1,'Enter the groom’s name.');f('dt',x=>!!x,'Choose the wedding date.')}
if(s==3&&!$('#ag').checked){$('#e4').textContent='Please accept the Terms and Privacy Policy.';g=false}return g}
function show(n){S.forEach((x,i)=>x.hidden=i!=n);L.forEach((l,i)=>l.className=i==n?'on':i<n?'dn':'');bk.hidden=n==0;nx.textContent=n==3?'Send on WhatsApp':'Next';if(n==3)$('#rv').replaceChildren(...msg().split('\n').map(l=>{const p=document.createElement('p');p.textContent=l;return p}));track('order-step-'+(n+1))}
nx.onclick=()=>{if(!valid())return;if(s<3){show(++s);scrollTo({top:0,behavior:'smooth'});return}
const m=msg();if(K.endpoint){try{fetch(K.endpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({name:val('n'),phone:val('ph'),email:val('em'),message:m})})}catch(e){}}
track('order-sent');open('https://wa.me/'+K.phone+'?text='+enc(m),'_blank','noopener')};
bk.onclick=()=>show(--s);of.onsubmit=e=>e.preventDefault();show(0)}
})();
