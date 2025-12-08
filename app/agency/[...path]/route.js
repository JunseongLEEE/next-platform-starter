import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DIST_ROOT = path.join(process.cwd(), 'another_template', 'startbootstrap-agency', 'dist');

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html':
            return 'text/html; charset=utf-8';
        case '.css':
            return 'text/css; charset=utf-8';
        case '.js':
            return 'application/javascript; charset=utf-8';
        case '.svg':
            return 'image/svg+xml';
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.ico':
            return 'image/x-icon';
        default:
            return 'application/octet-stream';
    }
}

function injectAppScripts(html) {
    // Append our tracker and form override just before </body>
    const injection = `\n<script>(function(){\n  function getCookie(name){const value='; '+document.cookie;const parts=value.split('; '+name+'=');if(parts.length===2) return parts.pop().split(';').shift();}\n  function setCookie(name,value,days){let ex='';if(days){const d=new Date();d.setTime(d.getTime()+days*24*60*60*1000);ex='; expires='+d.toUTCString();}document.cookie=name+'='+value+ex+'; path=/';}\n  function getOrCreateId(){var id=getCookie('user');if(id) return id;id=Math.random().toString(36).substring(2,8).toUpperCase();setCookie('user', id, 180);return id;}\n  function pad(n){return n<10?'0'+n:''+n;}\n  function ts(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());}\n  function isMobile(){return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);}\n  function logVisitor(){try{if(sessionStorage.getItem('visitorLogged')==='1') return; sessionStorage.setItem('visitorLogged','1');\n    var id=getOrCreateId(); var landing=location.href; var time=ts(); var params=new URLSearchParams(location.search); var utm=params.get('utm')||''; var device=isMobile()?'mobile':'desktop';\n    fetch('/api/gsheet/visitor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,landingUrl:landing,time_stamp:time,utm:utm,device:device})}).catch(function(){});\n  }catch(e){}}\n  function wireAdviceForm(){try{var form=document.getElementById('contactForm'); if(!form) return; form.addEventListener('submit', function(ev){ev.preventDefault();\n      var email=document.getElementById('email')?document.getElementById('email').value:'';\n      var advice=document.getElementById('message')?document.getElementById('message').value:'';\n      var ownerEl=document.querySelector('input[name=\"owner\"]:checked');\n      var owner=ownerEl?ownerEl.value:'';\n      var scenario=document.getElementById('scenario')?document.getElementById('scenario').value:'';\n      var id=getOrCreateId();\n      if(!email){alert('이메일을 입력해 주세요.');return;}\n      fetch('/api/gsheet/advice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id,email:email,advice:advice,owner:owner,scenario:scenario})})\n        .then(function(r){return r.json();})\n        .then(function(){alert('제출되었습니다. 감사합니다!'); try{document.getElementById('email').value=''; document.getElementById('message').value=''; var s=document.getElementById('scenario'); if(s) s.selectedIndex=0; var checked=document.querySelector('input[name=\"owner\"]:checked'); if(checked) checked.checked=false;}catch(_){} })\n        .catch(function(){alert('제출 중 오류가 발생했습니다.');});\n    });\n  }catch(e){}}\n  document.addEventListener('DOMContentLoaded', function(){logVisitor(); wireAdviceForm();});\n})();</script>\n`;
    // Add floating A-EYE CTA button (no JS to avoid CSP inline-blocks)
    const aeyeCtaHtml = `\n<a href=\"/aeye?src=${encodeURIComponent('https://nonsparing-balustered-juanita.ngrok-free.dev')}\" aria-label=\"A-EYE 시연\"\nstyle=\"position:fixed;bottom:24px;right:24px;z-index:2147483647;background:linear-gradient(135deg,#2563eb,#10b981);color:#fff;font-weight:700;border-radius:9999px;padding:14px 18px;box-shadow:0 8px 24px rgba(0,0,0,0.25);text-decoration:none;border:2px solid rgba(255,255,255,0.9);font-size:16px;backdrop-filter:saturate(1.2) blur(2px);\">\nA‑EYE 시연\n</a>\n`;
    return html.replace(/<\/body>\s*<\/html>/i, injection + aeyeCtaHtml + '</body></html>');
}

export async function GET(request, ctx) {
    try {
        const resolvedParams = ctx?.params ? await ctx.params : {};
        const segments = resolvedParams?.path || [];
        const relative = segments.length === 0 ? 'index.html' : segments.join('/');
        const filePath = path.normalize(path.join(DIST_ROOT, relative));

        if (!filePath.startsWith(DIST_ROOT)) {
            return new NextResponse('Not found', { status: 404 });
        }

        let finalPath = filePath;
        if (!fs.existsSync(finalPath) || fs.statSync(finalPath).isDirectory()) {
            // Support serving project images under /agency/imgs/*
            if (relative.startsWith('imgs/')) {
                const IMGS_ROOT = path.join(process.cwd(), 'imgs');
                finalPath = path.normalize(path.join(IMGS_ROOT, relative.slice(5)));
                if (!finalPath.startsWith(IMGS_ROOT) || !fs.existsSync(finalPath) || fs.statSync(finalPath).isDirectory()) {
                    return new NextResponse('Not found', { status: 404 });
                }
            } else {
                return new NextResponse('Not found', { status: 404 });
            }
        }

        let content = fs.readFileSync(finalPath);
        const contentType = getContentType(finalPath);

        if (contentType.startsWith('text/html')) {
            // inject tracker and form wiring
            const html = content.toString('utf-8');
            const injected = injectAppScripts(html);
            return new NextResponse(injected, { headers: { 'Content-Type': contentType } });
        }

        return new NextResponse(content, { headers: { 'Content-Type': contentType } });
    } catch (e) {
        return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
}


