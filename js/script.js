/* Мобильное меню */
const menu=document.querySelector('.menu');
function closeMenu() {
  menu.classList.remove('open');
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Открыть меню');
}
menu.addEventListener('click',()=> {
  const open=menu.classList.toggle('open');
  menu.setAttribute('aria-expanded',String(open));
  menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('keydown',e=> {
  if(e.key==='Escape')closeMenu();
});
/* Морской снег: лёгкие частицы в воде */
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
const canvas=document.querySelector('#particles'),ctx=canvas.getContext('2d');
let particles=[];
function fitCanvas() {
  const ratio=Math.min(devicePixelRatio||1,2);
  canvas.width=innerWidth*ratio;
  canvas.height=innerHeight*ratio;
  ctx.setTransform(ratio,0,0,ratio,0,0);
  particles=Array.from( {
    length:Math.min(65,Math.floor(innerWidth/16))
  },()=>( {
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.3,velocity:Math.random()*.22+.08,phase:Math.random()*6
  }));
  if(reduced)paintParticles();
}
function paintParticles() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach(p=> {
    if(!reduced) {
      p.y+=p.velocity;
      p.x+=Math.sin(p.phase+=.003)*.09;
      if(p.y>innerHeight+5)p.y=-5;
    }
    ctx.fillStyle='#c1f6e6';
    ctx.globalAlpha=.12+p.r*.1;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fill();
  });
  if(!reduced)requestAnimationFrame(paintParticles);
}
fitCanvas();
if(!reduced)paintParticles();
addEventListener('resize',fitCanvas);
/* Условная глубина: интерполяция между разделами */
const depthSections=[...document.querySelectorAll('[data-depth]')];
let scrollPending=false;
function updateDepth() {
  scrollPending=false;
  if(!depthSections.length)return;
  const point=scrollY+innerHeight*.35;
  let depth=0;
  for(let i=0;  i<depthSections.length;  i++) {
    const section=depthSections[i],top=section.getBoundingClientRect().top+scrollY,next=depthSections[i+1];
    if(point>=top) {
      if(next) {
        const nextTop=next.getBoundingClientRect().top+scrollY;
        const progress=Math.max(0,Math.min(1,(point-top)/(nextTop-top)));
        depth=Number(section.dataset.depth)+progress*(Number(next.dataset.depth)-Number(section.dataset.depth));
      }
      else {
        depth=Number(section.dataset.depth);
      }
    }
  }
  depth=Math.min(6000,Math.round(depth/10)*10);
  document.querySelector('#depth-value').textContent=depth.toLocaleString('ru-RU')+' м';
  document.documentElement.style.setProperty('--depth',depth/6000);
}
addEventListener('scroll',()=> {
  if(!scrollPending) {
    scrollPending=true;
    requestAnimationFrame(updateDepth);
  }
}, {
  passive:true
});
addEventListener('resize',updateDepth);
updateDepth();
/* Подсветка рядом с курсором-рыбкой */
const halo=document.querySelector('.cursor-halo');
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced) {
  let x=0,y=0,hx=0,hy=0,active=false;
  addEventListener('pointermove',e=> {
    x=e.clientX;
    y=e.clientY;
    if(!active) {
      hx=x;
      hy=y;
      active=true;
    }
    halo.classList.add('visible');
  });
  document.documentElement.addEventListener('pointerleave',()=>halo.classList.remove('visible'));
  addEventListener('blur',()=>halo.classList.remove('visible'));
  function moveHalo() {
    hx+=(x-hx)*.1;
    hy+=(y-hy)*.1;
    halo.style.left=hx+'px';
    halo.style.top=hy+'px';
    requestAnimationFrame(moveHalo);
  }
  moveHalo();
}
/* Режим приглушённого света */
const lightToggle=document.querySelector('#light-toggle');
if(lightToggle)lightToggle.addEventListener('click',()=> {
  const off=document.body.classList.toggle('lights-off');
  lightToggle.setAttribute('aria-pressed',String(off));
  lightToggle.innerHTML='<span class="toggle-dot"></span> '+(off?'ВКЛЮЧИТЬ СВЕТ':'ПРИГЛУШИТЬ СВЕТ');
});
