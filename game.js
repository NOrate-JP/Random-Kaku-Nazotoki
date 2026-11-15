const $=s=>document.querySelector(s),R=n=>Math.random()*n|0;
const shuf=a=>{a=[...a];for(let i=a.length;i>1;){const j=R(i--);[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=n=>shuf([...Array(98).keys()]).slice(0,n);
const G=(i,s=36)=>glyph(i,s),row=a=>`<span class="row">${a.map(i=>G(i)).join('')}</span>`;
const NAMES=['五十音表','スケルトン','しりとり','ババ抜き','覆面算','最終解答'];
const fmt=ms=>{const s=ms/1000;return String(s/60|0).padStart(2,'0')+':'+(s%60).toFixed(1).padStart(4,'0')};
// ---- 問題生成 ----
function g0(){const ids=pick(50),cl=shuf([...Array(50).keys()]).slice(0,3);
 let h='<table class="t"><tr><th></th>'+[1,2,3,4,5].map(c=>`<th>${c}</th>`).join('')+'</tr>';
 for(let r=0;r<10;r++)h+=`<tr><th>${r+1}</th>`+[0,1,2,3,4].map(c=>`<td>${G(ids[r*5+c])}</td>`).join('')+'</tr>';
 return{ans:cl.map(i=>ids[i]),html:h+'</table>',hint:'表から、行-列が '+cl.map(i=>`${(i/5|0)+1}-${i%5+1}`).join('、')+' の文字を順に答える'}}
function g1(){const L=[[0,1,2,3,4,5].map(c=>[1,c]),[0,1,2,3,4].map(r=>[r,1]),[1,2,3,4].map(r=>[r,3]),[1,2,3].map(c=>[4,c])];
 const cells=[...new Set(L.flat().map(p=>p+''))],ids=pick(cells.length),mp={};cells.forEach((k,i)=>mp[k]=ids[i]);
 const st=shuf(cells).slice(0,3);let b='<div class="bd">';
 for(let r=0;r<5;r++)for(let c=0;c<6;c++){const k=r+','+c;b+=mp[k]===undefined?'<i></i>':`<b>${st.includes(k)?'★'+(st.indexOf(k)+1):''}</b>`}
 const ws=shuf(L.map(w=>w.map(p=>mp[p+''])));
 return{ans:st.map(k=>mp[k]),html:`<div class="sk">${b}</div><div>${ws.map(row).join('<br>')}</div></div>`,hint:'右のことばを左の盤面に入れて、★の文字を★1→★2→★3の順に答える'}}
function g2(){const ids=pick(11),a=ids.slice(0,6),x=ids.slice(6),W=[0,1,2,3,4].map(k=>[a[k],x[k],a[k+1]]);
 const cl=shuf([...Array(15).keys()]).slice(0,3).sort((p,q)=>p-q);
 return{ans:cl.map(i=>W[i/3|0][i%3]),html:shuf(W).map(row).join('<br>'),hint:'しりとりでつないで、'+cl.map(i=>`${(i/3|0)+1}つ目の${i%3+1}文字目`).join('、')+'を順に答える'}}
function g3(){const ids=pick(9);let a=[];for(let i=0;i<6;i++)a.push(ids[i],ids[i]);a.push(ids[6],ids[7],ids[8]);a=shuf(a);
 return{ans:a.filter(i=>ids.slice(6).includes(i)),html:`<div>${a.map(i=>`<span class="bc">${G(i,44)}</span>`).join('')}</div>`,hint:'同じ文字のペアを消して（タップで薄くなる）、残った文字を左から順に答える'}}
function g4(){const m=pick(10),x=R(377)+123,y=R(400)+100,n=v=>String(v).split('').map(d=>m[+d]);
 const t='<table class="t"><tr>'+m.map((_,d)=>`<th>${d}</th>`).join('')+'</tr><tr>'+m.map(i=>`<td>${G(i,30)}</td>`).join('')+'</tr></table>';
 return{ans:n(x+y),html:t+`<div class="ex">${row(n(x))} ＋ ${row(n(y))} ＝ ？</div>`,hint:'表の対応で数にして足し算し、答えを文字に直して答える'}}
// ---- ゲーム進行 ----
let D,cur,inp,done,t0,tEnd,mode=0,first=null;
function start(){D=[g0(),g1(),g2(),g3(),g4()];
 D.push({ans:D.map(d=>d.ans[0]),html:'<p>5つの謎の答えの1文字目を、謎1〜5の順に並べて答えよう！</p>',hint:'最終解答'});
 inp=D.map(()=>[]);done=D.map(()=>false);cur=0;tEnd=0;t0=performance.now();
 $('#start').hidden=true;$('#res').hidden=true;$('#game').hidden=false;render();tick()}
function tick(){if(tEnd)return;$('#tm').textContent=fmt(performance.now()-t0);requestAnimationFrame(tick)}
function render(){
 $('#tabs').innerHTML=NAMES.map((n,i)=>`<button data-t="${i}" class="${i==cur?'on':''} ${done[i]?'ok':''}" ${i==5&&!done.slice(0,5).every(Boolean)?'disabled':''}>${i<5?i+1:'★'}</button>`).join('')+' '+NAMES[cur];
 $('#hint').textContent=D[cur].hint;$('#pz').innerHTML=D[cur].html;drawAns();drawKb()}
function drawAns(){const L=D[cur].ans.length;$('#ans').innerHTML=[...Array(L).keys()].map(i=>inp[cur][i]!==undefined?G(inp[cur][i],40):'<span class="em"></span>').join('')}
const part=(k,i)=>{const w=k=='L'||k=='R'?[50,100]:[100,50];return`<svg viewBox="0 0 ${w[0]} ${w[1]}" width="${w[0]*.6}" height="${w[1]*.6}" style="color:#e8e8f0">${PARTS[k][i]}</svg>`};
function drawKb(){const k=mode?['T','B']:['L','R'];
 $('#kb').innerHTML=`<div><button data-m="0" class="${mode?'':'on'}">左右型</button><button data-m="1" class="${mode?'on':''}">上下型</button> <small>${mode?'上→下':'左→右'}の順にタップ</small></div>`+
 [0,1].map(s=>`<div class="pr">${[0,1,2,3,4,5,6].map(i=>`<button data-p="${s}${i}" class="${s==0&&first===i?'on':''}">${part(k[s],i)}</button>`).join('')}</div>`).join('')+'<div><button id="del">1文字消す</button><button id="ok">回答</button></div>'}
function check(){if(done[cur])return;const a=D[cur].ans,v=inp[cur];
 if(v.length==a.length&&v.every((x,i)=>x==a[i])){done[cur]=true;inp[cur]=[...a];
  if(cur==5){tEnd=performance.now();return finish()}
  const nx=done.slice(0,5).findIndex(x=>!x);cur=nx<0?5:nx;first=null;render()}
 else{$('#ans').classList.add('ng');setTimeout(()=>{$('#ans').classList.remove('ng');inp[cur]=[];drawAns()},500)}}
function finish(){const t=fmt(tEnd-t0);$('#tm').textContent=t;$('#game').hidden=true;$('#res').hidden=false;
 $('#res').innerHTML=`<h2>クリア！</h2><p class="big">${t}</p><a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('架空の言語でベタ謎解き！を '+t+' でクリアしました！\n#架空言語ベタ謎解き')}">結果をポストする</a><p><button id="go">もう一度</button></p>`}
document.onclick=e=>{const b=e.target.closest('button,.bc');if(!b)return;
 if(b.classList.contains('bc')){b.classList.toggle('off');return}
 if(b.id=='go')return start();
 if(b.dataset.t!==undefined){cur=+b.dataset.t;first=null;return render()}
 if(b.dataset.m!==undefined){mode=+b.dataset.m;first=null;return drawKb()}
 if(b.dataset.p){if(done[cur])return;const s=+b.dataset.p[0],i=+b.dataset.p[1];
  if(!s){first=i;return drawKb()}if(first===null)return;
  if(inp[cur].length<D[cur].ans.length)inp[cur].push(mode*49+first*7+i);first=null;drawAns();return drawKb()}
 if(b.id=='del'){inp[cur].pop();return drawAns()}
 if(b.id=='ok')check()};
