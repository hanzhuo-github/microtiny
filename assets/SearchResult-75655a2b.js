import{k as F,d as ee,l as M,m as B,Z as ae,n as le,q as se,s as x,v as D,x as te,y as Y,z as l,A as _,B as I,C as U,D as re,E as ue,G as ne,H as ie,R as oe,O as ce,I as ve,J as pe,K as he,L as ye,M as de,N as me,P,Q as fe}from"./app-7864f323.js";const ge="SEARCH_PRO_QUERY_HISTORY",y=F(ge,[]),He=()=>{const{queryHistoryCount:r}=P,i=r>0;return{enabled:i,queryHistory:y,addQueryHistory:t=>{i&&(y.value.length<r?y.value=Array.from(new Set([t,...y.value])):y.value=Array.from(new Set([t,...y.value.slice(0,r-1)])))},removeQueryHistory:t=>{y.value=[...y.value.slice(0,t),...y.value.slice(t+1)]}}},Qe="SEARCH_PRO_RESULT_HISTORY",{resultHistoryCount:E}=P,d=F(Qe,[]),Re=()=>{const r=M(),i=E>0,t=s=>r.resolve({name:s.key,..."anchor"in s?{hash:`#${s.anchor}`}:{}}).fullPath;return{enabled:i,resultHistory:d,addResultHistory:s=>{if(i){const u={link:t(s),display:s.display};"header"in s&&(u.header=s.header),d.value.length<E?d.value=[u,...d.value]:d.value=[u,...d.value.slice(0,E-1)]}},removeResultHistory:s=>{d.value=[...d.value.slice(0,s),...d.value.slice(s+1)]}}},ke=r=>{const i=oe(),t=B(),{search:s,terminate:u}=ce(),f=x(!1),g=ve([]);return pe(()=>{const m=()=>{g.value=[],f.value=!1},w=fe(H=>{f.value=!0,H?s({type:"search",query:H,locale:t.value,options:i}).then(h=>{g.value=h,f.value=!1}).catch(h=>{console.error(h),m()}):m()},P.searchDelay);Y([r,t],()=>w(r.value),{immediate:!0}),he(()=>{u()})}),{searching:f,results:g}};var we=ee({name:"SearchResult",props:{query:{type:String,required:!0},isFocusing:Boolean},emits:["close","updateQuery"],setup(r,{emit:i}){const t=M(),s=B(),u=ae(le),{enabled:f,addQueryHistory:g,queryHistory:m,removeQueryHistory:w}=He(),{enabled:H,resultHistory:h,addResultHistory:b,removeResultHistory:j}=Re(),L=f||H,S=se(r,"query"),{results:Q,searching:z}=ke(S),o=x({isQuery:!0,index:0}),p=x(0),c=x(0),O=D(()=>L&&(m.value.length>0||h.value.length>0)),C=D(()=>Q.value.length>0),q=D(()=>Q.value[p.value]||null),T=e=>t.resolve({name:e.key,..."anchor"in e?{hash:`#${e.anchor}`}:{}}).fullPath,G=()=>{const{isQuery:e,index:a}=o.value;a===0?o.value={isQuery:!e,index:e?h.value.length-1:m.value.length-1}:o.value={isQuery:e,index:a-1}},J=()=>{const{isQuery:e,index:a}=o.value;a===(e?m.value.length-1:h.value.length-1)?o.value={isQuery:!e,index:0}:o.value={isQuery:e,index:a+1}},K=()=>{p.value=p.value>0?p.value-1:Q.value.length-1,c.value=q.value.contents.length-1},N=()=>{p.value=p.value<Q.value.length-1?p.value+1:0,c.value=0},V=()=>{c.value<q.value.contents.length-1?c.value=c.value+1:N()},Z=()=>{c.value>0?c.value=c.value-1:K()},A=e=>e.map(a=>ye(a)?a:l(a[0],a[1])),W=e=>{if(e.type==="customField"){const a=de[e.index]||"$content",[n,k=""]=me(a)?a[s.value].split("$content"):a.split("$content");return e.display.map(v=>l("div",A([n,...v,k])))}return e.display.map(a=>l("div",A(a)))},R=()=>{p.value=0,c.value=0,i("updateQuery",""),i("close")};return te("keydown",e=>{if(r.isFocusing){if(C.value){if(e.key==="ArrowUp")Z();else if(e.key==="ArrowDown")V();else if(e.key==="Enter"){const a=q.value.contents[c.value],n=T(a);g(r.query),b(a),t.push(n),R()}}else if(H){if(e.key==="ArrowUp")G();else if(e.key==="ArrowDown")J();else if(e.key==="Enter"){const{index:a}=o.value;o.value.isQuery?(i("updateQuery",m.value[a]),e.preventDefault()):(t.push(h.value[a].link),R())}}}}),Y([p,c],()=>{var e;(e=document.querySelector(".search-pro-result-list-item.active .search-pro-result-item.active"))==null||e.scrollIntoView(!1)},{flush:"post"}),()=>l("div",{class:["search-pro-result-wrapper",{empty:S.value?!C.value:!O.value}],id:"search-pro-results"},S.value===""?L?O.value?[f?l("ul",{class:"search-pro-result-list"},l("li",{class:"search-pro-result-list-item"},[l("div",{class:"search-pro-result-title"},u.value.history),m.value.map((e,a)=>l("div",{class:["search-pro-result-item",{active:o.value.isQuery&&o.value.index===a}],onClick:()=>{i("updateQuery",e)}},[l(_,{class:"search-pro-result-type"}),l("div",{class:"search-pro-result-content"},e),l("button",{class:"search-pro-remove-icon",innerHTML:I,onClick:n=>{n.preventDefault(),n.stopPropagation(),w(a)}})]))])):null,H?l("ul",{class:"search-pro-result-list"},l("li",{class:"search-pro-result-list-item"},[l("div",{class:"search-pro-result-title"},u.value.history),h.value.map((e,a)=>l(U,{to:e.link,class:["search-pro-result-item",{active:!o.value.isQuery&&o.value.index===a}],onClick:()=>{R()}},()=>[l(_,{class:"search-pro-result-type"}),l("div",{class:"search-pro-result-content"},[e.header?l("div",{class:"content-header"},e.header):null,l("div",e.display.map(n=>A(n)).flat())]),l("button",{class:"search-pro-remove-icon",innerHTML:I,onClick:n=>{n.preventDefault(),n.stopPropagation(),j(a)}})]))])):null]:u.value.emptyHistory:u.value.emptyResult:z.value?l(re,{hint:u.value.searching}):C.value?l("ul",{class:"search-pro-result-list"},Q.value.map(({title:e,contents:a},n)=>{const k=p.value===n;return l("li",{class:["search-pro-result-list-item",{active:k}]},[l("div",{class:"search-pro-result-title"},e||u.value.defaultTitle),a.map((v,X)=>{const $=k&&c.value===X;return l(U,{to:T(v),class:["search-pro-result-item",{active:$,"aria-selected":$}],onClick:()=>{g(r.query),b(v),R()}},()=>[v.type==="text"?null:l(v.type==="title"?ue:v.type==="heading"?ne:ie,{class:"search-pro-result-type"}),l("div",{class:"search-pro-result-content"},[v.type==="text"&&v.header?l("div",{class:"content-header"},v.header):null,l("div",W(v))])])})])})):u.value.emptyResult)}});export{we as default};
