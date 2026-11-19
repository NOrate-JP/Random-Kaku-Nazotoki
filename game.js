// 架空の言語でベタ謎解き
// 【謎の追加方法】gen(n,hard) を作って PUZ に1行足す。
//   n=答えの文字数(3/4), hard=HARD以上か。戻り値 {ans:[文字id×n], papers:[pp(html,幅(マス数),{img:'画像名'}),...], stack:true(縦並び), item:'ITEM欄に置く物(任意)'}
//   文字は pick(n) で出す(表に採用された50文字だけ)。乱数は R()/RF()/shuf() を使う(シードで同じ問題を再現するため Math.random は使わない)。
//   解が必ず1通りになるよう、作ったら検証して作り直すこと。ルール画像は images/rule-画像名.png(HARD以上は -hard.png)。
const $=s=>document.querySelector(s);
let rnd=Math.random;const R=n=>rnd()*n|0,RF=()=>rnd();
function seededRnd(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}
 h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);let a=(h^h>>>16)>>>0;
 return()=>{a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const shuf=a=>{a=[...a];for(let i=a.length;i>1;){const j=R(i--);[a[i],a[j]]=[a[j],a[i]]}return a};
let POOL=[...Array(50).keys()];   // 表に採用された50文字(start時に決まる)。全問題・答えはここからだけ出す
const pick=n=>shuf(POOL).slice(0,n);
const GR=(i,s=36)=>`<span class="gw" style="--k:${s/36}">${glyph(i,s)}</span>`;
// 謎の中の文字は ⟦id,サイズ⟧ で持ち、表示時に fx() で実際の文字へ(最終問題の線のため、謎ごとに文字を入れ替える場合がある)
const G=(i,s=36)=>`⟦${i},${s}⟧`,fx=(h,m)=>h.replace(/⟦(\d+),(\d+)⟧/g,(_,i,s)=>GR(m&&m[i]!==undefined?m[i]:+i,+s)),row=a=>`<span class="row">${a.map(i=>G(i,34)).join('')}</span>`;
const fmt=ms=>{const s=ms/1000;return String(s/60|0).padStart(2,'0')+':'+(s%60).toFixed(1).padStart(4,'0')};
const CIR='①②③④⑤⑥⑦',pp=(h,w,o)=>({h,w,...o});
const MASK=[[0,0,0],[1,0,1],[1,0,0],[1,0,1],[0,0,0]],TR=5,TC=11;   // 表は縦5×横11。左3列の黒マス(1=黒)
let TBL,OPEN;
function mkTable(){OPEN=[];for(let r=0;r<TR;r++)for(let c=0;c<TC;c++)if(!(c<3&&MASK[r][c]))OPEN.push(r*TC+c);
 POOL=shuf([...Array(200).keys()]).slice(0,OPEN.length);TBL=Array(TR*TC).fill(-1);OPEN.forEach((k,i)=>TBL[k]=POOL[i])}
const tbl=(f,c0=0,c1=TC)=>'<table class="t">'+[...Array(TR).keys()].map(r=>'<tr>'+[...Array(c1-c0).keys()].map(j=>{const k=r*TC+c0+j;return TBL[k]<0?'<td class="bk"></td>':`<td>${f(k)}</td>`}).join('')+'</tr>').join('')+'</table>';
// 重ならないランダム配置。sz=[[幅,高さ]...](マス単位)。戻り値は左上座標の配列。ex(i,x,P)で追加条件
function scatter(sz,W,H,gap,ex){for(;;){const P=[];let ok=1;
 for(let i=0;i<sz.length&&ok;i++){const[w,h]=sz[i];let pl=0;
  for(let k=0;k<300&&!pl;k++){const x=RF()*(W-w),y=RF()*(H-h);
   if(P.every((q,j)=>q[0]+sz[j][0]+gap<=x||x+w+gap<=q[0]||q[1]+sz[j][1]+gap<=y||y+h+gap<=q[1])&&(!ex||ex(i,x,P))){P.push([x,y]);pl=1}}
  if(!pl)ok=0}
 if(ok)return P}}
const at=(p,rot,h)=>`<span style="left:calc(var(--u)*${p[0].toFixed(2)});top:calc(var(--u)*${p[1].toFixed(2)});transform:rotate(${rot}deg)">${h}</span>`;
// ---- 五十音表(Q): 空の表に番号。HARD以上は、Q○の札がある紙そのものをハサミで真っ直ぐ3つに切って並べ替え、1〜2枚は上下逆さ ----
function gGojuon(n,hard){const o={};let c1=0,c2=0,x1=0,x2=0,rot=[],ordp=[],jit=[];
 if(hard){for(;;){c1=3+R(3);const f1=.25+RF()*.5;c2=c1+2+R(8-c1);const f2=.25+RF()*.5;if(Math.abs(f1-f2)>=.2&&Math.abs(f1+f2-1)>=.15){x1=c1+f1;x2=c2+f2;break}}   // マスの途中で切る
  const rs=shuf([0,1,2]).slice(0,1+R(2));rot=[0,1,2].map(i=>(rs.includes(i)?180:0)+R(7)-3);jit=[0,1,2].map(()=>(RF()*.6).toFixed(2));do{ordp=shuf([0,1,2])}while(ordp+''=='0,1,2')}
 const okCell=k=>!hard||(k%TC!=c1&&k%TC!=c2);   // 印は切られるマスを避ける
 let cl=shuf(OPEN.filter(okCell)).slice(0,n);const init=cl.slice();
 const build=()=>{const f=k=>cl.includes(k)?`<b class="mk">${CIR[cl.indexOf(k)]}</b>`:'';
  if(!hard)return[pp(tbl(f),11.2)];
  let cells='';for(let k=0;k<TR*TC;k++)cells+=TBL[k]<0?'<div class="bk"></div>':`<div>${f(k)}</div>`;
  const full=`<div class="pp2" style="width:calc(var(--u)*${TC} + 24px)"><div class="qn">⟦Q⟧</div><div class="cg">${cells}</div></div>`,
   wins=[[`calc(12px + var(--u)*${x1.toFixed(3)})`,'0px'],[`calc(var(--u)*${(x2-x1).toFixed(3)})`,`calc(-12px - var(--u)*${x1.toFixed(3)})`],[`calc(var(--u)*${(TC-x2).toFixed(3)} + 12px)`,`calc(-12px - var(--u)*${x2.toFixed(3)})`]];
  const pcs=wins.map(([w,ml],i)=>`<div class="cut" style="transform:rotate(${rot[i]}deg);margin-top:calc(var(--u)*${jit[i]})"><div class="cw2" style="width:${w}"><div style="margin-left:${ml}">${full}</div></div></div>`);
  return[pp(`<div class="cuts">${ordp.map(i=>pcs[i]).join('')}</div>`,7.6,{raw:1})]};
 o.ans=cl.map(k=>TBL[k]);o.papers=build();
 o.adj=(p,val)=>{const k=TBL.indexOf(val);if(k<0||!okCell(k)||(cl.includes(k)&&cl[p]!=k))return false;cl[p]=k;o.ans[p]=val;if(o.raw)o.raw[p]=val;o.papers=build();return true};   // 最終問題の都合で印の位置を動かす
 o.reset=()=>{cl=init.slice();o.ans=cl.map(k=>TBL[k]);o.papers=build()};
 o.solw=11.2;o.sol=()=>tbl(k=>cl.includes(k)?`<div class="solc">${G(TBL[k],28)}<small class="mn">${CIR[cl.indexOf(k)]}</small></div>`:G(TBL[k],26));   // ギブアップ時: 表の印の文字
 return o}
// ---- スケルトン: 盤面は毎回ランダム生成(ヘビ型除外)。カギは別紙。ハードは余りのカギ2つ(1文字違いの偽物)。解は必ず1通り ----
function cnt(S,W){let n=0;const g={};(function f(i,u){if(i==S.length){n++;return}
 for(let w=0;w<W.length;w++){if(u>>w&1||W[w].length!=S[i].length)continue;const st=[];let ok=1;
  S[i].forEach((k,j)=>{if(g[k]===undefined){g[k]=W[w][j];st.push(k)}else if(g[k]!=W[w][j])ok=0});
  if(ok)f(i+1,u|1<<w);st.forEach(k=>delete g[k])}})(0,0);return n}
const SKN=7;
function skValid(T){const o=new Set(T.flatMap(w=>w.cs.map(p=>p+''))),runs=[];
 for(let r=0;r<SKN;r++){let run=[];for(let c=0;c<=SKN;c++){if(c<SKN&&o.has(r+','+c))run.push(r+','+c);else{if(run.length>1)runs.push('H'+run);run=[]}}}
 for(let c=0;c<SKN;c++){let run=[];for(let r=0;r<=SKN;r++){if(r<SKN&&o.has(r+','+c))run.push(r+','+c);else{if(run.length>1)runs.push('V'+run);run=[]}}}
 const nm=T.map(w=>w.d+w.cs.map(p=>p+''));return runs.length==T.length&&runs.every(x=>nm.includes(x))&&new Set(nm).size==T.length}
function mkSk(){const L=()=>3+R(4),put=(d,r,c,l)=>({d,cs:[...Array(l).keys()].map(i=>d=='H'?[r,c+i]:[r+i,c])}),fits=w=>w.cs.every(([r,c])=>r>=0&&r<SKN&&c>=0&&c<SKN);
 for(;;){let w0;do{w0=put(R(2)?'H':'V',R(SKN),R(SKN),L())}while(!fits(w0));const ws=[w0];let ok=1;
  while(ws.length<6){let pl=0;
   for(let t=0;t<300&&!pl;t++){const a=ws[R(ws.length)],[r,c]=a.cs[R(a.cs.length)],l=L(),j=R(l),w=a.d=='H'?put('V',r-j,c,l):put('H',r,c-j,l);
    if(fits(w)&&skValid(ws.concat([w]))){ws.push(w);pl=1}}
   if(!pl){ok=0;break}}
  if(!ok)continue;
  const sh=(a,b)=>a.cs.filter(p=>b.cs.some(q=>q+''==p+'')),deg=ws.map((a,i)=>ws.filter((b,j)=>i!=j&&sh(a,b).length).length);
  let plus=0;ws.forEach((a,i)=>ws.forEach((b,j)=>{if(i<j)sh(a,b).forEach(p=>{const e=x=>x.cs[0]+''==p+''||x.cs[x.cs.length-1]+''==p+'';if(!e(a)&&!e(b))plus++})}));
  if(Math.max(...deg)<3||plus<1)continue;   // 一本道(ヘビ型)や「+」交差のない盤面は除外
  const all=ws.flatMap(w=>w.cs),mr=Math.min(...all.map(p=>p[0])),mc=Math.min(...all.map(p=>p[1]));
  return{S:ws.map(w=>w.cs.map(([r,c])=>(r-mr)+','+(c-mc))),H:Math.max(...all.map(p=>p[0]))-mr+1,C:Math.max(...all.map(p=>p[1]))-mc+1}}}
function gSkeleton(n,hard){let S,H,C,mp,W,A,ks;
 for(;;){({S,H,C}=mkSk());ks=[...new Set(S.flat())];let ok=0;
  for(let t=0;t<200&&!ok;t++){const ids=pick(7+R(4));mp={};ks.forEach(k=>mp[k]=ids[R(ids.length)]);W=S.map(s=>s.map(k=>mp[k]));A=W.slice();
   if(hard)for(let d=0;d<2;d++){const x=W[R(6)].slice();x[R(x.length)]=ids[R(ids.length)];A.push(x)}
   ok=new Set(A.map(w=>w+'')).size==A.length&&cnt(S,A)==1}
  if(ok)break}
 const st=shuf(ks).slice(0,n);let b=`<div class="bd" style="grid-template-columns:repeat(${C},var(--u))">`;
 for(let r=0;r<H;r++)for(let c=0;c<C;c++){const k=r+','+c;b+=mp[k]===undefined?'<i></i>':`<b>${st.includes(k)?CIR[st.indexOf(k)]:''}</b>`}
 let sb=`<div class="bd" style="grid-template-columns:repeat(${C},var(--u))">`;for(let r=0;r<H;r++)for(let c=0;c<C;c++){const k=r+','+c,s=st.indexOf(k);sb+=mp[k]===undefined?'<i></i>':`<b class="${s<0?'':'hl'}">${G(mp[k],30)}${s<0?'':`<small class="mn">${CIR[s]}</small>`}</b>`}sb+='</div>';
 return{ans:st.map(k=>mp[k]),sol:sb,solw:C+.4,papers:[pp(b+'</div>',C+.4,{img:'skeleton'}),pp(`<div class="wl">${shuf(A).map(w=>`<div>${row(w)}</div>`).join('')}</div>`,6.6)]}}
// ---- しりとり: 単語は紙に散らす。つなぎ表(□□□▶□□□▶…)に番号。ハードは余りの単語2つ。つなぎ方は必ず1通り ----
const chains=(ws,K)=>{let c=0;const f=(l,u,d)=>{if(c>1)return;if(d==K){c++;return}for(let i=0;i<ws.length;i++)if(!(u>>i&1)&&(l<0||ws[l][2]==ws[i][0]))f(i,u|1<<i,d+1)};f(-1,0,0);return c};
function gShiritori(n,hard){let W,A;
 for(;;){const ids=pick(14),pool=ids.slice(0,4+R(3)),mid=ids.slice(7),a=[...Array(7)].map(()=>pool[R(pool.length)]);
  W=[0,1,2,3,4,5].map(k=>[a[k],mid[k],a[k+1]]);
  const dup=12-new Set(W.map(w=>w[0])).size-new Set(W.map(w=>w[2])).size;A=W.slice();
  if(hard){const rest=shuf(POOL.filter(g=>!ids.includes(g)));for(let d=0;d<2;d++)A.push([pool[R(pool.length)],rest[d],pool[R(pool.length)]])}
  if(dup>=2&&chains(A,6)==1)break}
 const cl=shuf([...Array(18).keys()]).slice(0,n),cell=(k,m)=>{const x=cl.indexOf(k*3+m);return`<b>${x<0?'':CIR[x]}</b>`};
 let ch='<div class="chain">';for(let k=0;k<6;k+=2)ch+=`<div class="cr"><span class="cw">${cell(k,0)}${cell(k,1)}${cell(k,2)}</span><span class="ar">▶</span><span class="cw">${cell(k+1,0)}${cell(k+1,1)}${cell(k+1,2)}</span>${k<4?'<span class="ar">▶</span>':''}</div>`;
 const Hh=hard?8.8:7.2,Aw=shuf(A),P=scatter(Aw.map(()=>[3.2,1.25]),9.5,Hh,.3);
 const cs=(k,m)=>{const x=cl.indexOf(k*3+m);return`<b class="${x<0?'':'hl'}">${G(W[k][m],28)}${x<0?'':`<small class="mn">${CIR[x]}</small>`}</b>`};
 let sc='<div class="chain">';for(let k=0;k<6;k+=2)sc+=`<div class="cr"><span class="cw">${cs(k,0)}${cs(k,1)}${cs(k,2)}</span><span class="ar">▶</span><span class="cw">${cs(k+1,0)}${cs(k+1,1)}${cs(k+1,2)}</span>${k<4?'<span class="ar">▶</span>':''}</div>`;sc+='</div>';
 return{ans:cl.map(i=>W[i/3|0][i%3]),sol:sc,solw:7.8,papers:[pp(`<div class="sc" style="height:calc(var(--u)*${Hh})">${Aw.map((w,i)=>at(P[i],R(11)-5,row(w))).join('')}</div>`,9.6,{img:'shiritori'}),pp(ch+'</div>',7.8)]}}
// ---- ババ抜き: 紙のあちこちに散らばった文字。同じ文字のペアを消して左から読む(ハードはペア増) ----
function gBaba(n,hard){const pairs=hard?8:6,ids=pick(pairs+n),sg=ids.slice(pairs);let a=[];for(let i=0;i<pairs;i++)a.push(ids[i],ids[i]);a.push(...sg);a=shuf(a);
 const H=hard?8.2:7.4,P=scatter(a.map(()=>[1.15,1.15]),9.5,H,.3,(i,x,Q)=>!sg.includes(a[i])||Q.every((q,j)=>!sg.includes(a[j])||Math.abs(q[0]-x)>=1));
 const ans=a.map((g,i)=>[g,P[i][0]]).filter(u=>sg.includes(u[0])).sort((u,v)=>u[1]-v[1]).map(u=>u[0]);
 const od=a.map((g,i)=>[g,P[i][0],i]).filter(u=>sg.includes(u[0])).sort((u,v)=>u[1]-v[1]).map(u=>u[2]);
 const bs=`<div class="sc" style="height:calc(var(--u)*${H})">${a.map((g,i)=>{const o=od.indexOf(i);return at(P[i],0,o<0?`<span class="dim">${G(g,40)}</span>`:`<span class="hl2">${G(g,40)}<small class="mn">${CIR[o]}</small></span>`)}).join('')}</div>`;
 return{ans,sol:bs,solw:9.6,papers:[pp(`<div class="sc" style="height:calc(var(--u)*${H})">${a.map((g,i)=>at(P[i],R(31)-15,G(g,40))).join('')}</div>`,9.6,{img:'baba'})]}}
// ---- 覆面算: 対応表を見て計算。HARD以上は対応表の紙がITEM欄にバラバラに散らばる ----
function gFukumen(n,hard){const m=pick(10),Q=n==3?[123,377,100,400]:n==4?[500,400,500,400]:[5000,4000,5000,4000],x=R(Q[1])+Q[0],y=R(Q[3])+Q[2],num=v=>String(v).split('').map(d=>m[+d]);
 const eq=pp(`<div class="ex">${row(num(x))} + ${row(num(y))} = ?</div>`,10.4);
 const fsol=`<div class="ex">${x} + ${y} = ${x+y}</div><table class="t" style="margin-top:8px"><tr>${m.map((_,d)=>`<th>${d}</th>`).join('')}</tr><tr>${m.map(g=>`<td>${G(g,30)}</td>`).join('')}</tr></table>`;
 if(!hard)return{ans:num(x+y),stack:true,sol:fsol,solw:10.4,papers:['<table class="t"><tr>'+m.map((_,d)=>`<th>${d}</th>`).join('')+'</tr><tr>'+m.map(g=>`<td>${G(g,30)}</td>`).join('')+'</tr></table>'].map(t=>pp(t,10.4)).concat([eq])};
 const P=scatter(m.map(()=>[2.5,1.3]),10.6,7.4,.3);
 return{ans:num(x+y),stack:true,sol:fsol,solw:10.4,papers:[eq],item:`<div class="sc itx" style="width:calc(var(--u)*10.6);height:calc(var(--u)*7.4)">${m.map((g,d)=>at(P[d],R(31)-15,`<div class="cd2">${d}=${G(g,34)}</div>`)).join('')}</div>`}}
// ---- ポリオミノ: ピースは回転・反転なし。ハードは余りのピース2つ。解は必ず1通り ----
const norm=cs=>{const mr=Math.min(...cs.map(p=>p[0])),mc=Math.min(...cs.map(p=>p[1]));return cs.map(p=>[p[0]-mr,p[1]-mc]).sort((a,b)=>a[0]-b[0]||a[1]-b[1])};
const orients=cs=>{const s=new Map();let p=cs;for(let f=0;f<2;f++){for(let r=0;r<4;r++){p=p.map(([a,b])=>[b,-a]);const q=norm(p);s.set(q+'',q)}p=p.map(([a,b])=>[a,-b])}return[...s.values()]};
function solve(h,w,P,cap=2,mask){const O=P.map(p=>[norm(p)]),g=mask?mask.slice():Array(h*w).fill(0);let n=0;
 (function f(u){const e=g.indexOf(0);if(e<0){n++;return}const er=e/w|0,ec=e%w;
  for(let i=0;i<P.length&&n<cap;i++){if(u>>i&1)continue;for(const o of O[i]){const dr=er-o[0][0],dc=ec-o[0][1];
   if(o.every(([a,b])=>{const r=a+dr,c=b+dc;return r>=0&&r<h&&c>=0&&c<w&&!g[r*w+c]})){o.forEach(([a,b])=>g[(a+dr)*w+b+dc]=1);f(u|1<<i);o.forEach(([a,b])=>g[(a+dr)*w+b+dc]=0)}}}})(0);return n}
const tf=(cs,k,f)=>{let p=cs;for(let i=0;i<k;i++)p=p.map(([a,b,g])=>[b,-a,g]);if(f)p=p.map(([a,b,g])=>[a,-b,g]);const mr=Math.min(...p.map(q=>q[0])),mc=Math.min(...p.map(q=>q[1]));return p.map(([a,b,g])=>[a-mr,b-mc,g])};
const PEN=['01,02,10,11,21','00,10,20,30,40','00,10,20,30,31','01,11,20,21,30','00,01,10,11,20','00,01,02,11,21','00,02,10,11,12','00,10,20,21,22','00,10,11,21,22','01,10,11,12,21','01,10,11,21,31','00,01,11,21,22'].map(s=>s.split(',').map(x=>[+x[0],+x[1]]));
function mkP(hard){for(;;){const set=new Set();let P=[],ok=1,r0=99,r1=-99,c0=99,c1=-99;
  const add=cs=>{cs.forEach(([r,c])=>{set.add(r+','+c);r0=Math.min(r0,r);r1=Math.max(r1,r);c0=Math.min(c0,c);c1=Math.max(c1,c)});P.push(cs)};
  const types=shuf(PEN),rest=types.slice(6);
  for(const t of types.slice(0,6)){const os=orients(t),cand=[];
   if(!P.length){add(os[R(os.length)].map(([a,b])=>[a+4,b+4]));continue}
   for(const o of os)for(let dr=0;dr<12;dr++)for(let dc=0;dc<12;dc++){const cs=o.map(([a,b])=>[a+dr,b+dc]);
    if(cs.some(([r,c])=>set.has(r+','+c)))continue;
    if(!cs.some(([r,c])=>set.has((r-1)+','+c)||set.has((r+1)+','+c)||set.has(r+','+(c-1))||set.has(r+','+(c+1))))continue;
    let a0=r0,a1=r1,b0=c0,b1=c1;cs.forEach(([r,c])=>{a0=Math.min(a0,r);a1=Math.max(a1,r);b0=Math.min(b0,c);b1=Math.max(b1,c)});
    const h=a1-a0+1,w=b1-b0+1;if(h>7||w>7)continue;cand.push([Math.max(h,w)*10+h*w/10,cs])}
   if(!cand.length){ok=0;break}
   const mn=Math.min(...cand.map(c=>c[0])),good=cand.filter(c=>c[0]<=mn+15);add(good[R(good.length)][1])}
  if(!ok)continue;
  const h=r1-r0+1,w=c1-c0+1;P=P.map(p=>p.map(([r,c])=>[r-r0,c-c0]));
  const mask=Array(h*w).fill(1);P.flat().forEach(([r,c])=>mask[r*w+c]=0);
  if(solve(h,w,P,2,mask)!=1)continue;
  if(!hard)return{P,h,w,mask,dec:[]};
  for(let t=0;t<40;t++){const dec=shuf(rest).slice(0,2).map(p=>{const os=orients(p);return os[R(os.length)]});
   if(solve(h,w,P.concat(dec),2,mask)==1)return{P,h,w,mask,dec}}}}
function gPoly(n,hard){const{P,h,w,mask,dec}=mkP(hard),cells=[];mask.forEach((v,i)=>v||cells.push(i));
 const ids=pick(cells.length+dec.length*5),gl={};cells.forEach((k,i)=>gl[k]=ids[i]);const st=shuf(cells).slice(0,n);
 const b=`<div class="bd" style="grid-template-columns:repeat(${w},var(--u))">`+[...Array(h*w).keys()].map(i=>mask[i]?'<i></i>':`<b>${st.includes(i)?CIR[st.indexOf(i)]:''}</b>`).join('')+'</div>';
 const pcs=P.map(p=>p.map(([r,c])=>[r,c,gl[r*w+c]])).concat(dec.map((p,j)=>p.map(([r,c],i)=>[r,c,ids[cells.length+j*5+i]])));
 const html=pcs.map((q0,k)=>{const q=tf(q0,0,0),H=Math.max(...q.map(c=>c[0]))+1,W=Math.max(...q.map(c=>c[1]))+1;let s=`<div class="pc" style="grid-template-columns:repeat(${W},var(--u))">`;
  for(let r=0;r<H;r++)for(let c=0;c<W;c++){const z=q.find(e=>e[0]==r&&e[1]==c);s+=z?`<b style="background:hsl(${k*47%360},65%,86%)">${G(z[2],30)}</b>`:'<i></i>'}return s+'</div>'});
 const own=[];P.forEach((p,k)=>p.forEach(([r,c])=>own[r*w+c]=k));
 const sb=`<div class="bd" style="grid-template-columns:repeat(${w},var(--u))">`+[...Array(h*w).keys()].map(i=>{if(mask[i])return'<i></i>';const s=st.indexOf(i);return`<b style="background:hsl(${own[i]*47%360},65%,86%)">${G(gl[i],30)}${s<0?'':`<small class="mn">${CIR[s]}</small>`}</b>`}).join('')+'</div>';
 return{ans:st.map(i=>gl[i]),sol:sb,solw:7.4,tries:0,papers:[pp(b,7.4,{img:'polyomino'}),pp(`<div class="pcs">${shuf(html).join('')}</div>`,7.4)]}}
// ---- シークワーズ: 盤面からカギの単語(縦横斜め・逆向きも)を探して消し、残った文字をZ字(左→右・上→下)に読む。盤面には同じ文字をわざと散りばめる ----
const DIRS=[[0,1],[1,0],[1,1],[1,-1],[0,-1],[-1,0],[-1,-1],[-1,1]];
function wsOcc(g,H,W,w){const s=new Set();for(let r=0;r<H;r++)for(let c=0;c<W;c++)for(const[dr,dc]of DIRS){const cs=[];let ok=1;
 for(let i=0;i<w.length&&ok;i++){const rr=r+dr*i,cc=c+dc*i;if(rr<0||rr>=H||cc<0||cc>=W||g[rr*W+cc]!==w[i])ok=0;else cs.push(rr*W+cc)}
 if(ok)s.add(cs.sort((a,b)=>a-b)+'')}return s.size}   // 揃っている場所の数(同じマスの集合は1つと数える)
function gWordsearch(n,hard){
 for(;;){const H=(hard?6:5)+R(2),W=(hard?6:5)+R(2),N=H*W,all=[...Array(N).keys()],rem=shuf(all).slice(0,n).sort((a,b)=>a-b),rs=new Set(rem),cand=[];
  for(let r=0;r<H;r++)for(let c=0;c<W;c++)for(const[dr,dc]of DIRS.slice(0,4))for(let L=3;L<=5;L++){const cs=[];let ok=1;
   for(let i=0;i<L&&ok;i++){const rr=r+dr*i,cc=c+dc*i;if(rr<0||rr>=H||cc<0||cc>=W||rs.has(rr*W+cc))ok=0;else cs.push(rr*W+cc)}if(ok)cand.push(cs)}
  const unc=new Set(all.filter(k=>!rs.has(k))),segs=[];let fail=0;   // 残す文字以外を、線で覆い尽くす
  while(unc.size&&!fail){const u=[...unc][R(unc.size)],c=cand.filter(s=>s.includes(u));if(!c.length){fail=1;break}
   const b=c.map(s=>[s.filter(x=>unc.has(x)).length+RF()*1.5,s]).sort((x,y)=>y[0]-x[0])[0][1];segs.push(b);b.forEach(x=>unc.delete(x))}
  if(fail||segs.length<4||segs.length>9)continue;
  for(let t=0;t<300;t++){const ids=pick(Math.min(16,Math.max(8,Math.round(N*.4)))),g=all.map(()=>ids[R(ids.length)]);   // 少ない種類を使い回して同じ文字を散りばめる
   const words=segs.map(s=>{const w=s.map(k=>g[k]);return R(2)?w:w.reverse()});
   if(new Set(words.map(w=>w+'')).size<words.length||!words.every(w=>wsOcc(g,H,W,w)==1))continue;   // どのカギも盤面にちょうど1か所だけ
   const dec=[];if(hard){for(let k=0;k<60&&dec.length<1;k++){const d=words[R(words.length)].slice();d[R(d.length)]=ids[R(ids.length)];
     if(!words.some(w=>w+''==d+'')&&!dec.some(w=>w+''==d+'')&&wsOcc(g,H,W,d)==0)dec.push(d)}if(dec.length<1)continue}   // ハード: 盤面にない偽のカギ1つ
   const tb='<table class="t">'+[...Array(H).keys()].map(r=>'<tr>'+[...Array(W).keys()].map(c=>`<td>${G(g[r*W+c],32)}</td>`).join('')+'</tr>').join('')+'</table>';
   const col={};segs.forEach((s,i)=>s.forEach(k=>{if(col[k]===undefined)col[k]=i}));
   const ws2='<table class="t">'+[...Array(H).keys()].map(r=>'<tr>'+[...Array(W).keys()].map(c=>{const k=r*W+c,x=rem.indexOf(k);return x>=0?`<td class="hl">${G(g[k],30)}<small class="mn">${CIR[x]}</small></td>`:`<td style="background:hsl(${col[k]*47%360},60%,88%)">${G(g[k],30)}</td>`}).join('')+'</tr>').join('')+'</table><div class="wl" style="margin-top:8px">'+words.map((w,i)=>`<div><span style="background:hsl(${i*47%360},60%,88%);display:inline-block;padding:2px 4px;border-radius:4px">${row(w)}</span></div>`).join('')+'</div>';
   return{ans:rem.map(k=>g[k]),sol:ws2,solw:Math.max(W+.4,5.6),dbg:{g,H,W,words,dec,rem},papers:[pp(tb,W+.4,{img:'wordsearch'}),pp(`<div class="wl">${shuf(words.concat(dec)).map(w=>`<div>${row(w)}</div>`).join('')}</div>`,5.6)]}}}}
// ---- 謎の登録(ここに足すと出題対象になる) ----
const PUZ=[{id:'gojuon',name:'五十音表',gen:gGojuon},{id:'fukumen',name:'覆面算',gen:gFukumen},{id:'shiritori',name:'しりとり',gen:gShiritori},{id:'baba',name:'ババ抜き',gen:gBaba},
 {id:'skeleton',name:'スケルトン',gen:gSkeleton},{id:'polyomino',name:'ポリオミノ',gen:gPoly},{id:'wordsearch',name:'シークワーズ',gen:gWordsearch}];
function pickTypes(types,n){const a=shuf(types);if(n<=a.length)return a.slice(0,n);const ex=[];while(a.length+ex.length<n)ex.push(types[R(types.length)]);return shuf(a.concat(ex))}   // ON数より多いときは同じ種類が2問以上出る
// ---- 設定・シード ----
const B36='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',DN=['NORMAL','HARD','EXPERT'],RANKQ=[[50,80,120],[80,120,180],[120,180,270]];   // ランク境界: 1問あたり秒(S/A/B)。合計=これ×問題数+60秒
const IMG=(n,hard)=>`images/rule-${n}${hard?'-hard':''}.png`,PENALTY=10,sleep=ms=>new Promise(r=>setTimeout(r,ms));
const normSeed=s=>(s||'').toUpperCase().replace(/[^0-9A-Z+\-]/g,''),rb=n=>{let s='';for(let i=0;i<n;i++)s+=B36[Math.random()*36|0];return s};
// シードは英数字(最大12文字ほど)ならどんな文字列でもOK(その文字列から同じ問題が作られる)。
// 自動発行のシードは、通常は入らない「-」「+」を含む形にして、打ち込んだ文字列と区別する:
//   スタンダード: 「H5-」+ランダム10文字 …先頭の N/H/E=難易度、3/5/7=問題数。シードだけで同じ設定・同じ問題になる
//   カスタム: 「C+」+ランダム10文字 …設定は含まない。カスタムモードで同じ設定のまま入力すると同じ問題になる
const stdSeed=(d,n)=>'NHE'[d]+n+'-'+rb(10),cusSeed=()=>'C+'+rb(10),parseStd=s=>{const m=/^([NHE])([357])[-+].+$/.exec(s);return m?{diff:'NHE'.indexOf(m[1]),n:+m[2]}:null};
const seedKey=c=>`${c.mode=='cus'?'C':c.mode=='daily'?'D':'S'}|${c.seed}|${c.diff}|${c.n}|${c.types.map(t=>t.id).join(',')}`;   // 同じシードでも、モード系統・難易度・問題数・出題内容が違えば別の問題になる
const jstDate=()=>new Date(Date.now()+9*36e5).toISOString().slice(0,10);
const MODES=[['std','STANDARD','スタンダード'],['cus','CUSTOM','カスタム'],['seed','SEED','シード'],['daily','DAILY','デイリー']];
let MODE='std',DIFF=1,NQ=5,ON={},SEEDIN='',DAILYD='';   // DAILYD: URLで指定されたデイリーの日付(YYYYMMDD)。空なら今日PUZ.forEach(p=>ON[p.id]=true);
try{const s=JSON.parse(localStorage.getItem('kuuso_cfg')||'{}');if(MODES.some(m=>m[0]==s.mode))MODE=s.mode;if(s.diff>=0&&s.diff<=2)DIFF=s.diff;if([3,5,7].includes(s.n))NQ=s.n;if(s.on)PUZ.forEach(p=>{if(p.id in s.on)ON[p.id]=!!s.on[p.id]});SEEDIN=s.seed||''}catch(e){}
const saveCfg=()=>{try{localStorage.setItem('kuuso_cfg',JSON.stringify({mode:MODE,diff:DIFF,n:NQ,on:ON,seed:SEEDIN}))}catch(e){}};
const envColor=()=>MODE=='daily'?'white':MODE=='cus'?'blue':['brown','red','black'][MODE=='seed'&&parseStd(normSeed(SEEDIN))?parseStd(normSeed(SEEDIN)).diff:DIFF];
function seedInfo(){const s=normSeed(SEEDIN);if(!s)return MODE=='cus'?'空欄ならランダム':'';const d=parseStd(s);return MODE=='seed'?(d?`✓ ${DN[d.diff]} ${d.n}Q (シードに設定が含まれています)`:`✓ ${DN[DIFF]} ${NQ}Q で出題`):'✓'}
function panel(){const df=`<div class="row2">${DN.map((n,i)=>`<button data-d="${i}" class="${i==DIFF?'on':''}">${n}</button>`).join('')}</div>`,nq=`<div class="row2">${[3,5,7].map(n=>`<button data-n="${n}" class="${n==NQ?'on':''}">${n}Q</button>`).join('')}</div>`,
 si=`<input id="seedin" maxlength="16" placeholder="SEED" value="${SEEDIN}" autocomplete="off" spellcheck="false"><div id="seedst" class="st">${seedInfo()}</div>`;
 if(MODE=='std')return df+nq;
 if(MODE=='cus')return df+nq+`<div class="chips">${PUZ.map(p=>`<button data-ty="${p.id}" class="${ON[p.id]?'on':''}">${p.name}</button>`).join('')}</div>`+si;
 if(MODE=='seed')return si+df+nq+'<div class="st big2" style="font-size:12px">難易度・問題数は、シードに設定が含まれていないときに使われます</div>';
 return`<div class="st big2">HARD ・ 7Q ・ ${(DAILYD||jstDate().replace(/-/g,'')).replace(/(\d{4})(\d\d)(\d\d)/,'$1-$2-$3')}</div><div class="st">今日は全員が同じ問題です</div>`}
function setBar(){$('#tbtn').textContent=INGAME?'☰':'ルール';$('#tbtn').className=INGAME?'tb ham':'tb';
 if(!INGAME){const m=MODES.find(x=>x[0]==MODE)[1];$('#dn').textContent=MODE=='daily'?m+' ・ HARD 7Q':MODE=='seed'?m:`${m} ・ ${DN[DIFF]} ${NQ}Q`;$('#tm').textContent='';$('#pn').textContent=''}}
function drawStart(){setBar();
 $('#start').innerHTML=`<div class="ttl"><div class="gl" id="ti"></div><img class="logo" src="images/logo.png" alt="異世界謎解きRTA" onerror="this.replaceWith(Object.assign(document.createElement('h1'),{textContent:this.alt}))"></div><div class="modes">${MODES.map(([k,e,j])=>`<button data-mode="${k}" class="${k==MODE?'on':''}">${e}<small>${j}</small></button>`).join('')}</div>`+
  `<div class="panel">${panel()}</div><div class="env ${envColor()}" id="env"><div class="bodyx"></div><div class="flap"></div><div class="lab"><small>TAP TO START</small></div></div>`;
 PARTS_READY.then(()=>{const t=$('#ti');if(t)t.innerHTML=[5,58,19,177,33,102,64].map(i=>GR(i,34)).join('')})}
function mkConf(){
 if(MODE=='std')return{mode:'std',diff:DIFF,n:NQ,types:PUZ,seed:stdSeed(DIFF,NQ)};
 if(MODE=='daily'){const dd=DAILYD||jstDate().replace(/-/g,'');return{mode:'daily',diff:1,n:7,types:PUZ,seed:'DAILY'+dd,dd}}
 const s=normSeed(SEEDIN);
 if(MODE=='seed'){if(!s)return{err:'シードを入力してください'};const d=parseStd(s);return{mode:'seed',diff:d?d.diff:DIFF,n:d?d.n:NQ,types:PUZ,seed:s}}
 const types=PUZ.filter(p=>ON[p.id]);if(!types.length)return{err:'出題内容を1つ以上ONにしてください'};
  return{mode:'cus',diff:DIFF,n:NQ,types,seed:s||cusSeed()}}
// ---- 最終問題の配置: 答えがどの行に入るか分からない。線=同じ文字が入る四角。答えが全部分かれば必ず1通りに決まる ----
function nAss(L,A,lines,cap){const n=L.length,as=Array(n).fill(-1),used=Array(n).fill(false),by=L.map((_,r)=>lines.filter(l=>Math.max(l[0],l[2])==r)),sols=[];
 (function f(r){if(sols.length>=cap)return;if(r==n){sols.push(as.slice());return}
  for(let a=0;a<n;a++){if(used[a]||A[a].length!=L[r])continue;as[r]=a;
   if(by[r].every(([r1,c1,r2,c2])=>A[as[r1]][c1]===A[as[r2]][c2])){used[a]=true;f(r+1);used[a]=false}}
  as[r]=-1})(0);return sols}   // 長さと線の条件を満たす「答え→行」の割り当てを数える
function setLay(ord,L,ls,mp,A){const n=D.length;D.forEach((d,i)=>{d.map=mp[i];d.ans=A[i]});
 const off=L.map(()=>R(5)*.35),mk=L.map(l=>R(l)),nums=shuf([...Array(n).keys()]);   // 各行1マスに番号。番号順に拾うと最後の答え
 FANS=[...Array(n).keys()].map(k=>{const r=nums.indexOf(k);return A[ord[r]][mk[r]]});
 LAY={ord,L,lines:ls,off,mk,num:nums,LW:Math.max(...L.map((l,r)=>off[r]+l*1.2))-.2,LH:(n-1)*2.1+1}}
function mkLayout(){const n=D.length;
 for(let att=0;att<300;att++){
  D.forEach(d=>{if(d.reset){d.reset();d.raw=d.ans.slice()}});
  const mp=D.map(()=>[...Array(200).keys()]),lk=D.map(()=>new Set()),pl=D.map(()=>new Set());   // 文字の入れ替え表 / 入れ替えない文字 / 動かさない印の位置
  const fa=i=>D[i].raw.map(x=>mp[i][x]),ord=shuf([...Array(n).keys()]),L=ord.map(i=>D[i].raw.length);
  const force=(i,p,val)=>{const d=D[i];
   if(d.adj){if(pl[i].has(p))return false;if(d.raw[p]===val){pl[i].add(p);return true}if(!d.adj(p,val))return false;pl[i].add(p);return true}
   const x=d.raw[p];if(mp[i][x]===val)return true;if(lk[i].has(x))return false;const y=mp[i].indexOf(val);if(lk[i].has(y))return false;
   [mp[i][x],mp[i][y]]=[mp[i][y],mp[i][x]];lk[i].add(x);return true};
  for(let it=0;it<80;it++){
   const A=D.map((_,i)=>fa(i)),all=[];
   for(let r=0;r<n-1;r++)for(let c=0;c<L[r];c++)for(let c2=0;c2<L[r+1];c2++)if(A[ord[r]][c]===A[ord[r+1]][c2])all.push([r,c,r+1,c2]);
   const s=nAss(L,A,all,2);
   if(s.length==1){let ls=all.slice();for(const l of shuf(all)){const t=ls.filter(x=>x!==l);if(nAss(L,A,t,2).length==1)ls=t}   // 線を必要なものだけに間引く
    setLay(ord,L,ls,mp,A);return true}
   const alt=s.find(x=>x.some((a,r)=>a!=ord[r])),dr=[...Array(n).keys()].filter(r=>alt[r]!=ord[r]),r=dr[R(dr.length)],r2=r==0?1:r==n-1?n-2:r+(R(2)?1:-1),p=R(L[r]),q=R(L[r2]),a=ord[r],b=ord[r2];
   if(!force(a,p,A[b][q]))force(b,q,A[a][p])}   // 区別のつかない行の間に、同じ文字の組を作る
 }
 return false}
function looseLayout(){const n=D.length,ord=shuf([...Array(n).keys()]),A=D.map(d=>d.raw),L=ord.map(i=>A[i].length),all=[];
 for(let r=0;r<n-1;r++)for(let c=0;c<L[r];c++)for(let c2=0;c2<L[r+1];c2++)if(A[ord[r]][c]===A[ord[r+1]][c2])all.push([r,c,r+1,c2]);
 setLay(ord,L,all,D.map(()=>[...Array(200).keys()]),A)}
// ---- 進行 ----
let CURU=36,CONF,GD=1,D,N,LAY,FANS,cur,fin,fsel,memo,inp,solved,CW,t0,tEnd=0,pen=0,miss=0,INGAME=false,GAVE=false,armG=false,armT=false;
async function countdown(){const c=$('#cdn');c.hidden=false;for(const t of['3','2','1','START!']){c.innerHTML=`<div class="cn">${t}</div>`;await sleep(t=='START!'?650:760)}c.hidden=true}
function judge(ok){const j=$('#jg');j.hidden=false;j.innerHTML=`<div class="jo ${ok?'ok':'ng'}"></div>`;setTimeout(()=>{j.hidden=true},950)}
async function begin(c){CONF=c;GD=c.diff;N=c.n;GAVE=false;await PARTS_READY;
 rnd=seededRnd(seedKey(c));mkTable();let ok=0;
 for(let t=0;t<300&&!ok;t++){D=pickTypes(c.types,N).map(p=>{const x=p.gen(3+R(2),GD>=1);return Object.assign(x,{id:p.id,raw:x.ans.slice(),map:[...Array(200).keys()]})});ok=mkLayout()}
 if(!ok)looseLayout();
 rnd=Math.random;
 Object.keys(DRAW).forEach(k=>delete DRAW[k]);HIST=[];INK.on=false;INK.er=false;
 fin=Array(N).fill();fsel=0;memo=D.map(d=>Array(d.ans.length).fill());inp=D.map(()=>[]);solved=D.map(()=>false);cur=0;tEnd=0;pen=0;miss=0;
 $('#dn').textContent=DN[GD]+' '+N+'Q'+(c.mode=='daily'?' ・ DAILY':'');$('#tm').textContent='00:00.0';$('#start').hidden=true;
 await countdown();INGAME=true;setBar();$('#dn').textContent=DN[GD]+' '+N+'Q'+(c.mode=='daily'?' ・ DAILY':'');$('#tm').textContent='00:00.0';
 $('#game').hidden=false;t0=performance.now();render();tick()}
async function launch(){const v=$('#env');if(!v||v.classList.contains('open'))return;
 const c=mkConf();if(c.err){const st=$('#seedst');if(st){st.textContent=c.err;st.classList.add('bad')}else alert(c.err);v.classList.add('shk');setTimeout(()=>v.classList.remove('shk'),450);return}
 saveCfg();v.classList.add('open');await sleep(750);await begin(c)}
function tick(){if(tEnd)return;$('#tm').textContent=fmt(performance.now()-t0+pen*1000);requestAnimationFrame(tick)}
function fit(){CURU=Math.min(36,(document.documentElement.clientWidth-48)/CW);$('#pz').style.setProperty('--u',CURU+'px')}
window.onresize=()=>{if(D){fit();syncDraw()}};
const kbOn=()=>!GAVE&&(cur==N||(GD<2&&cur>=0&&cur<N&&!solved[cur]));
const ansRow=raw=>`<div class="arow">${raw.map((g,i)=>`<span class="ai"><small>${CIR[i]}</small>${G(g,36)}</span>`).join('')}</div>`;
function render(){
 const tabs=[-1,...[...Array(N).keys()],N];$('#tabs').style.setProperty('--tn',tabs.length);
 $('#tabs').innerHTML=tabs.map(i=>`<button data-t="${i}" class="${i==cur?'on':''}${i>=0&&i<N&&solved[i]?' ok':''}">${i==-1?'ITEM':i<N?'Q'+(i+1):'Last'}</button>`).join('');
 const badge=cur<N?'Q'+(cur+1):'Last';let P;
 if(cur==-1){P=[pp(tbl(k=>G(TBL[k],32)),11.2,{plain:1})];D.forEach((d,i)=>{if(d.item)P.push(pp(d.item,10.6,{raw:1,itemQ:i}))})}   // ITEM: 表 + 覆面算(HARD以上)の散らばった紙
 else if(cur<N){P=D[cur].papers.slice();
  if(GAVE){const d=D[cur],s=typeof d.sol=='function'?d.sol():d.sol;P.push(pp(ansRow(d.raw)+(s||''),Math.max(d.solw||6,N>0?4.6:0),{badge:'ANSWER'}))}   // ギブアップ: 答えと盤面の埋め方
  else if(GD<2)P.push(pp('<div id="ans"></div>',5.6))}
 else{P=[pp(`<div id="fl" style="width:calc(var(--u)*${LAY.LW.toFixed(2)});height:calc(var(--u)*${LAY.LH.toFixed(2)})"></div><div id="ans"></div>`,Math.max(LAY.LW+(GAVE?1.3:0),N*1.35)+.4,{img:'final',nosuf:1})];
  if(GD<2||GAVE)P.push(pp('<div id="memo"></div>',6.4,{badge:'MEMO'}))}
 CW=Math.max(...P.map(p=>p.w));fit();$('#pz').className=cur>=0&&cur<N&&D[cur].stack?'stack':'';
 $('#pz').innerHTML=P.map(p=>{const m=p.itemQ!==undefined?D[p.itemQ].map:cur>=0&&cur<N?D[cur].map:null,bd=p.itemQ!==undefined?'Q'+(p.itemQ+1):p.badge||badge,h=fx(p.h,m).replace(/⟦Q⟧/g,bd);
  return p.raw?`<div class="cutwrap">${p.itemQ!==undefined?`<div class="qn">${bd}</div>`:''}${h}</div>`:`<div class="paper${p.plain?' noclip':''}" style="--pw:${p.w}${p.plain?';padding-top:12px':''}">${p.plain?'':`<div class="qn">${bd}</div>`}${p.img?`<img class="rule" src="${IMG(p.img,GD>=1&&!p.nosuf)}" data-n="rule-${p.img}${GD>=1&&!p.nosuf?'-hard':''}.png" alt="">`:''}${h}</div>`}).join('');
 document.querySelectorAll('.rule').forEach(i=>i.onerror=()=>{const d=document.createElement('div');d.className='ph';d.textContent=i.dataset.n;i.replaceWith(d)});
 $('#kb').hidden=!kbOn();drawAns();if(kbOn())drawKb();attachDraw();penUI()}
const slot=(v,cls,at)=>`<div class="sl${cls||''}"${at||''}>${v!==undefined?GR(v,40):'<span class="em"></span>'}</div>`;
function drawAns(){
 if(cur==N){const o=LAY.off,u=(r,c)=>[o[r]+c*1.2,r*2.1],A=D.map(d=>d.ans);
  $('#fl').innerHTML=`<svg class="ln" viewBox="0 0 ${LAY.LW.toFixed(2)} ${LAY.LH.toFixed(2)}" preserveAspectRatio="none">${LAY.lines.map(([r1,c1,r2,c2])=>`<line x1="${(u(r1,c1)[0]+.5).toFixed(2)}" y1="${(u(r1,c1)[1]+1).toFixed(2)}" x2="${(u(r2,c2)[0]+.5).toFixed(2)}" y2="${u(r2,c2)[1].toFixed(2)}"/>`).join('')}</svg>`+
   LAY.L.map((l,r)=>[...Array(l).keys()].map(c=>`<div class="lb" style="left:calc(var(--u)*${u(r,c)[0].toFixed(2)});top:calc(var(--u)*${u(r,c)[1].toFixed(2)})">${LAY.mk[r]==c?`<small class="mn">${CIR[LAY.num[r]]}</small>`:''}${GAVE?GR(A[LAY.ord[r]][c],30):''}</div>`).join('')+(GAVE?`<small class="rq" style="left:calc(var(--u)*${(o[r]+l*1.2+.1).toFixed(2)});top:calc(var(--u)*${(u(r,0)[1]+.25).toFixed(2)})">Q${LAY.ord[r]+1}</small>`:'')).join('');
  const fv=GAVE?FANS:fin;
  $('#ans').innerHTML=fv.map((v,i)=>`<div class="sl${!GAVE&&i==fsel?' sel':''}${GAVE?' auto':''}"${GAVE?'':` data-fs="${i}"`}><small>${CIR[i]}</small>${v!==undefined?GR(v,40):'<span class="em"></span>'}</div>`).join('');
  const mm=$('#memo');if(mm)mm.innerHTML=D.map((d,q)=>`<div class="mr"><b class="mq">Q${q+1}</b>${(GAVE?d.ans:memo[q]).map(v=>slot(v,solved[q]||GAVE?' auto':'')).join('')}</div>`).join('');return}
 const a=$('#ans');if(!a||cur<0)return;
 const v=solved[cur]?D[cur].ans:inp[cur];a.innerHTML=[...Array(D[cur].ans.length).keys()].map(i=>slot(v[i],solved[cur]?' auto':'')).join('')}
// キーボード: 表と同じ配置(縦5×横11、黒マスは空き)。1キー=1文字。横スクロール、正方形キー
function drawKb(){let h='<div class="ks"><div class="kg2">';
 for(let k=0;k<TR*TC;k++)h+=TBL[k]<0?'<i></i>':`<button data-g="${TBL[k]}">${GR(TBL[k],36)}</button>`;
 $('#kb').innerHTML=h+'</div></div><div class="kc"><button id="del">⌫</button><button id="ok">✔</button></div>'}
function put(g){if(cur>=0&&cur<N){if(GD<2&&!solved[cur]&&inp[cur].length<D[cur].ans.length)inp[cur].push(g);return}
 fin[fsel]=g;const nx=[1,2,3,4,5,6,7].map(j=>(fsel+j)%N).find(j=>fin[j]===undefined);if(nx!==undefined)fsel=nx}
function shake(f){const a=$('#ans');a.classList.add('ng');setTimeout(()=>{a.classList.remove('ng');f()},500)}
function check(){if(tEnd)return;
 if(cur==N){if(fin.every((x,i)=>x===FANS[i])){tEnd=performance.now();judge(true);setTimeout(finish,1050);return}
  pen+=PENALTY;miss++;if(PENALTY){const p=$('#pn');p.textContent='+'+PENALTY;p.classList.remove('f');void p.offsetWidth;p.classList.add('f')}
  judge(false);shake(()=>{fin=Array(N).fill();fsel=0;drawAns()})}
 else if(GD<2&&cur>=0&&!solved[cur]){const a=D[cur].ans,v=inp[cur];
  if(v.length==a.length&&v.every((x,i)=>x==a[i])){solved[cur]=true;memo[cur]=a.slice();judge(true);render()}   // 正解→最終問題の画面のメモに自動で置く(誤答ペナルティなし)
  else{judge(false);shake(()=>{inp[cur]=[];drawAns()})}}}
const FW=s=>s.replace(/[0-9]/g,c=>String.fromCharCode(c.charCodeAt(0)+0xFEE0)).replace(/:/g,'：').replace(/\./g,'．');   // 全角にして表示のズレを防ぐ
const fmt2=ms=>{const t=Math.floor(ms/10),p=n=>String(n).padStart(2,'0'),s=Math.floor(t/100);return p(Math.floor(s/60))+':'+p(s%60)+'.'+p(t%100)};
// 共有URLに載せる設定: m=モード s=シード d=難易度 n=問題数 t=出題内容のビット(カスタム) / デイリーは d=日付
function mkQuery(c){const e=encodeURIComponent;if(c.mode=='daily')return`?m=daily&d=${c.dd}`;
 const t=PUZ.reduce((a,p,i)=>a|(c.types.some(x=>x.id==p.id)?1<<i:0),0);
 return c.mode=='cus'?`?m=cus&s=${e(c.seed)}&d=${c.diff}&n=${c.n}&t=${t}`:`?m=seed&s=${e(c.seed)}&d=${c.diff}&n=${c.n}`}
function applyURL(qs){const q=new URLSearchParams(qs),m=q.get('m');if(!m)return false;
 if(m=='daily'){const d=(q.get('d')||'').replace(/\D/g,'');MODE='daily';DAILYD=/^\d{8}$/.test(d)?d:''}
 else if(m=='seed'||m=='cus'){MODE=m;SEEDIN=normSeed(q.get('s')||'');const d=+q.get('d'),n=+q.get('n'),t=+q.get('t');if(d>=0&&d<=2)DIFF=d;if([3,5,7].includes(n))NQ=n;if(m=='cus'&&t>0)PUZ.forEach((p,i)=>ON[p.id]=!!(t>>i&1))}
 else return false;
 saveCfg();return true}   // 共有URLを開くと、シードが入った状態でスタート画面が開く
function tweetText(c,ms,miss,withSeed,url){const dd=c.dd||'',
 head=c.mode=='daily'?`${dd.slice(2,4)}.${dd.slice(4,6)}.${dd.slice(6,8)} DAILY MODE を`:`${withSeed?`シード「${c.seed}」`:''}${DN[c.diff]} ${c.n}問 を`;
 return`《 #異世界謎解きRTA 》\n\n${head}\n■━━━━━━━━━■\n    🕒${FW(fmt2(ms))}\n■━━━━━━━━━■\nでクリアした！\n(❌ミス…${miss}回)\n\n🔻あなたも${withSeed?'同じ問題':'異世界'}に挑戦！\n${url}`}
function finish(){const ms=tEnd-t0+pen*1000,t=fmt(ms),c=CONF;let best='';
 try{const k=c.mode=='std'?`kuuso_best_${GD}_${N}`:c.mode=='daily'?'kuuso_daily_'+c.seed:null;if(k){const b=+localStorage.getItem(k)||0;if(!b||ms<b){localStorage.setItem(k,ms);best='NEW!'}else best=fmt(b)}}catch(e){}
 const th=RANKQ[GD].map(x=>(x*N+60)*1000),rk=ms<th[0]?'S':ms<th[1]?'A':ms<th[2]?'B':'C',lab=`${MODES.find(m=>m[0]==c.mode)[1]} ・ ${DN[GD]} ${N}Q`,sd=c.mode=='daily'?c.dd.replace(/(\d{4})(\d\d)(\d\d)/,'$1-$2-$3'):c.seed;
 let base='';try{base=location.href.split(/[?#]/)[0]}catch(e){}
 const tw=u=>'https://twitter.com/intent/tweet?text='+encodeURIComponent(u);
 $('#tm').textContent=t;$('#game').hidden=true;$('#kb').hidden=true;$('#res').hidden=false;
 $('#res').innerHTML=`<div class="rc">${[...Array(26)].map(()=>`<i class="cf" style="left:${Math.random()*100}%;background:hsl(${Math.random()*360|0},80%,60%);animation-delay:${(Math.random()*2).toFixed(2)}s"></i>`).join('')}<div class="stamp">${rk}</div><div class="rl">${lab}</div><div class="rt">${t}</div><div class="rs">✗ ${miss}${best?`　🏆 ${best}`:''}</div>`+
  `<div class="sd">${c.mode=='daily'?'DAILY':'SEED'}<b id="sdv">${sd}</b></div><div class="rb"><a class="tw" target="_blank" rel="noopener" href="${tw(tweetText(c,ms,miss,false,base))}">共有</a><a class="tw tw2" target="_blank" rel="noopener" href="${tw(tweetText(c,ms,miss,true,base+mkQuery(c)))}">シード付きで共有</a></div>`+
  `<div class="rb">${c.mode=='daily'?'':'<button id="cpy">COPY SEED</button>'}<button id="go">↻ MENU</button></div></div>`}
// ---- メニューバー: タイトル画面=ルール / ゲーム中=ハンバーガー(ギブアップ・タイトルに戻る・閉じる) ----
const MG='ギブアップ（答えを見る）',MT='タイトルに戻る';
function showRules(){$('#rlc').innerHTML=typeof RULES_HTML!='undefined'?RULES_HTML:'<p>ルールが設定されていません(rules.js)</p>';$('#rl').hidden=false}
function closeMenu(){$('#mn').hidden=true;armG=armT=false;$('#mg').textContent=MG;$('#mt').textContent=MT}
function openMenu(){armG=armT=false;$('#mg').textContent=MG;$('#mt').textContent=MT;$('#mg').disabled=GAVE||!!tEnd;$('#mn').hidden=false}
function giveUp(){GAVE=true;tEnd=performance.now();closeMenu();$('#kb').hidden=true;$('#dn').textContent=DN[GD]+' '+N+'Q ・ GIVE UP';render()}
function toTitle(){closeMenu();INGAME=false;INK.on=false;GAVE=false;tEnd=0;$('#res').hidden=true;$('#game').hidden=true;$('#kb').hidden=true;$('#jg').hidden=true;$('#start').hidden=false;penUI();drawStart()}
document.oninput=e=>{if(e.target.id!='seedin')return;SEEDIN=e.target.value.toUpperCase();saveCfg();const st=$('#seedst'),ev=$('#env');if(st){st.className='st';st.textContent=seedInfo()}if(ev)ev.className='env '+envColor()};
document.onclick=e=>{const T=e.target;
 const cl=T.closest('[data-close]');if(cl){if(cl.dataset.close=='rules')$('#rl').hidden=true;else closeMenu();return}
 if(T.closest('#env'))return launch();
 const fs=T.closest('[data-fs]');if(fs){if(!tEnd){fsel=+fs.dataset.fs;drawAns()}return}
 const b=T.closest('button');if(!b)return;
 if(b.id=='tbtn')return INGAME?openMenu():showRules();
 if(b.id=='rlx'){$('#rl').hidden=true;return}
 if(b.id=='mg'){if(!armG){armG=true;b.textContent='もう一度押すと答えを表示';return}return giveUp()}
 if(b.id=='mt'){if(!armT){armT=true;b.textContent='もう一度押すとタイトルへ';return}return toTitle()}
 if(b.id=='mc')return closeMenu();
 if(b.dataset.pen)return penAct(b.dataset.pen);
 if(b.dataset.mode){MODE=b.dataset.mode;DAILYD='';saveCfg();return drawStart()}
 if(b.dataset.d!==undefined){DIFF=+b.dataset.d;saveCfg();return drawStart()}
 if(b.dataset.n!==undefined){NQ=+b.dataset.n;saveCfg();return drawStart()}
 if(b.dataset.ty){const id=b.dataset.ty;if(ON[id]&&PUZ.filter(p=>ON[p.id]).length<2)return;ON[id]=!ON[id];saveCfg();return drawStart()}
 if(b.id=='go')return toTitle();
 if(b.id=='cpy'){try{navigator.clipboard.writeText(CONF.seed);b.textContent='COPIED!'}catch(x){}return}
 if(tEnd&&!GAVE)return;
 if(b.dataset.t!==undefined){cur=+b.dataset.t;return render()}
 if(GAVE)return;
 if(b.dataset.g!==undefined){put(+b.dataset.g);return drawAns()}
 if(b.id=='del'){if(cur>=0&&cur<N)inp[cur].pop();else fin[fsel]=undefined;return drawAns()}
 if(b.id=='ok')check()};
// ---- 各紙に直接書き込むメモ(NORMAL/HARDのみ。EXPERTでは使えない)。座標は「マス(u)」単位で持つので、画面サイズが変わっても位置が合う ----
const DRAW={},INK={on:false,color:'#d22',er:false};let HIST=[],armC=false;
const penOK=()=>GD<2&&INGAME,penLive=()=>penOK()&&!GAVE&&!tEnd;
function redraw(cv){const c=cv.getContext('2d'),dp=cv._dpr||1;c.setTransform(dp,0,0,dp,0,0);c.clearRect(0,0,cv.width,cv.height);
 for(const s of DRAW[cv.dataset.k]||[]){c.globalCompositeOperation=s.e?'destination-out':'source-over';c.strokeStyle=s.c;c.lineWidth=s.w*CURU;c.lineCap=c.lineJoin='round';c.beginPath();
  for(let i=0;i<s.p.length;i+=2){const x=s.p[i]*CURU,y=s.p[i+1]*CURU;i?c.lineTo(x,y):c.moveTo(x,y)}if(s.p.length==2)c.lineTo(s.p[0]*CURU+.01,s.p[1]*CURU);c.stroke()}}
function syncDraw(){const dp=window.devicePixelRatio||1;document.querySelectorAll('.dv').forEach(cv=>{const el=cv.parentElement;cv.width=Math.round(el.offsetWidth*dp);cv.height=Math.round(el.offsetHeight*dp);cv._dpr=dp;redraw(cv)})}
function attachDraw(){if(!penOK())return;
 document.querySelectorAll('#pz .paper,#pz .cut').forEach((el,i)=>{const cv=document.createElement('canvas'),k=cur+':'+i;cv.className='dv';cv.dataset.k=k;if(!DRAW[k])DRAW[k]=[];el.appendChild(cv)});syncDraw()}
function penUI(){const bar=$('#pen'),live=penLive();bar.hidden=!live;if(!live)INK.on=false;
 const pz=$('#pz');if(INK.on)pz.classList.add('pen');else pz.classList.remove('pen');
 document.querySelectorAll('#pen button').forEach(b=>{const a=b.dataset.pen,on=a=='tg'?INK.on:a=='er'?INK.er&&INK.on:/^c\d$/.test(a)?(INK.on&&!INK.er&&INK.color==['#222','#d22','#26c'][+a[1]]):false;b.classList[on?'add':'remove']('on')})}
function penAct(a){
 if(a=='tg')INK.on=!INK.on;
 else if(/^c\d$/.test(a)){INK.color=['#222','#d22','#26c'][+a[1]];INK.er=false;INK.on=true}
 else if(a=='er'){INK.er=!INK.er;INK.on=true}
 else if(a=='un'){const i=HIST.map(h=>h.startsWith(cur+':')).lastIndexOf(true);if(i>=0){const k=HIST.splice(i,1)[0];DRAW[k].pop();document.querySelectorAll('.dv').forEach(redraw)}}
 else if(a=='ck'){const b=document.querySelector('#pck');
  if(!armC){armC=true;if(b)b.textContent='もう一度で全消去';setTimeout(()=>{armC=false;const x=document.querySelector('#pck');if(x)x.textContent='全消去'},3000);return}
  armC=false;if(b)b.textContent='全消去';Object.keys(DRAW).filter(k=>k.startsWith(cur+':')).forEach(k=>DRAW[k]=[]);HIST=HIST.filter(h=>!h.startsWith(cur+':'));document.querySelectorAll('.dv').forEach(redraw)}
 penUI()}
function segDraw(cv,s,x0,y0,x1,y1){const c=cv.getContext('2d'),dp=cv._dpr||1;c.setTransform(dp,0,0,dp,0,0);c.globalCompositeOperation=s.e?'destination-out':'source-over';c.strokeStyle=s.c;c.lineWidth=s.w*CURU;c.lineCap=c.lineJoin='round';c.beginPath();c.moveTo(x0*CURU,y0*CURU);c.lineTo(x1*CURU,y1*CURU);c.stroke()}
{const pz=$('#pz'),dv=e=>e.target.closest?e.target.closest('.dv'):null;
 if(pz.addEventListener){
  pz.addEventListener('pointerdown',e=>{const cv=dv(e);if(!cv||!INK.on||!penLive())return;e.preventDefault();cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);
   const x=e.offsetX/CURU,y=e.offsetY/CURU,s={c:INK.er?'#000':INK.color,w:(INK.er?16:2.6)/CURU,e:INK.er,p:[x,y]};(DRAW[cv.dataset.k]=DRAW[cv.dataset.k]||[]).push(s);HIST.push(cv.dataset.k);cv._s=s;segDraw(cv,s,x,y,x+.001,y)});
  pz.addEventListener('pointermove',e=>{const cv=dv(e);if(!cv||!cv._s)return;e.preventDefault();const s=cv._s,L=s.p.length,x=e.offsetX/CURU,y=e.offsetY/CURU;segDraw(cv,s,s.p[L-2],s.p[L-1],x,y);s.p.push(x,y)});
  const up=e=>{const cv=dv(e);if(cv)cv._s=null};pz.addEventListener('pointerup',up);pz.addEventListener('pointercancel',up)}}
try{applyURL(location.search);if(history.replaceState)history.replaceState(null,'',location.href.split(/[?#]/)[0])}catch(e){}
drawStart();
