import{C as e,R as t,T as n,V as r,_ as i,b as a,x as o}from"./chunks/vue.runtime.esm-bundler.BB7fvrom.js";import{p as s}from"./chunks/client.Bm-rI_R6.js";var c={style:{position:`fixed`,inset:`0`,width:`96px`,height:`96px`,margin:`auto`,"pointer-events":`none`},width:`512`,height:`512`,viewBox:`0 0 512 512`,fill:`none`,xmlns:`http://www.w3.org/2000/svg`},l=n({__name:`preview`,setup(e){let{isDark:n}=s();return t(()=>{let e=localStorage.getItem(`elysia-playground:preview`);e&&(/<[^>]+>/.test(e)||(e=`<style>
@font-face {
    font-family: 'Geist Mono';
    src:
        url('/assets/GeistMono-Regular.woff2') format('woff2'),
        url('/assets/GeistMono-Regular.woff') format('woff');
}

pre {
	font-family: 'Geist Mono', monospace;
}

html {
	background: ${n.value?`#1e2938`:`#ffffff`};
	color: ${n.value?`#ddd`:`#333`};
}
</style>

<pre>${e}</pre>`),document.open(),document.write(e),document.close())}),(e,t)=>(r(),a(`svg`,c,[...t[0]||=[o("",9)]]))}});const u=JSON.parse(`{"title":"预览","description":"ElysiaJS 的游乐场预览","frontmatter":{"title":"预览","layout":false,"authors":[],"head":[["meta",{"property":"og:title","content":"预览 - ElysiaJS"}],["meta",{"name":"description","content":"ElysiaJS 的游乐场预览"}],["meta",{"property":"og:description","content":"ElysiaJS 的游乐场预览"}]]},"headers":[],"relativePath":"playground/preview.md","filePath":"playground/preview.md","lastUpdated":1768116877000}`);var d=n({name:`playground/preview.md`,setup(t){return(t,n)=>(r(),a(`div`,null,[n[0]||=i(`div`,{style:{display:`none`},hidden:`true`,"aria-hidden":`true`},`Are you an LLM? You can read better optimized documentation at /playground/preview.md for this page in Markdown format`,-1),e(l)]))}});export{u as __pageData,d as default};