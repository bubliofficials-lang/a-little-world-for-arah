const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const openBtn=$("#open"), music=$("#music"), petals=$("#petals"), bloom=$("#bloom"), final=$("#final"), bigRose=$("#bigRose");
let audioCtx,playing=false,step=0;

function startMusic(){
  if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==="suspended") audioCtx.resume();
  playing=!playing;
  music.classList.toggle("playing",playing);
  if(playing) loopTone();
}
function loopTone(){
  if(!playing)return;
  const notes=[261.63,329.63,392,329.63,293.66,349.23,440,349.23];
  const t=audioCtx.currentTime;
  notes.forEach((n,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type="sine";o.frequency.value=n;g.gain.setValueAtTime(0,t+i*.42);g.gain.exponentialRampToValueAtTime(.0001,t+i*.42+.36);o.connect(g).connect(audioCtx.destination);o.start(t+i*.42);o.stop(t+i*.42+.4)});
  setTimeout(loopTone,3300);
}
music.onclick=startMusic;
openBtn.onclick=()=>{startMusic();document.querySelector(".story").scrollIntoView({behavior:"smooth"});burst(12)};

const obs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.15});
$$(".reveal").forEach(e=>obs.observe(e));

let idx=0,startX=0;
const cards=$$(".memory");
function showCard(n){idx=(n+cards.length)%cards.length;cards.forEach((c,i)=>c.classList.toggle("active",i===idx))}
$("#memoryStack").addEventListener("touchstart",e=>startX=e.touches[0].clientX,{passive:true});
$("#memoryStack").addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>35)showCard(idx+(dx<0?1:-1));});
$("#memoryStack").addEventListener("click",()=>showCard(idx+1));

$$(".love-card").forEach(c=>c.onclick=()=>{$("#loveNote").textContent=c.dataset.text;$("#loveNote").animate([{opacity:.2},{opacity:1}],{duration:450})});
$("#wish").onclick=()=>{$("#wishText").classList.add("show");burst(20)};

bloom.onclick=()=>{bigRose.classList.add("bloom");final.classList.add("show");bloom.textContent="🌹 Bloomed";burst(35);setTimeout(()=>final.scrollIntoView({behavior:"smooth",block:"center"}),500)};

function burst(n){
 for(let i=0;i<n;i++){const p=document.createElement("span");p.className="petal";p.textContent=Math.random()>.45?"🌹":"✦";p.style.left=Math.random()*100+"%";p.style.animationDuration=(3+Math.random()*4)+"s";p.style.animationDelay=(Math.random()*1.2)+"s";p.style.fontSize=(10+Math.random()*14)+"px";petals.appendChild(p);setTimeout(()=>p.remove(),8000)}
}
setInterval(()=>{if(Math.random()<.35)burst(1)},3500);