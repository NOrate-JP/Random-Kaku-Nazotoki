// 架空の言語でベタ謎解き
// 【謎の追加方法】gen(n,hard) を作って末尾の PUZ に1行足す。
//   n=答えの文字数(3/4), hard=ハードか。戻り値 {ans:[文字id×n], papers:[pp(html,幅(マス数),{img:'画像名'}),...], stack:true(縦並び)}
//   文字は pick(n) で出す(表に採用された50文字だけ)。解が必ず1通りになるよう、作ったら検証して作り直すこと。
const $=s=>document.querySelector(s),R=n=>Math.random()*n|0,RF=Math.random;
const shuf=a=>{a=[...a];for(let i=a.length;i>1;){const j=R(i--);[a[i],a[j]]=[a[j],a[i]]}return a};
let POOL=[...Array(50).keys()];   // 表に採用された50文字(start時に決まる)。全問題・答えはここからだけ出す
const pick=n=>shuf(POOL).slice(0,n);
const G=(i,s=36)=>`<span class="gw" style="--k:${s/36}">${glyph(i,s)}</span>`,row=a=>`<span class="row">${a.map(i=>G(i,34)).join('')}</span>`;
const fmt=ms=>{const s=ms/1000;return String(s/60|0).padStart(2,'0')+':'+(s%60).toFixed(1).padStart(4,'0')};
const CIR='①②③④⑤',pp=(h,w,o)=>({h,w,...o});
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
// ---- 五十音表(Q): 空の表に番号。ハードは紙を3つに切って並べ替え(切り口のギザギザが合うのは1通り) ----
function gGojuon(n,hard){const cl=shuf(OPEN).slice(0,n),f=k=>cl.includes(k)?`<b class="mk">${CIR[cl.indexOf(k)]}</b>`:'',ans=cl.map(k=>TBL[k]);
 if(!hard)return{ans,papers:[pp(tbl(f),11.2)]};
 const c1=3+R(3),c2=c1+2+R(8-c1),cuts=[[0,c1],[c1,c2],[c2,TC]],M=.45,m=M/3;
 let pa,pb;do{pa=[...Array(5)].map(()=>R(4));pb=[...Array(5)].map(()=>R(4))}while(pa.every(x=>x==pa[0])||pb.every(x=>x==pb[0])||pa+''==pb+'');
 const pcs=cuts.map(([a,b],i)=>{const Lp=i==1?pa:i==2?pb:null,Rp=i==0?pa:i==1?pb:null,yy=j=>`calc(12px + var(--u)*${j})`,
   xr=j=>Rp?`calc(100% - var(--u)*${M} + var(--u)*${(Rp[j]*m).toFixed(3)})`:'100%',xl=j=>Lp?`calc(var(--u)*${(Lp[j]*m).toFixed(3)})`:'0px',pts=[];
  for(let j=0;j<5;j++)pts.push(`${xr(j)} ${j?yy(j):'0px'}`,`${xr(j)} ${j<4?yy(j+1):'100%'}`);
  for(let j=4;j>=0;j--)pts.push(`${xl(j)} ${j<4?yy(j+1):'100%'}`,`${xl(j)} ${j?yy(j):'0px'}`);
  return`<div class="cut" style="--rot:${R(7)-3}deg;margin-top:calc(var(--u)*${(RF()*.8).toFixed(2)})"><div class="ci" style="padding:12px ${Rp?`calc(var(--u)*${M})`:'12px'} 12px ${Lp?`calc(var(--u)*${M})`:'12px'};clip-path:polygon(${pts.join(',')})">${tbl(f,a,b)}</div></div>`});
 let o;do{o=shuf([0,1,2])}while(o+''=='0,1,2');
 return{ans,papers:[pp(`<div class="cuts">${o.map(i=>pcs[i]).join('')}</div>`,7.6,{raw:1})]}}
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
 return{ans:st.map(k=>mp[k]),papers:[pp(b+'</div>',C+.4,{img:'skeleton'}),pp(`<div class="wl">${shuf(A).map(w=>`<div>${row(w)}</div>`).join('')}</div>`,6.6)]}}
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
 return{ans:cl.map(i=>W[i/3|0][i%3]),papers:[pp(`<div class="sc" style="height:calc(var(--u)*${Hh})">${Aw.map((w,i)=>at(P[i],R(11)-5,row(w))).join('')}</div>`,9.6,{img:'shiritori'}),pp(ch+'</div>',7.8)]}}
// ---- ババ抜き: 紙のあちこちに散らばった文字。同じ文字のペアを消して左から読む(ハードはペア増) ----
function gBaba(n,hard){const pairs=hard?8:6,ids=pick(pairs+n),sg=ids.slice(pairs);let a=[];for(let i=0;i<pairs;i++)a.push(ids[i],ids[i]);a.push(...sg);a=shuf(a);
 const H=hard?8.2:7.4,P=scatter(a.map(()=>[1.15,1.15]),9.5,H,.3,(i,x,Q)=>!sg.includes(a[i])||Q.every((q,j)=>!sg.includes(a[j])||Math.abs(q[0]-x)>=1));
 const ans=a.map((g,i)=>[g,P[i][0]]).filter(u=>sg.includes(u[0])).sort((u,v)=>u[1]-v[1]).map(u=>u[0]);
 return{ans,papers:[pp(`<div class="sc" style="height:calc(var(--u)*${H})">${a.map((g,i)=>at(P[i],R(31)-15,G(g,40))).join('')}</div>`,9.6,{img:'baba'})]}}
// ---- 覆面算: 対応表を見て計算。ハードは対応表がバラバラのカードになって散らばる。別紙は縦に並べる ----
function gFukumen(n,hard){const m=pick(10),Q=n==3?[123,377,100,400]:n==4?[500,400,500,400]:[5000,4000,5000,4000],x=R(Q[1])+Q[0],y=R(Q[3])+Q[2],num=v=>String(v).split('').map(d=>m[+d]);
 let t;if(hard){const P=scatter(m.map(()=>[1.2,2.2]),10.2,5.4,.25);t=`<div class="sc" style="width:calc(var(--u)*10.2);height:calc(var(--u)*5.4)">${m.map((g,d)=>at(P[d],R(25)-12,`<div class="cd"><small>${d}</small>${G(g,34)}</div>`)).join('')}</div>`}
 else t='<table class="t"><tr>'+m.map((_,d)=>`<th>${d}</th>`).join('')+'</tr><tr>'+m.map(g=>`<td>${G(g,30)}</td>`).join('')+'</tr></table>';
 return{ans:num(x+y),stack:true,papers:[pp(t,10.4),pp(`<div class="ex">${row(num(x))} + ${row(num(y))} = ?</div>`,10.4)]}}
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
 return{ans:st.map(i=>gl[i]),tries:0,papers:[pp(b,7.4,{img:'polyomino'}),pp(`<div class="pcs">${shuf(html).join('')}</div>`,7.4)]}}
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
   const dec=[];if(hard){for(let k=0;k<60&&dec.length<2;k++){const d=words[R(words.length)].slice();d[R(d.length)]=ids[R(ids.length)];
     if(!words.some(w=>w+''==d+'')&&!dec.some(w=>w+''==d+'')&&wsOcc(g,H,W,d)==0)dec.push(d)}if(dec.length<2)continue}   // ハード: 盤面にない偽のカギ2つ
   const tb='<table class="t">'+[...Array(H).keys()].map(r=>'<tr>'+[...Array(W).keys()].map(c=>`<td>${G(g[r*W+c],32)}</td>`).join('')+'</tr>').join('')+'</table>';
   return{ans:rem.map(k=>g[k]),dbg:{g,H,W,words,dec,rem},papers:[pp(tb,W+.4,{img:'wordsearch'}),pp(`<div class="wl">${shuf(words.concat(dec)).map(w=>`<div>${row(w)}</div>`).join('')}</div>`,5.6)]}}}}
// ---- 謎の登録(ここに足すと Q1〜Q6 に振り分けられる対象になる。6種を超えたら毎回ランダムに6種を選ぶ) ----
const PUZ=[{id:'gojuon',gen:gGojuon},{id:'skeleton',gen:gSkeleton},{id:'shiritori',gen:gShiritori},{id:'baba',gen:gBaba},{id:'fukumen',gen:gFukumen},{id:'polyomino',gen:gPoly},{id:'wordsearch',gen:gWordsearch}];
// ---- 進行 ----
const IMG=n=>`images/rule-${n}.png`;
const PENALTY=10;  // 最終問題の誤答1回あたりの加算秒(0で無効)
const DN=['EASY','NORMAL','HARD'],RANK=[[300,480,720],[480,720,1080],[720,1080,1620]];   // ランク境界(秒): S/A/B
let DIFF=1;try{const v=+localStorage.getItem('kuuso_diff');if(v>=0&&v<=2)DIFF=v}catch(e){}
let D,FA,POS,FIG,cur,fin,auto,sel,inp,solved,CW,t0,tEnd,pen=0,miss=0;
function drawDif(){$('#dif').innerHTML=DN.map((n,i)=>`<button data-d="${i}" class="${i==DIFF?'on':''}">${n}</button>`).join('')}
drawDif();
PARTS_READY.then(()=>{$('#ti').innerHTML=[5,58,19,177,33].map(i=>G(i,30)).join('')});
function mkFig(){const hl=Math.max(...POS.map(p=>p-1)),rows=hl+Math.max(...D.map((d,i)=>d.ans.length-POS[i]))+1;
 let f='<div class="fg" style="grid-template-columns:repeat(7,var(--u))"><i></i>'+D.map((_,i)=>`<small>Q${i+1}</small>`).join('');
 for(let r=0;r<rows;r++){f+=r==hl?'<em>➡</em>':'<i></i>';D.forEach((d,i)=>{const k=r-hl+POS[i]-1;f+=k>=0&&k<d.ans.length?`<b class="${r==hl?'hl':''}"></b>`:'<i></i>'})}
 return f+'</div><div id="ans"></div>'}
async function start(){await PARTS_READY;mkTable();
 const L=()=>DIFF==0?3+R(2):DIFF==2?4+R(2):3+R(3);   // 答えの文字数: EASY 3〜4 / NORMAL 3〜5 / HARD 4〜5
 D=shuf(PUZ).slice(0,6).map(p=>({...p.gen(L(),DIFF==2),id:p.id}));POS=D.map(d=>1+R(d.ans.length));FA=D.map((d,i)=>d.ans[POS[i]-1]);FIG=mkFig();
 fin=Array(6).fill();auto=Array(6).fill(false);inp=D.map(()=>[]);solved=D.map(()=>false);sel=0;cur=0;tEnd=0;pen=0;miss=0;t0=performance.now();
 $('#dn').textContent='✉ '+DN[DIFF];$('#start').hidden=true;$('#res').hidden=true;$('#game').hidden=false;render();tick()}
function tick(){if(tEnd)return;$('#tm').textContent=fmt(performance.now()-t0+pen*1000);requestAnimationFrame(tick)}
function fit(){$('#pz').style.setProperty('--u',Math.min(36,(document.documentElement.clientWidth-48)/CW)+'px')}
window.onresize=()=>{if(D)fit()};
const kbOn=()=>cur==6||(DIFF==0&&cur>=0&&cur<6&&!solved[cur]);
function render(){
 $('#tabs').innerHTML=[-1,0,1,2,3,4,5,6].map(i=>`<button data-t="${i}" class="${i==cur?'on':''}${i>=0&&i<6&&solved[i]?' ok':''}">${i<0?'ITEM':i<6?'Q'+(i+1):'Final'}</button>`).join('');
 const badge=cur<6?'Q'+(cur+1):'Final';let P;
 if(cur<0)P=[pp(tbl(k=>G(TBL[k],32)),11.2,{plain:1})];else if(cur<6){P=D[cur].papers.slice();if(DIFF==0)P.push(pp('<div id="ans"></div>',4.8))}else P=[pp(FIG,8.4)];
 CW=Math.max(...P.map(p=>p.w));fit();$('#pz').className=cur>=0&&cur<6&&D[cur].stack?'stack':'';
 $('#pz').innerHTML=P.map(p=>p.raw?`<div class="cutwrap"><div class="qn">${badge}</div>${p.h}</div>`:`<div class="paper${p.plain?' noclip':''}" style="--pw:${p.w}${p.plain?';padding-top:12px':''}">${p.plain?'':`<div class="qn">${badge}</div>`}${p.img?`<img class="rule" src="${IMG(p.img)}" data-n="rule-${p.img}.png" alt="">`:''}${p.h}</div>`).join('');
 document.querySelectorAll('.rule').forEach(i=>i.onerror=()=>{const d=document.createElement('div');d.className='ph';d.textContent=i.dataset.n;i.replaceWith(d)});
 $('#kb').hidden=!kbOn();drawAns();if(kbOn())drawKb()}
function drawAns(){const a=$('#ans');if(!a||cur<0)return;
 if(cur==6)a.innerHTML=[0,1,2,3,4,5].map(i=>`<div class="sl${i==sel?' sel':''}${auto[i]?' auto':''}" data-s="${i}"><small>${i+1}</small>${fin[i]!==undefined?G(fin[i],40):'<span class="em"></span>'}</div>`).join('');
 else{const v=solved[cur]?D[cur].ans:inp[cur];a.innerHTML=[...Array(D[cur].ans.length).keys()].map(i=>`<div class="sl${solved[cur]?' auto':''}"><small>${i+1}</small>${v[i]!==undefined?G(v[i],40):'<span class="em"></span>'}</div>`).join('')}}
// キーボード: 表と同じ配置(縦5×横11、黒マスは空き)。1キー=1文字。横スクロール、正方形キー
function drawKb(){let h='<div class="ks"><div class="kg2">';
 for(let k=0;k<TR*TC;k++)h+=TBL[k]<0?'<i></i>':`<button data-g="${TBL[k]}">${G(TBL[k],36)}</button>`;
 $('#kb').innerHTML=h+'</div></div><div class="kc"><button id="del">⌫</button><button id="ok">✔</button></div>'}
const nextEmpty=()=>{const i=fin.findIndex(x=>x===undefined);return i<0?sel:i};
function shake(f){const a=$('#ans');a.classList.add('ng');setTimeout(()=>{a.classList.remove('ng');f()},500)}
function check(){
 if(cur==6){if(fin.every((x,i)=>x===FA[i])){tEnd=performance.now();return finish()}
  pen+=PENALTY;miss++;if(PENALTY){const p=$('#pn');p.textContent='+'+PENALTY;p.classList.remove('f');void p.offsetWidth;p.classList.add('f')}
  shake(()=>{fin=fin.map((x,i)=>auto[i]?x:undefined);sel=nextEmpty();drawAns()})}
 else if(DIFF==0&&cur>=0&&!solved[cur]){const a=D[cur].ans,v=inp[cur];
  if(v.length==a.length&&v.every((x,i)=>x==a[i])){solved[cur]=true;fin[cur]=FA[cur];auto[cur]=true;render()}   // 正解→最終問題にメモ(誤答ペナルティなし)
  else shake(()=>{inp[cur]=[];drawAns()})}}
function finish(){const ms=tEnd-t0+pen*1000,t=fmt(ms),k='kuuso_best'+DIFF;let best='';
 try{const b=+localStorage.getItem(k)||0;if(!b||ms<b){localStorage.setItem(k,ms);best='NEW!'}else best=fmt(b)}catch(e){}
 const rk=ms<RANK[DIFF][0]*1000?'S':ms<RANK[DIFF][1]*1000?'A':ms<RANK[DIFF][2]*1000?'B':'C';
 $('#tm').textContent=t;$('#game').hidden=true;$('#res').hidden=false;
 $('#res').innerHTML=`<div class="paper" style="text-align:center;--pw:8"><div class="stamp">${rk}</div><p><b>${DN[DIFF]}</b></p><p class="big">${t}</p><p>✗ ${miss}　🏆 ${best}</p><a class="tw" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('架空の言語でベタ謎解き！['+DN[DIFF]+'] を '+t+'（ランク'+rk+'）でクリアしました！\n#架空言語ベタ謎解き')}">POST</a><p><button id="go">↻</button></p></div>`}
document.onclick=e=>{
 if(e.target.closest('#env')){const v=$('#env');if(!v.classList.contains('open')){v.classList.add('open');setTimeout(start,800)}return}
 const sl=e.target.closest('.sl[data-s]');if(sl){sel=+sl.dataset.s;return drawAns()}
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.d!==undefined){DIFF=+b.dataset.d;try{localStorage.setItem('kuuso_diff',DIFF)}catch(x){}return drawDif()}
 if(b.id=='go'){$('#env').classList.remove('open');$('#res').hidden=true;$('#start').hidden=false;$('#tm').textContent='00:00.0';return}
 if(b.dataset.t!==undefined){cur=+b.dataset.t;return render()}
 if(b.dataset.g!==undefined){const g=+b.dataset.g;
  if(cur==6){fin[sel]=g;auto[sel]=false;const nx=[1,2,3,4,5,6].map(j=>(sel+j)%6).find(j=>fin[j]===undefined);if(nx!==undefined)sel=nx}
  else if(DIFF==0&&cur>=0&&!solved[cur]&&inp[cur].length<D[cur].ans.length)inp[cur].push(g);
  return drawAns()}
 if(b.id=='del'){if(cur==6){const i=fin[sel]!==undefined?sel:fin.map((x,j)=>x!==undefined?j:-1).filter(j=>j>=0).pop();if(i!==undefined){fin[i]=undefined;auto[i]=false;sel=i}}else inp[cur].pop();return drawAns()}
 if(b.id=='ok')check()};
