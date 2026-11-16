const $=s=>document.querySelector(s),R=n=>Math.random()*n|0;
const shuf=a=>{a=[...a];for(let i=a.length;i>1;){const j=R(i--);[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=n=>shuf([...Array(98).keys()]).slice(0,n);
const G=(i,s=36)=>`<span class="gw" style="--k:${s/36}">${glyph(i,s)}</span>`,row=a=>`<span class="row">${a.map(i=>G(i,34)).join('')}</span>`;
const NAMES=['謎1 五十音表','謎2 スケルトン','謎3 しりとり','謎4 ババ抜き','謎5 覆面算','最終解答'];
const fmt=ms=>{const s=ms/1000;return String(s/60|0).padStart(2,'0')+':'+(s%60).toFixed(1).padStart(4,'0')};
// ---- 謎1: 五十音表(横長10列×5行)。紙A=表、紙B=①②③の位置 ----
function g0(){const ids=pick(50),cl=shuf([...Array(50).keys()]).slice(0,3);
 const tb=f=>'<table class="t">'+[0,1,2,3,4].map(r=>'<tr>'+[...Array(10).keys()].map(c=>`<td>${f(r*10+c)}</td>`).join('')+'</tr>').join('')+'</table>';
 return{ans:cl.map(i=>ids[i]),papers:[tb(i=>G(ids[i],32)),tb(i=>cl.includes(i)?`<b class="mk">${'①②③'[cl.indexOf(i)]}</b>`:'')]}}
// ---- 謎2: スケルトン(6単語・盤面3種×転置・解は1通り) ----
const TP=[[[0,0,'H',5],[0,0,'V',4],[0,4,'V',5],[3,0,'H',3],[3,2,'V',4],[6,2,'H',5]],
[[0,0,'V',5],[0,0,'H',4],[0,3,'V',6],[2,0,'H',4],[4,0,'H',4],[5,3,'H',4]],
[[0,1,'H',5],[0,1,'V',4],[0,5,'V',6],[3,1,'H',3],[3,3,'V',4],[5,3,'H',3]]];
function cnt(S,W){let n=0;const g={};(function f(i,u){if(i==S.length){n++;return}
 for(let w=0;w<W.length;w++){if(u>>w&1||W[w].length!=S[i].length)continue;const st=[];let ok=1;
  S[i].forEach((k,j)=>{if(g[k]===undefined){g[k]=W[w][j];st.push(k)}else if(g[k]!=W[w][j])ok=0});
  if(ok)f(i+1,u|1<<w);st.forEach(k=>delete g[k])}})(0,0);return n}
function g1(){const T=TP[R(3)],tr=R(2);
 const S=T.map(([r,c,d,l])=>[...Array(l).keys()].map(i=>{const a=r+(d=='V'?i:0),b=c+(d=='H'?i:0);return(tr?[b,a]:[a,b])+''}));
 const ks=[...new Set(S.flat())],H=Math.max(...ks.map(k=>+k.split(',')[0]))+1,C=Math.max(...ks.map(k=>+k.split(',')[1]))+1;
 let mp,W,A,ok=0,tries=0;
 while(!ok){tries++;const ids=pick(7+R(4));mp={};ks.forEach(k=>mp[k]=ids[R(ids.length)]);W=S.map(s=>s.map(k=>mp[k]));
  A=W;ok=new Set(A.map(w=>w+'')).size==6&&cnt(S,A)==1}   // 余りのカギなし。文字の使い回しでひっかけ、解は必ず1通り
 const st=shuf(ks).slice(0,3);let b=`<div class="bd" style="grid-template-columns:repeat(${C},var(--u))">`;
 for(let r=0;r<H;r++)for(let c=0;c<C;c++){const k=r+','+c;b+=mp[k]===undefined?'<i></i>':`<b>${st.includes(k)?'①②③'[st.indexOf(k)]:''}</b>`}
 return{ans:st.map(k=>mp[k]),tries,papers:[`<div class="sk">${b}</div><div class="wl">${shuf(A).map(w=>`<div>${row(w)}</div>`).join('')}</div></div>`]}}
// ---- 謎3: しりとり(6単語・同頭/同末をあえて重ね、つなぎ方は1通り・紙にバラバラ配置) ----
const hp=ws=>{let n=0;const f=(l,u)=>{if(n>1)return;if(u==63){n++;return}for(let i=0;i<6;i++)if(!(u>>i&1)&&(l<0||ws[l][2]==ws[i][0]))f(i,u|1<<i)};f(-1,0);return n};
function g2(){let W,t=0,ok=0;
 do{const ids=pick(14),pool=ids.slice(0,4+R(3)),mid=ids.slice(7),a=[...Array(7)].map(()=>pool[R(pool.length)]);
  W=[0,1,2,3,4,5].map(k=>[a[k],mid[k],a[k+1]]);
  const dup=12-new Set(W.map(w=>w[0])).size-new Set(W.map(w=>w[2])).size;
  ok=dup>=2&&hp(W)==1}while(!ok&&++t);
 const cl=shuf([...Array(18).keys()]).slice(0,3).map(i=>[i/3|0,i%3]),pos=[];
 W.forEach(()=>{let p;for(let k=0;k<500;k++){p=[Math.random()*6.2,Math.random()*6.8];if(pos.every(q=>Math.abs(q[0]-p[0])>3.5||Math.abs(q[1]-p[1])>1.5))break}pos.push(p)});
 return{ans:cl.map(([k,m])=>W[k][m]),tries:t,papers:[`<div class="sc" style="height:calc(var(--u)*8)">${W.map((w,i)=>`<span style="left:calc(var(--u)*${pos[i][0]});top:calc(var(--u)*${pos[i][1]});transform:rotate(${R(13)-6}deg)">${row(w)}</span>`).join('')}</div><div class="cl">${cl.map(([k,m])=>`<span>${k+1}-${m+1}</span>`).join('')}</div>`]}}
// ---- 謎4: ババ抜き(バラバラ配置、消して左から読む) ----
function g3(){const ids=pick(9),sg=ids.slice(6);let a=[];for(let i=0;i<6;i++)a.push(ids[i],ids[i]);a.push(...sg);a=shuf(a);
 let P;for(;;){P=[];let bad=0;for(const g of a){const s=sg.includes(g);let ok=0;
  for(let k=0;k<400&&!ok;k++){const p=[Math.random()*8.2,Math.random()*6.4,s];if(P.every(q=>Math.hypot(q[0]-p[0],q[1]-p[1])>1.5&&!(q[2]&&s&&Math.abs(q[0]-p[0])<1))){P.push(p);ok=1}}
  if(!ok){bad=1;break}}if(!bad)break}
 const ans=a.map((g,i)=>[g,P[i][0]]).filter(u=>sg.includes(u[0])).sort((u,v)=>u[1]-v[1]).map(u=>u[0]);
 return{ans,papers:[`<div class="sc" style="height:calc(var(--u)*7.6)">${a.map((g,i)=>`<span style="left:calc(var(--u)*${P[i][0]});top:calc(var(--u)*${P[i][1]});transform:rotate(${R(31)-15}deg)">${G(g,40)}</span>`).join('')}</div>`]}}
// ---- 謎5: 覆面算 ----
function g4(){const m=pick(10),x=R(377)+123,y=R(400)+100,n=v=>String(v).split('').map(d=>m[+d]);
 return{ans:n(x+y),papers:['<table class="t"><tr>'+m.map((_,d)=>`<th>${d}</th>`).join('')+'</tr><tr>'+m.map(i=>`<td>${G(i,30)}</td>`).join('')+'</tr></table>',`<div class="ex">${row(n(x))} + ${row(n(y))} = ?</div>`]}}
// ---- 謎6: ポリオミノ(盤面5×6、解は回転・反転込みで1通り) ----
const norm=cs=>{const mr=Math.min(...cs.map(p=>p[0])),mc=Math.min(...cs.map(p=>p[1]));return cs.map(p=>[p[0]-mr,p[1]-mc]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])};
const orients=cs=>{const s=new Map();let p=cs;for(let f=0;f<2;f++){for(let r=0;r<4;r++){p=p.map(([a,b])=>[b,-a]);const q=norm(p);s.set(q+'',q)}p=p.map(([a,b])=>[a,-b])}return[...s.values()]};
function solve(h,w,P,cap=2,mask){const O=P.map(p=>[norm(p)]),g=mask?mask.slice():Array(h*w).fill(0);let n=0;
 (function f(u){const e=g.indexOf(0);if(e<0){n++;return}const er=e/w|0,ec=e%w;
  for(let i=0;i<P.length&&n<cap;i++){if(u>>i&1)continue;for(const o of O[i]){const dr=er-o[0][0],dc=ec-o[0][1];
   if(o.every(([a,b])=>{const r=a+dr,c=b+dc;return r>=0&&r<h&&c>=0&&c<w&&!g[r*w+c]})){o.forEach(([a,b])=>g[(a+dr)*w+b+dc]=1);f(u|1<<i);o.forEach(([a,b])=>g[(a+dr)*w+b+dc]=0)}}}})(0);return n}
const tf=(cs,k,f)=>{let p=cs;for(let i=0;i<k;i++)p=p.map(([a,b,g])=>[b,-a,g]);if(f)p=p.map(([a,b,g])=>[a,-b,g]);const mr=Math.min(...p.map(q=>q[0])),mc=Math.min(...p.map(q=>q[1]));return p.map(([a,b,g])=>[a-mr,b-mc,g])};
const PEN=['01,02,10,11,21','00,10,20,30,40','00,10,20,30,31','01,11,20,21,30','00,01,10,11,20','00,01,02,11,21','00,02,10,11,12','00,10,20,21,22','00,10,11,21,22','01,10,11,12,21','01,10,11,21,31','00,01,11,21,22'].map(s=>s.split(',').map(x=>[+x[0],+x[1]]));
function mkP(){for(;;){const set=new Set();let P=[],ok=1,r0=99,r1=-99,c0=99,c1=-99;
  const add=cs=>{cs.forEach(([r,c])=>{set.add(r+','+c);r0=Math.min(r0,r);r1=Math.max(r1,r);c0=Math.min(c0,c);c1=Math.max(c1,c)});P.push(cs)};
  for(const t of shuf(PEN).slice(0,6)){const os=orients(t),cand=[];
   if(!P.length){add(os[R(os.length)].map(([a,b])=>[a+4,b+4]));continue}
   for(const o of os)for(let dr=0;dr<12;dr++)for(let dc=0;dc<12;dc++){const cs=o.map(([a,b])=>[a+dr,b+dc]);
    if(cs.some(([r,c])=>set.has(r+','+c)))continue;
    if(!cs.some(([r,c])=>set.has((r-1)+','+c)||set.has((r+1)+','+c)||set.has(r+','+(c-1))||set.has(r+','+(c+1))))continue;
    let a0=r0,a1=r1,b0=c0,b1=c1;cs.forEach(([r,c])=>{a0=Math.min(a0,r);a1=Math.max(a1,r);b0=Math.min(b0,c);b1=Math.max(b1,c)});
    const h=a1-a0+1,w=b1-b0+1;if(h>7||w>7)continue;cand.push([Math.max(h,w)*10+h*w/10,cs])}
   if(!cand.length){ok=0;break}
   const m=Math.min(...cand.map(c=>c[0])),good=cand.filter(c=>c[0]<=m+15);add(good[R(good.length)][1])}
  if(!ok)continue;
  const h=r1-r0+1,w=c1-c0+1;
  P=P.map(p=>p.map(([r,c])=>[r-r0,c-c0]));
  const mask=Array(h*w).fill(1);P.flat().forEach(([r,c])=>mask[r*w+c]=0);
  if(solve(h,w,P,2,mask)==1)return{P,h,w,mask}}
 return null}
function g5(){const{P,h,w,mask}=mkP(),t=0;
 const N=h*w,ids=pick(N),cells=[...Array(N).keys()].filter(i=>!mask[i]),st=shuf(cells).slice(0,3);
 const b=`<div class="bd" style="grid-template-columns:repeat(${w},var(--u))">`+[...Array(N).keys()].map(i=>mask[i]?'<i></i>':`<b>${st.includes(i)?'①②③'[st.indexOf(i)]:''}</b>`).join('')+'</div>';
 const pcs=shuf(P.map((p,k)=>{const q=tf(p.map(([r,c])=>[r,c,ids[r*w+c]]),0,0),H=Math.max(...q.map(c=>c[0]))+1,W=Math.max(...q.map(c=>c[1]))+1;let s=`<div class="pc" style="grid-template-columns:repeat(${W},var(--u))">`;
  for(let r=0;r<H;r++)for(let c=0;c<W;c++){const m=q.find(z=>z[0]==r&&z[1]==c);s+=m?`<b style="background:hsl(${k*47%360},65%,86%)">${G(m[2],30)}</b>`:'<i></i>'}return s+'</div>'}));
 return{ans:st.map(i=>ids[i]),papers:[b,`<div class="pcs">${pcs.join('')}</div>`],tries:t}}
// ---- 進行 ----
const IM=[[null,null],['2'],['3'],['4'],[null,null],['6a',null],[null]];   // ルール説明画像: nullは画像なし
const WU=[10.2,7.2,9.6,9.6,10.2,7.2,8.4];
const IMG=n=>`images/rule-${n}.png`;
const PENALTY=10;  // 誤答1回あたりの加算秒(0で無効)
let D,FA,POS,FIG,cur,fin,t0,tEnd,pen=0,miss=0,mode=0,first=null;
$('#ti').innerHTML=[5,58,19,77,33].map(i=>G(i,30)).join('');
function start(){D=[g0(),g1(),g2(),g3(),g4(),g5()];POS=D.map(()=>1+R(3));FA=D.map((d,i)=>d.ans[POS[i]-1]);
 let f='<div class="fg" style="grid-template-columns:repeat(7,var(--u))"><i></i>'+D.map((_,i)=>`<small>Q${i+1}</small>`).join('');
 for(let r=0;r<5;r++){f+=r==2?'<em>➡</em>':'<i></i>';D.forEach((_,i)=>{const k=r-2+POS[i]-1;f+=k>=0&&k<3?`<b class="${r==2?'hl':''}"></b>`:'<i></i>'})}
 FIG=f+'</div><div id="ans"></div>';
 fin=[];cur=0;tEnd=0;pen=0;miss=0;t0=performance.now();$('#start').hidden=true;$('#res').hidden=true;$('#game').hidden=false;render();tick()}
function tick(){if(tEnd)return;$('#tm').textContent=fmt(performance.now()-t0+pen*1000);requestAnimationFrame(tick)}
function fit(){const p=$('#pz');p.style.setProperty('--w',WU[cur]);p.style.setProperty('--u',Math.min(36,(document.documentElement.clientWidth-48)/WU[cur])+'px')}
window.onresize=()=>{if(D)fit()};
function render(){
 $('#tabs').innerHTML=[0,1,2,3,4,5,6].map(i=>`<button data-t="${i}" class="${i==cur?'on':''}">${i<6?'Q'+(i+1):'★'}</button>`).join('');
 fit();const P=cur<6?D[cur].papers:[FIG];
 $('#pz').innerHTML=P.map((p,i)=>{const im=IM[cur][i];return`<div class="paper"><div class="qn">${cur<6?'Q'+(cur+1):'★'}</div>${im?`<img class="rule" src="${IMG(im)}" data-n="rule-${im}.png" alt="">`:''}${p}</div>`}).join('');
 document.querySelectorAll('.rule').forEach(i=>i.onerror=()=>{const d=document.createElement('div');d.className='ph';d.textContent=i.dataset.n;i.replaceWith(d)});
 $('#kb').hidden=cur!=6;drawAns();drawKb()}
function drawAns(){const a=$('#ans');if(!a)return;a.innerHTML=[0,1,2,3,4,5].map(i=>`<div class="sl"><small>${i+1}</small>${fin[i]!==undefined?G(fin[i],40):'<span class="em"></span>'}</div>`).join('')}
const part=(k,i)=>{const w=k=='L'||k=='R'?[50,100]:[100,50];return`<svg viewBox="0 0 ${w[0]} ${w[1]}" width="${w[0]*.6}" height="${w[1]*.6}" style="color:#222">${PARTS[k][i]}</svg>`};
function drawKb(){const k=mode?['T','B']:['L','R'];
 const pk=s=>[0,1,2,3,4,5,6].map(i=>`<button data-p="${s}${i}" class="${s==0&&first===i?'on':''}">${part(k[s],i)}</button>`).join('');
 $('#kb').innerHTML=`<div class="kg">${pk(0)}${pk(1)}<button data-m="0" class="${mode?'':'on'}">◧</button><button data-m="1" class="${mode?'on':''}">⬒</button><i></i><i></i><i></i><button id="del">⌫</button><button id="ok">✔</button></div>`}
function check(){if(fin.length==6&&fin.every((x,i)=>x==FA[i])){tEnd=performance.now();return finish()}
 const a=$('#ans');a.classList.add('ng');miss++;pen+=PENALTY;
 if(PENALTY){const p=$('#pn');p.textContent='+'+PENALTY;p.classList.remove('f');void p.offsetWidth;p.classList.add('f')}
 setTimeout(()=>{fin=[];a.classList.remove('ng');drawAns()},500)}
function finish(){const ms=tEnd-t0+pen*1000,t=fmt(ms);let best='';
 try{const b=+localStorage.getItem('kuuso_best')||0;if(!b||ms<b){localStorage.setItem('kuuso_best',ms);best='NEW!'}else best=fmt(b)}catch(e){}
 const rk=ms<480000?'S':ms<720000?'A':ms<1080000?'B':'C';   // 8分/12分/18分
 $('#tm').textContent=t;$('#game').hidden=true;$('#res').hidden=false;
 $('#res').innerHTML=`<div class="paper" style="text-align:center;--w:8"><div class="stamp">${rk}</div><p class="big">${t}</p><p>✗ ${miss}　🏆 ${best}</p><a class="tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('架空の言語でベタ謎解き！を '+t+'（ランク'+rk+'）でクリアしました！\n#架空言語ベタ謎解き')}">POST</a><p><button id="go">↻</button></p></div>`}
document.onclick=e=>{
 if(e.target.closest('#env')){const v=$('#env');if(!v.classList.contains('open')){v.classList.add('open');setTimeout(start,800)}return}
 const b=e.target.closest('button');if(!b)return;
 if(b.id=='go'){$('#env').classList.remove('open');$('#res').hidden=true;$('#start').hidden=false;$('#tm').textContent='00:00.0';return}
 if(b.dataset.t!==undefined){cur=+b.dataset.t;first=null;return render()}
 if(b.dataset.m!==undefined){mode=+b.dataset.m;first=null;return drawKb()}
 if(b.dataset.p){const s=+b.dataset.p[0],i=+b.dataset.p[1];
  if(!s){first=i;return drawKb()}if(first===null)return;
  if(fin.length<6)fin.push(mode*49+first*7+i);first=null;drawAns();return drawKb()}
 if(b.id=='del'){fin.pop();return drawAns()}
 if(b.id=='ok')check()};
