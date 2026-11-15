const $=s=>document.querySelector(s),R=n=>Math.random()*n|0;
const shuf=a=>{a=[...a];for(let i=a.length;i>1;){const j=R(i--);[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=n=>shuf([...Array(98).keys()]).slice(0,n);
const G=(i,s=34)=>glyph(i,s),row=a=>`<span class="row">${a.map(i=>G(i)).join('')}</span>`;
const NAMES=['謎1 五十音表','謎2 スケルトン','謎3 しりとり','謎4 ババ抜き','謎5 覆面算','最終解答'];
const fmt=ms=>{const s=ms/1000;return String(s/60|0).padStart(2,'0')+':'+(s%60).toFixed(1).padStart(4,'0')};
// ---- 謎1: 五十音表(横長10列×5行)。紙A=表、紙B=①②③の位置 ----
function g0(){const ids=pick(50),cl=shuf([...Array(50).keys()]).slice(0,3);
 const tb=f=>'<table class="t">'+[0,1,2,3,4].map(r=>'<tr>'+[...Array(10).keys()].map(c=>`<td>${f(r*10+c)}</td>`).join('')+'</tr>').join('')+'</table>';
 return{ans:cl.map(i=>ids[i]),papers:[tb(i=>G(ids[i],32)),tb(i=>cl.includes(i)?`<b class="mk">${'①②③'[cl.indexOf(i)]}</b>`:'')],hint:'2枚の紙を見比べよう。①②③の位置にある文字を、順に答えよう。'}}
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
 let mp,W,t=0;do{const ids=pick(ks.length);mp={};ks.forEach((k,i)=>mp[k]=ids[i]);W=S.map(s=>s.map(k=>mp[k]))}while(cnt(S,W)!=1&&++t<80);
 const st=shuf(ks).slice(0,3);let b=`<div class="bd" style="grid-template-columns:repeat(${C},36px)">`;
 for(let r=0;r<H;r++)for(let c=0;c<C;c++){const k=r+','+c;b+=mp[k]===undefined?'<i></i>':`<b>${st.includes(k)?'①②③'[st.indexOf(k)]:''}</b>`}
 return{ans:st.map(k=>mp[k]),papers:[`<div class="sk">${b}</div><div class="wl">${shuf(W).map(w=>`<div>${row(w)}</div>`).join('')}</div></div>`],hint:'右のことばを、すべて左の盤面に入れよう。①②③のマスの文字を、順に答えよう。'}}
// ---- 謎3: しりとり ----
function g2(){const ids=pick(11),a=ids.slice(0,6),x=ids.slice(6),W=[0,1,2,3,4].map(k=>[a[k],x[k],a[k+1]]);
 const cl=shuf([...Array(15).keys()]).slice(0,3).sort((p,q)=>p-q);
 return{ans:cl.map(i=>W[i/3|0][i%3]),papers:[shuf(W).map(w=>`<div style="margin:8px 0">${row(w)}</div>`).join('')],hint:'しりとりでつなごう。'+cl.map(i=>`${(i/3|0)+1}つ目の${i%3+1}文字目`).join('、')+'を、順に答えよう。'}}
// ---- 謎4: ババ抜き(バラバラ配置、消して左から読む) ----
function g3(){const ids=pick(9),sg=ids.slice(6);let a=[];for(let i=0;i<6;i++)a.push(ids[i],ids[i]);a.push(...sg);a=shuf(a);
 let P;for(let t=0;t<60;t++){P=[];let bad=0;for(const g of a){const s=sg.includes(g);let ok=0;
  for(let k=0;k<300&&!ok;k++){const p=[R(360),R(260),s];if(P.every(q=>Math.hypot(q[0]-p[0],q[1]-p[1])>54&&!(q[2]&&s&&Math.abs(q[0]-p[0])<34))){P.push(p);ok=1}}
  if(!ok){bad=1;break}}if(!bad)break}
 const ans=a.map((g,i)=>[g,P[i][0]]).filter(u=>sg.includes(u[0])).sort((u,v)=>u[1]-v[1]).map(u=>u[0]);
 return{ans,papers:[`<div class="sc">${a.map((g,i)=>`<span style="left:${P[i][0]+10}px;top:${P[i][1]+10}px;transform:rotate(${R(31)-15}deg)">${G(g,40)}</span>`).join('')}</div>`],hint:'同じ文字のペアを消そう。残った文字を、左から順に答えよう。'}}
// ---- 謎5: 覆面算 ----
function g4(){const m=pick(10),x=R(377)+123,y=R(400)+100,n=v=>String(v).split('').map(d=>m[+d]);
 return{ans:n(x+y),papers:['<table class="t"><tr>'+m.map((_,d)=>`<th>${d}</th>`).join('')+'</tr><tr>'+m.map(i=>`<td>${G(i,30)}</td>`).join('')+'</tr></table>',`<div class="ex">${row(n(x))} ＋ ${row(n(y))} ＝ ？</div>`],hint:'対応表で数字にして計算しよう。答えを文字に直して答えよう。'}}
// ---- 進行 ----
// 紙の上部に出すルール説明画像: images/rule-<名前>.png (IMの順に、各謎の紙の上から)
const IM=[['1a','1b'],['2'],['3'],['4'],['5a','5b'],['final']];
const IMG=n=>`images/rule-${n}.png`;
let D,FA,cur,fin,t0,tEnd,mode=0,first=null;
$('#ti').innerHTML=[5,58,19,77,33].map(i=>G(i,30)).join('');
function start(){D=[g0(),g1(),g2(),g3(),g4()];FA=D.map(d=>d.ans[0]);fin=[];cur=0;tEnd=0;t0=performance.now();
 $('#start').hidden=true;$('#res').hidden=true;$('#game').hidden=false;render();tick()}
function tick(){if(tEnd)return;$('#tm').textContent=fmt(performance.now()-t0);requestAnimationFrame(tick)}
function render(){
 $('#tabs').innerHTML=[1,2,3,4,5,'★'].map((n,i)=>`<button data-t="${i}" class="${i==cur?'on':''}">${n}</button>`).join('');
 const P=cur<5?D[cur].papers:['<div id="ans"></div>'];
 $('#pz').innerHTML=P.map((p,i)=>`<div class="paper"><img class="rule" src="${IMG(IM[cur][i])}" data-n="rule-${IM[cur][i]}.png" alt="">${p}</div>`).join('');
 document.querySelectorAll('.rule').forEach(i=>i.onerror=()=>{const d=document.createElement('div');d.className='ph';d.textContent=i.dataset.n;i.replaceWith(d)});
 $('#kb').hidden=cur!=5;drawAns();drawKb()}
function drawAns(){const a=$('#ans');if(!a)return;a.style.display='flex';a.innerHTML=[0,1,2,3,4].map(i=>`<div class="sl"><small>${i+1}</small>${fin[i]!==undefined?G(fin[i],40):'<span class="em"></span>'}</div>`).join('')}
const part=(k,i)=>{const w=k=='L'||k=='R'?[50,100]:[100,50];return`<svg viewBox="0 0 ${w[0]} ${w[1]}" width="${w[0]*.6}" height="${w[1]*.6}" style="color:#222">${PARTS[k][i]}</svg>`};
function drawKb(){const k=mode?['T','B']:['L','R'];
 $('#kb').innerHTML=`<div><button data-m="0" class="${mode?'':'on'}">◧</button><button data-m="1" class="${mode?'on':''}">⬒</button></div>`+
 [0,1].map(s=>`<div class="pr">${[0,1,2,3,4,5,6].map(i=>`<button data-p="${s}${i}" class="${s==0&&first===i?'on':''}">${part(k[s],i)}</button>`).join('')}</div>`).join('')+'<div><button id="del">⌫</button><button id="ok">✔</button></div>'}
function check(){if(fin.length==5&&fin.every((x,i)=>x==FA[i])){tEnd=performance.now();return finish()}
 const a=$('#ans');a.classList.add('ng');setTimeout(()=>{fin=[];a.classList.remove('ng');drawAns()},500)}
function finish(){const t=fmt(tEnd-t0);$('#tm').textContent=t;$('#game').hidden=true;$('#res').hidden=false;
 $('#res').innerHTML=`<div class="paper" style="text-align:center"><p class="big">${t}</p><a class="tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('架空の言語でベタ謎解き！を '+t+' でクリアしました！\n#架空言語ベタ謎解き')}">POST</a><p><button id="go">↻</button></p></div>`}
document.onclick=e=>{
 if(e.target.closest('#env')){const v=$('#env');if(!v.classList.contains('open')){v.classList.add('open');setTimeout(start,800)}return}
 const b=e.target.closest('button');if(!b)return;
 if(b.id=='go'){$('#env').classList.remove('open');$('#res').hidden=true;$('#start').hidden=false;$('#tm').textContent='00:00.0';return}
 if(b.dataset.t!==undefined){cur=+b.dataset.t;first=null;return render()}
 if(b.dataset.m!==undefined){mode=+b.dataset.m;first=null;return drawKb()}
 if(b.dataset.p){const s=+b.dataset.p[0],i=+b.dataset.p[1];
  if(!s){first=i;return drawKb()}if(first===null)return;
  if(fin.length<5)fin.push(mode*49+first*7+i);first=null;drawAns();return drawKb()}
 if(b.id=='del'){fin.pop();return drawAns()}
 if(b.id=='ok')check()};
