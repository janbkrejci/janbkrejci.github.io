(this["webpackJsonpgun-react"]=this["webpackJsonpgun-react"]||[]).push([[0],{19:function(e,t,o){"use strict";o.r(t);var n,r=o(0),s=o.n(r),i=o(3),a=o.n(i),u=o(5),c=o(12),l=o(2),d=o(9),h=o.n(d),j=o(1),g=Object(c.a)((function(e){var t=Object(r.useState)(""),o=Object(u.a)(t,2),n=o[0],s=o[1],i=Object(r.useState)(""),a=Object(u.a)(i,2),c=a[0],d=a[1],g=Object(r.useState)(""),b=Object(u.a)(g,2),f=b[0],p=b[1];return Object(j.jsxs)(j.Fragment,{children:[Object(j.jsxs)("div",{style:{float:"right"},children:["\ud83d\udc64 ",e.store.userAlias]}),Object(j.jsx)("br",{}),e.store.error&&Object(j.jsx)("div",{style:{backgroundColor:"#ffdddd",color:"red",marginLeft:"auto",marginRight:"auto",width:"50%",border:"solid 1px red",padding:"1em"},children:e.store.error}),Object(j.jsx)("br",{}),Object(j.jsx)("pre",{children:h.a.chain(Object(l.c)(e.store.todos)).orderBy((function(e){return e[1].created})).map((function(t){return Object(j.jsxs)("div",{style:{width:"50%",backgroundColor:"seashell",margin:"auto",marginBottom:"0.5em",padding:"1em"},onClick:function(){var o=prompt("Upravit:",t[1].text);o&&e.store.changeTodo(t[1].uid,o)},children:[t[1].text,"\xa0",Object(j.jsx)("span",{title:"Smazat z\xe1znam",style:{float:"right",cursor:"pointer"},onClick:function(o){o.preventDefault(),o.stopPropagation(),e.store.deleteTodo(t[0])},children:"\xd7"})]},t[0])})).value()}),"+"," ",Object(j.jsx)("input",{value:f,placeholder:"Zadej text a stiskni Enter",autoFocus:!0,onKeyPress:function(t){"Enter"===t.key&&(e.store.addTodo(f),p(""))},onChange:function(e){p(e.target.value)}}),Object(j.jsx)("hr",{}),"\ud83d\udc64"," ",Object(j.jsx)("input",{value:n,onChange:function(e){s(e.target.value)}}),Object(j.jsx)("br",{}),"\ud83d\udd11"," ",Object(j.jsx)("input",{value:c,type:"password",onChange:function(e){d(e.target.value)},onKeyPress:function(t){"Enter"===t.key&&e.store.login(n,c)}}),Object(j.jsx)("br",{}),Object(j.jsx)("button",{onClick:function(){e.store.login(n,c)},children:"P\u0159ihl\xe1sit"}),Object(j.jsx)("button",{onClick:function(){e.store.createUser(n,c)},children:"Registrovat"}),Object(j.jsx)("br",{}),Object(j.jsx)("button",{onClick:function(){e.store.logout()},children:"Odhl\xe1sit"}),Object(j.jsx)("button",{onClick:function(){localStorage.clear(),sessionStorage.clear(),window.location.reload()},children:"Resetovat data"})]})})),b=o(4),f=o(7),p=o(10),v=o(11),O=o(21);Object(l.b)({enforceActions:"never",useProxies:"ifavailable"});var x,k=!0;function m(){k&&(console.log("(re)creating Gun connection"),k=!1,(x=Gun({peers:["https://ts.nas-system.cz/gun"],onConnect:m,onDisconnect:y,uuid:O.a})).on("auth",w),x.user().recall({sessionStorage:!0}),window.gun=x)}function y(){k=!0}function w(e){n.mapPropertiesToGun()}var C={pub:null,alias:"Host"},S=new(function(){function e(){Object(p.a)(this,e),this.user=C,this.error="",this.todos={},Object(l.e)(this),window.store=this,n=this,m()}return Object(v.a)(e,[{key:"userAlias",get:function(){return this.user.alias}},{key:"mapPropertiesToGun",value:function(){var e=this;if(console.log("map props to gun"),x.user().is){var t=this;x.user(x.user().is.pub).on((function(e){t.user.alias=e.alias}))}x.user().get("todos").map().on((function(t,o){e.todos=t?Object(f.a)(Object(f.a)({},e.todos),{},Object(b.a)({},o,t)):_.omit(e.todos,[o])}))}},{key:"cleanData",value:function(){x.user(this.user.pub).off(),x.user().get("todos").map().off(),this.todos={}}},{key:"isLoggedIn",value:function(){return x.user().is?(this.error="",!0):(this.setError("Nep\u0159ihl\xe1\u0161en\xfd u\u017eivatel"),!1)}},{key:"addTodo",value:function(e){if(this.isLoggedIn()){var t=Object(O.a)();x.user().get("todos").get(t).put({uid:t,text:e,created:(new Date).toISOString()})}}},{key:"changeTodo",value:function(e,t){x.user().get("todos").get(e).once((function(o){x.user().get("todos").get(e).put({uid:e,text:t,created:o.created,updated:(new Date).toISOString()})}))}},{key:"deleteTodo",value:function(e){this.isLoggedIn()&&x.user().get("todos").get(e).put(null)}},{key:"setError",value:function(e){this.error=e;var t=this;setTimeout((function(){t.error=""}),3e3)}},{key:"createUser",value:function(e,t){var o=this;e?t?t.length<5?this.setError("Heslo mus\xed b\xfdt aspo\u0148 5 znak\u016f dlouh\xe9"):x.user().create(e,t,(function(e){console.log("xxx",e),e.err&&o.setError("U\u017eivatel ji\u017e existuje")})):this.setError("Nezadali jste heslo"):this.setError("Nezadali jste p\u0159ihla\u0161ovac\xed jm\xe9no")}},{key:"login",value:function(e,t){var o=this;x.user().auth(e,t,(function(e){e.err&&o.setError("Neplatn\xe9 p\u0159ihl\xe1\u0161en\xed")}))}},{key:"logout",value:function(){this.cleanData(),this.user=C,x.user().leave()}}]),e}());a.a.render(Object(j.jsx)(s.a.StrictMode,{children:Object(j.jsx)(g,{store:S})}),document.getElementById("root"))}},[[19,1,2]]]);
//# sourceMappingURL=main.8e52d063.chunk.js.map