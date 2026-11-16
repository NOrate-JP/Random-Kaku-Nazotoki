// 文字パーツ読み込み。parts/ フォルダの SVG を読み込み、無いものは仮の図形で代用する。
// 左右型: L0〜L9(左半分, 縦長 1:2) + R0〜R9(右半分, 縦長 1:2) → 10×10=100文字 (id 0〜99, id=L番号*10+R番号)
// 上下型: T0〜T9(上半分, 横長 2:1) + B0〜B9(下半分, 横長 2:1) → 10×10=100文字 (id 100〜199, id=100+T番号*10+B番号)
const NP=10;
const shape=(w,h,i)=>{const c='fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"',m=Math.min(w,h);
return[`<path ${c} d="M${w*.2} ${h*.2}L${w*.8} ${h*.8}"/>`,
`<circle ${c} cx="${w/2}" cy="${h/2}" r="${m*.3}"/>`,
`<rect ${c} x="${w*.2}" y="${h*.2}" width="${w*.6}" height="${h*.6}"/>`,
`<path ${c} d="M${w/2} ${h*.15}L${w*.85} ${h*.85}L${w*.15} ${h*.85}Z"/>`,
`<path ${c} d="M${w*.1} ${h/2}H${w*.9}"/><circle cx="${w/2}" cy="${h*.2}" r="5" fill="currentColor"/>`,
`<path ${c} d="M${w/2} ${h*.1}V${h*.9}M${w/2} ${h/2}Q${w*.9} ${h*.2} ${w*.9} ${h*.5}"/>`,
`<path ${c} d="M${w*.2} ${h/2}H${w*.8}M${w/2} ${h*.2}V${h*.8}"/>`,
`<path ${c} d="M${w*.15} ${h*.8}Q${w/2} ${h*.1} ${w*.85} ${h*.8}"/>`,
`<path ${c} d="M${w*.2} ${h*.2}L${w*.8} ${h*.2}L${w*.2} ${h*.8}L${w*.8} ${h*.8}"/>`,
`<path ${c} d="M${w*.2} ${h*.5}L${w*.5} ${h*.2}L${w*.8} ${h*.5}L${w*.5} ${h*.8}Z"/>`][i]};
const PARTS={L:[],R:[],T:[],B:[]};
for(let i=0;i<NP;i++){PARTS.L[i]={vb:'0 0 50 100',s:shape(50,100,i)};PARTS.R[i]={vb:'0 0 50 100',s:shape(50,100,(i+3)%NP)};
 PARTS.T[i]={vb:'0 0 100 50',s:shape(100,50,(i+1)%NP)};PARTS.B[i]={vb:'0 0 100 50',s:shape(100,50,(i+5)%NP)}}
const PARTS_READY=(async()=>{const jobs=[];
 for(const k of['L','R','T','B'])for(let i=0;i<NP;i++)jobs.push(fetch(`parts/${k}${i}.svg`).then(r=>r.ok?r.text():null).then(t=>{
  if(!t)return;const d=new DOMParser().parseFromString(t,'image/svg+xml'),s=d.documentElement;if(s.nodeName!='svg'||d.querySelector('parsererror'))return;
  const half=k=='L'||k=='R',vb=s.getAttribute('viewBox')||`0 0 ${parseFloat(s.getAttribute('width'))||(half?50:100)} ${parseFloat(s.getAttribute('height'))||(half?100:50)}`;
  PARTS[k][i]={vb,s:[...s.childNodes].map(n=>new XMLSerializer().serializeToString(n)).join('')}}).catch(()=>{}));
 await Promise.all(jobs)})();
function glyph(id,sz=36){const v=id>=100,k=id%100,a=k/10|0,b=k%10,pa=PARTS[v?'T':'L'][a],pb=PARTS[v?'B':'R'][b];
 const n=(p,x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${p.vb}">${p.s}</svg>`;
 return`<svg class="g" viewBox="0 0 100 100" width="${sz}" height="${sz}">${v?n(pa,0,0,100,50)+n(pb,0,50,100,50):n(pa,0,0,50,100)+n(pb,50,0,50,100)}</svg>`}
