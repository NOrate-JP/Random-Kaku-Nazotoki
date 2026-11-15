// ★ここを自作SVGに差し替える★
// PARTS.L / PARTS.R : 左半分・右半分 (枠 50x100) 各7個
// PARTS.T / PARTS.B : 上半分・下半分 (枠 100x50) 各7個
// 各要素はSVG断片の文字列。線色は stroke="currentColor" にすると文字色に従う。
// 組み立て: 左右型は L を x=0、R を x=50 に配置 / 上下型は T を y=0、B を y=50 に配置 (全体100x100)
const shape=(w,h,i)=>{const c='fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"',m=Math.min(w,h);
return[`<path ${c} d="M${w*.2} ${h*.2}L${w*.8} ${h*.8}"/>`,
`<circle ${c} cx="${w/2}" cy="${h/2}" r="${m*.3}"/>`,
`<rect ${c} x="${w*.2}" y="${h*.2}" width="${w*.6}" height="${h*.6}"/>`,
`<path ${c} d="M${w/2} ${h*.15}L${w*.85} ${h*.85}L${w*.15} ${h*.85}Z"/>`,
`<path ${c} d="M${w*.1} ${h/2}H${w*.9}"/><circle cx="${w/2}" cy="${h*.2}" r="5" fill="currentColor"/>`,
`<path ${c} d="M${w/2} ${h*.1}V${h*.9}M${w/2} ${h/2}Q${w*.9} ${h*.2} ${w*.9} ${h*.5}"/>`,
`<path ${c} d="M${w*.2} ${h/2}H${w*.8}M${w/2} ${h*.2}V${h*.8}"/>`][i]};
const PARTS={L:[],R:[],T:[],B:[]};
for(let i=0;i<7;i++){PARTS.L[i]=shape(50,100,i);PARTS.R[i]=shape(50,100,(i+3)%7);PARTS.T[i]=shape(100,50,(i+1)%7);PARTS.B[i]=shape(100,50,(i+5)%7)}
// id 0-48: 左右型 (L=id/7, R=id%7) / id 49-97: 上下型 (T=(id-49)/7, B=(id-49)%7)
function glyph(id,sz=36){const v=id>=49,k=id%49,a=k/7|0,b=k%7;
const body=v?`${PARTS.T[a]}<g transform="translate(0 50)">${PARTS.B[b]}</g>`:`${PARTS.L[a]}<g transform="translate(50 0)">${PARTS.R[b]}</g>`;
return`<svg class="g" viewBox="0 0 100 100" width="${sz}" height="${sz}">${body}</svg>`}
