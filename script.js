const TOTAL_SCENES = 16;
let current = 0;
const scenes = document.querySelectorAll('.scene');
const progressWrap = document.getElementById('progress-wrap');

function buildProgress(){
  progressWrap.innerHTML = '';
  for(let i=0;i<TOTAL_SCENES;i++){
    const d = document.createElement('div');
    d.className = 'dot';
    d.dataset.i = i;
    progressWrap.appendChild(d);
  }
}
buildProgress();

function updateProgress(){
  document.querySelectorAll('.dot').forEach(d=>{
    const i = parseInt(d.dataset.i);
    d.classList.toggle('done', i < current);
    d.classList.toggle('now', i === current);
  });
  progressWrap.classList.toggle('show', current >= 2 && current <= 15);
}

function goTo(n){
  const prevEl = document.querySelector(`.scene[data-scene="${current}"]`);
  const nextEl = document.querySelector(`.scene[data-scene="${n}"]`);
  if(prevEl){ prevEl.classList.add('fading'); setTimeout(()=>{prevEl.classList.remove('active','fading');},700); }
  current = n;
  setTimeout(()=>{
    nextEl.classList.add('active');
    updateProgress();
    onEnterScene(n);
  }, prevEl ? 150 : 0);
}

function onEnterScene(n){
  if(n===5) runCountdown();
  if(n===6) { launchFireworks(); playChime(); }
  if(n===7) startTypewriter();
  if(n===8) revealGallery();
  if(n===12) buildGarden();
  if(n===13) buildStars();
}

let loaderPct = 0;
const loaderFill = document.getElementById('loaderFill');
const loaderInterval = setInterval(()=>{
  loaderPct += Math.random()*14 + 6;
  if(loaderPct >= 100){
    loaderPct = 100;
    clearInterval(loaderInterval);
    setTimeout(()=>goTo(1), 400);
  }
  loaderFill.style.width = loaderPct + '%';
}, 260);

function spawnPetal(){
  const p = document.createElement('div');
  p.className = 'petal';
  const petalEmojis = ['🌸','🌸','🌸','🌸','🌸'];
  p.textContent = petalEmojis[Math.floor(Math.random()*petalEmojis.length)];
  const size = 30 + Math.random()*25;
  p.style.fontSize = size + 'px';
  p.style.left = Math.random()*100 + 'vw';
  const dur = 8 + Math.random()*6;
  p.style.setProperty('--drift', (Math.random()*140-70)+'px');
  p.style.setProperty('--rot', (Math.random()*360)+'deg');
  p.style.animation = `fall ${dur}s linear forwards`;
  document.body.appendChild(p);
  setTimeout(()=>p.remove(), dur*1000+200);
}
setInterval(spawnPetal, 900);
for(let i=0;i<5;i++) setTimeout(spawnPetal, i*300);

document.addEventListener('keydown', e=>{
    if(e.key === 'Enter' && current === 1){
        checkPin();
    }
});
function openEnvelope(){
  const env = document.getElementById('envelope');
  if(env.classList.contains('open')) return;
  env.classList.add('open');
  playPop();
  setTimeout(()=>{ document.getElementById('envNextBtn').style.display='inline-block'; }, 1200);
}

function openGift(){
  const gift = document.getElementById('gift');
  if(gift.classList.contains('open')) return;
  gift.classList.add('open');
  playPop();
  setTimeout(()=>{ document.getElementById('giftNextBtn').style.display='inline-block'; }, 1000);
}

function runCountdown(){
  const el = document.getElementById('countNum');
  let n = 3;
  el.textContent = n;
  el.style.animation = 'none'; void el.offsetWidth; el.style.animation = 'pop .9s ease';
  const iv = setInterval(()=>{
    n--;
    if(n <= 0){
      clearInterval(iv);
      setTimeout(()=>goTo(6), 700);
      return;
    }
    el.textContent = n;
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = 'pop .9s ease';
    playTick();
  }, 1000);
}

const canvas = document.getElementById('fxCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let particles = [];
function launchFireworks(){
  for(let burst=0; burst<5; burst++){
    setTimeout(()=>{
      const cx = Math.random()*canvas.width*0.7 + canvas.width*0.15;
      const cy = Math.random()*canvas.height*0.4 + canvas.height*0.15;
      const hue = [ '#E8A9BC','#D4AF6A','#F0DBA6','#C97B95','#fff' ][burst%5];
      for(let i=0;i<40;i++){
        const angle = (Math.PI*2*i)/40;
        const speed = 2 + Math.random()*3;
        particles.push({
          x:cx,y:cy,
          vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed,
          life:60+Math.random()*20, color:hue, size:2+Math.random()*2
        });
      }
    }, burst*350);
  }
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life--;
    ctx.globalAlpha = Math.max(p.life/80,0);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
  });
  ctx.globalAlpha = 1;
  particles = particles.filter(p=>p.life>0);
  requestAnimationFrame(animateParticles);
}
animateParticles();

const letterContent = `My dearest Reinah,

On this day, the world got a little brighter  because it's the day it got you in it.

I wanted to build you something small and a little silly, just to say: thank you for your laugh, your warmth, and the way you make ordinary days feel a little more golden.

I hope this next year brings you everything you quietly wish for, and a few things you didn't even know to ask for.

Happy birthday. I'm so glad you exist.

With so much love,
Always yours 🌸`;

function startTypewriter(){
  const el = document.getElementById('typewriterText');
  el.innerHTML = '';
  document.getElementById('letterNextBtn').style.display = 'none';
  let i = 0;
  const cursor = '<span class="cursor-blink">&nbsp;</span>';
  function type(){
    if(i <= letterContent.length){
      el.innerHTML = letterContent.slice(0,i).replace(/\n/g,'<br>') + cursor;
      i++;
      setTimeout(type, 22);
    } else {
      el.innerHTML = letterContent.replace(/\n/g,'<br>');
      document.getElementById('letterNextBtn').style.display = 'inline-block';
    }
  }
  type();
}
function revealGallery(){
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = "";

  const photos = [
    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg",
    "photo4.jpg",
    "photo5.jpg",
    "photo6.jpg"
  ];

  photos.forEach((photo, idx)=>{
    const img = document.createElement("img");
    img.src = photo;
    img.alt = "Reinah";
    img.className = "frame";

    grid.appendChild(img);

    setTimeout(()=>{
      img.classList.add("show");
    }, idx * 150);
  });
}

document.querySelectorAll('.candle').forEach(c=>{
  c.addEventListener('click', ()=>{
    if(c.classList.contains('blown')) return;
    c.classList.add('blown');
    playBlow();
    const allBlown = [...document.querySelectorAll('.candle')].every(x=>x.classList.contains('blown'));
    if(allBlown){
      setTimeout(()=>{ document.getElementById('cakeNextBtn').style.display='inline-block'; }, 600);
    }
  });
});

const memories = [
  { emoji:'💛', text:'Your kindness has a way of making people feel instantly at home.' },
  { emoji:'😄', text:'Your laugh is contagious — it turns ordinary moments into good ones.' },
  { emoji:'🌟', text:'You carry more strength than you probably give yourself credit for.' },
  { emoji:'🤝', text:'Anyone lucky enough to call you a friend is having a good year.' },
];
function buildMemGrid(){
  const grid = document.getElementById('memGrid');
  grid.innerHTML = '';
  memories.forEach((m,idx)=>{
    const box = document.createElement('div');
    box.className = 'mem-box';
    box.textContent = '🎁';
    box.addEventListener('click', ()=>{
      if(box.classList.contains('opened')) return;
      box.classList.add('opened');
      box.textContent = m.emoji + ' ' + m.text;
      playPop();
    });
    grid.appendChild(box);
  });
}
buildMemGrid();

function buildGarden(){
  const field = document.getElementById('gardenField');
  if(field.dataset.built) return;
  field.dataset.built = '1';
  const flowers = ['💐','🏵️','🌼','🌺','🪴','🌴🌲'];
  for(let i=0;i<14;i++){
    const f = document.createElement('div');
    f.className = 'flower';
    f.textContent = flowers[i % flowers.length];
    f.style.left = (Math.random()*90+2) + '%';
    f.style.top = (Math.random()*70+15) + '%';
    field.appendChild(f);
  }
  const butterflyEmojis = ['🦋','🕊️'];
  for(let i=0;i<4;i++){
    const b = document.createElement('div');
    b.className = 'butterfly';
    b.textContent = butterflyEmojis[i % butterflyEmojis.length];
    b.style.left = (Math.random()*80+5) + '%';
    b.style.top = (Math.random()*50+10) + '%';
    b.style.animationDelay = (Math.random()*3) + 's';
    field.appendChild(b);
  }
}

const compliments = [
  "You make people feel seen.",
  "Your heart is genuinely one of a kind.",
  "You bring calm into chaotic rooms.",
  "You're braver than you realize.",
  "Your presence is a gift, not just your birthday.",
  "You notice the small things that matter."
];



function restart(){
  window.location.reload();
}
function buildStars(){
  const field = document.getElementById('star-field');
  if(field.dataset.built) return;
  field.dataset.built = '1';

  const banner = document.createElement('div');
  banner.id = 'compliment-banner';
  banner.style.cssText = `
    position:absolute; top:8%; left:50%; transform:translate(-50%,0);
    width:82%; max-width:360px; text-align:center;
    background:var(--glass-strong); border:1px solid var(--glass-border);
    border-radius:16px; padding:14px 18px; font-size:14px;
    backdrop-filter:blur(10px); opacity:0; transition:opacity .35s ease;
    z-index:5;
  `;
  field.appendChild(banner);

  const slots = [
    {left:14, top:10}, {left:50, top:8}, {left:86, top:10},
    {left:14, top:90}, {left:50, top:92}, {left:86, top:90}
  ];

  compliments.forEach((c,idx)=>{
    const {left, top} = slots[idx % slots.length];
    const btn = document.createElement('button');
    btn.className = 'star-btn';
    btn.style.left = left + '%';
    btn.style.top = top + '%';
    btn.style.animationDelay = (Math.random()*2)+'s';

    field.appendChild(btn);
    btn.addEventListener('click', ()=>{
      btn.classList.add('revealed');
      banner.textContent = c;
      banner.style.opacity = '1';
      playChime();
    });
  });
}
function rereadLetter(){
  goTo(7);
}
function endSmile(){
  document.getElementById('smileMsg').style.display = 'block';
}

let audioCtx = null;
let musicOn = false;
let musicNodes = [];
function ensureCtx(){
  if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
  return audioCtx;
}
function toggleMusic(){
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bgMusic');
  musicOn = !musicOn;
  btn.textContent = musicOn ? '🔊' : '🔈';
  if(musicOn){ audio.play(); } else { audio.pause(); }
}
function playChime(){
  ensureCtx();
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((f,i)=>{
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.value = f;
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(audioCtx.destination);
    const t = audioCtx.currentTime + i*0.12;
    osc.start(t);
    gain.gain.exponentialRampToValueAtTime(0.12, t+0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t+0.9);
    osc.stop(t+1);
  });
}
function playTick(){
  ensureCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type='square'; osc.frequency.value = 880;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  osc.start(t); gain.gain.exponentialRampToValueAtTime(0.0001, t+0.15); osc.stop(t+0.2);
}
function playPop(){
  ensureCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type='sine'; osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime+0.15);
  gain.gain.value = 0.08;
  osc.connect(gain).connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  osc.start(t); gain.gain.exponentialRampToValueAtTime(0.0001,t+0.2); osc.stop(t+0.2);
}
function playBlow(){
  ensureCtx();
  const bufferSize = audioCtx.sampleRate * 0.3;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){ data[i] = (Math.random()*2-1) * (1 - i/bufferSize); }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.15;
  noise.connect(gain).connect(audioCtx.destination);
  noise.start();
}

function openLightbox(src){
  document.getElementById('lightboxImg').src = src;
  document.getElementById('photoLightbox').classList.add('show');
}
function closeLightbox(){
  document.getElementById('photoLightbox').classList.remove('show');
}

const REQUIRED_PIN = "2026"; // Your PIN

let enteredPin = "";

function updatePinDisplay(){
    const display = document.getElementById("pinDisplay");

    let dots = "";
    for(let i = 0; i < 4; i++){
        dots += i < enteredPin.length ? "● " : "○ ";
    }

    display.textContent = dots.trim();
}

function pressPin(num){
    if(enteredPin.length >= 4) return;

    enteredPin += num;
    updatePinDisplay();
}

function clearPin(){
    enteredPin = enteredPin.slice(0,-1);
    updatePinDisplay();
}

function checkPin(){

    if(enteredPin === REQUIRED_PIN){

        const audio = document.getElementById("bgMusic");
        if(audio){
            audio.play().catch(()=>{});
        }

        musicOn = true;
        document.getElementById("music-toggle").textContent = "🔊";

        goTo(2);

    }else{

        document.getElementById("pwError").textContent = "Wrong PIN 💖";

        enteredPin = "";
        updatePinDisplay();
    }
}

updatePinDisplay();

