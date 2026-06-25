'use client'

import { useEffect, useRef } from 'react'

interface GameState {
  running: boolean
  initialized: boolean
  score: number
  lives: number
  lane: number
  targetLane: number
  frame: number
  speed: number
  hi: number
  obstacles: Obstacle[]
  keys: Key[]
  particles: Particle[]
  invincible: number
  raf: number | null
  canvas: HTMLCanvasElement | null
  ctx: CanvasRenderingContext2D | null
  bgOffset: number
  keyTimer: number
  obsTimer: number
  roadLines: number[]
  VPX: number
  VPY: number
  RBY: number
  RHW: number
  LANES3D: number[]
  currentX: number
  targetX: number
  touchStartX: number
  touchStartY: number
}

interface Obstacle { lane: number; z: number; colorLight: string; colorDark: string }
interface Key { lane: number; z: number; spin: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }

const carColors = [
  ['#e74c3c','#922b21'],['#3498db','#1a5276'],['#2ecc71','#1a6637'],
  ['#9b59b6','#6c3483'],['#e67e22','#9c5c12'],['#1abc9c','#0e7a67'],['#f39c12','#8a6500']
]

function mbzCloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.78)'
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2)
  ctx.arc(x+r*0.72, y-r*0.1, r*0.75, 0, Math.PI*2)
  ctx.arc(x+r*1.38, y, r*0.85, 0, Math.PI*2)
  ctx.fill()
}

function mbzPalm(ctx: CanvasRenderingContext2D, x: number, y: number, h2: number) {
  const tip = y + h2
  ctx.save()
  ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 5; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x+h2*0.18, y+h2*0.5, x+h2*0.12, tip); ctx.stroke()
  const dirs: [number,number][] = [[1,0.3],[0.7,-0.8],[0,-1],[-0.7,-0.8],[-1,0.2],[0.5,0.9],[-0.5,0.9]]
  dirs.forEach(d => {
    ctx.strokeStyle = '#2a6020'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(x+h2*0.12, tip); ctx.lineTo(x+h2*0.12+d[0]*24, tip+d[1]*16); ctx.stroke()
  })
  ctx.restore()
}

function drawMBZBG(ctx: CanvasRenderingContext2D, c: HTMLCanvasElement, offset: number) {
  const w = c.width, h = c.height, skyH = Math.floor(h*0.38)
  const sky = ctx.createLinearGradient(0,0,0,skyH)
  sky.addColorStop(0,'#0d5fab'); sky.addColorStop(0.55,'#2e8fd4'); sky.addColorStop(1,'#6bb8e8')
  ctx.fillStyle = sky; ctx.fillRect(0,0,w,skyH)
  ctx.save(); ctx.shadowColor='#FFD60A'; ctx.shadowBlur=30; ctx.fillStyle='#FFE040'
  ctx.beginPath(); ctx.arc(w*0.80, skyH*0.22, 22, 0, Math.PI*2); ctx.fill()
  ctx.shadowBlur=0; ctx.restore()
  const co = (offset*0.07)%(w+160)
  mbzCloud(ctx,(w*0.12-co+w*3)%(w+160)-80, skyH*0.18, 28)
  mbzCloud(ctx,(w*0.45-co+w*3)%(w+160)-80, skyH*0.10, 20)
  mbzCloud(ctx,(w*0.72-co+w*3)%(w+160)-80, skyH*0.22, 16)
  const bo = (offset*0.18)%(w*1.6)
  const bd = [{rx:0.0,bw:52,bh:0.88},{rx:0.08,bw:36,bh:0.62},{rx:0.15,bw:68,bh:1.0},{rx:0.25,bw:44,bh:0.74},{rx:0.33,bw:82,bh:0.90},{rx:0.45,bw:40,bh:0.58},{rx:0.52,bw:62,bh:0.96},{rx:0.62,bw:48,bh:0.80},{rx:0.70,bw:78,bh:1.0},{rx:0.80,bw:52,bh:0.70},{rx:0.88,bw:88,bh:0.86},{rx:0.98,bw:46,bh:0.68},{rx:1.06,bw:68,bh:0.94},{rx:1.15,bw:52,bh:0.62},{rx:1.23,bw:76,bh:0.88}]
  const bc = ['#1a3d5c','#1e4870','#14304a','#243d5a','#1a3050','#0f2840']
  bd.forEach((b,idx) => {
    const bx = (b.rx*w-bo+w*2)%(w*1.7)-70
    const bh2 = skyH*b.bh, by = skyH-bh2
    ctx.fillStyle = bc[idx%bc.length]; ctx.fillRect(bx,by,b.bw,bh2)
    ctx.fillStyle = 'rgba(255,245,130,0.65)'
    for(let wy=by+8;wy<skyH-5;wy+=10) for(let wx=bx+5;wx<bx+b.bw-4;wx+=8) if((Math.floor(wy/10)+Math.floor((wx-bx)/8)+idx*3)%4!==0) ctx.fillRect(wx,wy,4,5)
  })
}

function draw3DRoad(ctx: CanvasRenderingContext2D, c: HTMLCanvasElement, g: GameState, offset: number) {
  const vx=g.VPX,vy=g.VPY,by=g.RBY,hw=g.RHW
  const rg = ctx.createLinearGradient(0,vy,0,by)
  rg.addColorStop(0,'#3a3a3a'); rg.addColorStop(0.5,'#404040'); rg.addColorStop(1,'#2a2a2a')
  ctx.fillStyle=rg; ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx-hw,by); ctx.lineTo(vx+hw,by); ctx.closePath(); ctx.fill()
  for(let i=0;i<g.roadLines.length;i++){
    const z=g.roadLines[i],sy=vy+(by-vy)*z,sw=hw*z*0.97,alp=Math.pow(z,0.5)*0.3
    ctx.strokeStyle=`rgba(255,255,255,${alp})`; ctx.lineWidth=z*2.5
    ctx.beginPath(); ctx.moveTo(vx-sw,sy); ctx.lineTo(vx+sw,sy); ctx.stroke()
  }
  const ls=hw*0.62
  ctx.strokeStyle='rgba(255,255,255,0.55)'; ctx.lineWidth=2; ctx.setLineDash([14,22]); ctx.lineDashOffset=-offset*0.7
  ctx.beginPath(); ctx.moveTo(vx,vy+2); ctx.lineTo(vx-ls,by); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(vx,vy+2); ctx.lineTo(vx+ls,by); ctx.stroke()
  ctx.setLineDash([])
  ctx.strokeStyle='#FFD60A'; ctx.lineWidth=3
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx-hw,by); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx+hw,by); ctx.stroke()
  ctx.fillStyle='#888'
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx-hw,by); ctx.lineTo(vx-hw-22,by); ctx.lineTo(vx-1,vy); ctx.fill()
  ctx.beginPath(); ctx.moveTo(vx,vy); ctx.lineTo(vx+hw,by); ctx.lineTo(vx+hw+22,by); ctx.lineTo(vx+1,vy); ctx.fill()
  const po=(offset*0.55)%(c.width+130)
  for(let pi=0;pi<6;pi++){
    const px2=(pi*(c.width+130)/5-po+c.width*2)%(c.width+140)-25
    const palmZ=Math.max(0.1,Math.min(px2/c.width,1.0))
    const palmScale=0.3+palmZ*0.7
    mbzPalm(ctx,vx-hw-14-(1-palmZ)*30,by-((by-vy)*palmZ)*0.05,-(c.height*0.10*palmScale))
    mbzPalm(ctx,vx+hw+14+(1-palmZ)*30,by-((by-vy)*palmZ)*0.05,-(c.height*0.10*palmScale))
  }
}

function proj3D(lane: number, z: number, g: GameState) {
  const lx=g.LANES3D[lane], sx=g.VPX+(lx-g.VPX)*z, sy=g.VPY+(g.RBY-g.VPY)*z, sc=Math.pow(z,1.08)*1.3
  return {x:sx, y:sy, sc}
}

function draw3DKey(ctx: CanvasRenderingContext2D, k: Key, g: GameState) {
  const p=proj3D(k.lane,k.z,g); const sc=p.sc
  k.spin=(k.spin||0)+0.07
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(k.spin); ctx.scale(sc,sc)
  ctx.shadowColor='#FFD60A'; ctx.shadowBlur=18
  ctx.strokeStyle='#FFD60A'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(0,0,11,0,Math.PI*2); ctx.stroke()
  ctx.fillStyle='#1a1a2a'; ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle='#FFD60A'; ctx.lineWidth=6; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(30,0); ctx.stroke()
  ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(20,0); ctx.lineTo(20,8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(26,0); ctx.lineTo(26,8); ctx.stroke()
  ctx.shadowBlur=0; ctx.restore()
}

function draw3DCar(ctx: CanvasRenderingContext2D, o: Obstacle, g: GameState) {
  const p=proj3D(o.lane,o.z,g); const sc=p.sc
  const w=75*sc,h=40*sc,roof=20*sc
  ctx.save(); ctx.translate(p.x,p.y)
  ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(0,h*0.6,w*0.5,h*0.18,0,0,Math.PI*2); ctx.fill()
  const bg=ctx.createLinearGradient(-w/2,-h/2,w/2,h/2); bg.addColorStop(0,o.colorLight); bg.addColorStop(1,o.colorDark)
  ctx.fillStyle=bg; ctx.fillRect(-w/2,-h/2,w,h)
  ctx.fillStyle=o.colorDark; ctx.fillRect(-w*0.33,-h/2-roof,w*0.66,roof+4)
  ctx.fillStyle='rgba(140,210,255,0.55)'; ctx.fillRect(-w*0.3,-h/2-roof+3,w*0.6,roof-2)
  ctx.fillStyle='rgba(140,210,255,0.35)'; ctx.fillRect(-w/2+6,-h/2+5,w-12,h/2-8)
  ctx.save(); ctx.shadowColor='#ffff80'; ctx.shadowBlur=12*sc; ctx.fillStyle='#ffffa0'
  ctx.beginPath(); ctx.ellipse(-w*0.34,-h*0.42,8*sc,5*sc,0,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse( w*0.34,-h*0.42,8*sc,5*sc,0,0,Math.PI*2); ctx.fill()
  ctx.shadowBlur=0; ctx.restore()
  ctx.fillStyle='#ff3333'; ctx.beginPath(); ctx.ellipse(-w*0.34,h*0.42,7*sc,4*sc,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(w*0.34,h*0.42,7*sc,4*sc,0,0,Math.PI*2); ctx.fill()
  ctx.fillStyle='#111'
  ;[-0.34,0.34].forEach(ex => { ctx.beginPath(); ctx.ellipse(ex*w,h*0.55,10*sc,6*sc,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.ellipse(ex*w,-h*0.55,10*sc,6*sc,0,0,Math.PI*2); ctx.fill() })
  ctx.restore()
}

function drawSimplePlayer(ctx: CanvasRenderingContext2D, x: number, y: number, flash: boolean) {
  if (flash && Math.floor(Date.now()/80)%2===0) return
  ctx.save()
  // Car body
  ctx.fillStyle='#87CEEB'; ctx.fillRect(x-28,y-22,56,30)
  ctx.fillStyle='#5ba8d4'; ctx.fillRect(x-18,y-36,36,18)
  // Windows
  ctx.fillStyle='rgba(200,235,255,0.7)'; ctx.fillRect(x-14,y-33,30,14)
  // Wheels
  ctx.fillStyle='#111'
  ;[-20,20].forEach(ox => { ctx.beginPath(); ctx.ellipse(x+ox,y+10,9,7,0,0,Math.PI*2); ctx.fill() })
  // Headlights
  ctx.fillStyle='#ffffa0'
  ctx.beginPath(); ctx.ellipse(x-22,y-14,5,4,0,0,Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(x+22,y-14,5,4,0,0,Math.PI*2); ctx.fill()
  ctx.restore()
}

export default function GameTab() {
  const gameRef = useRef<GameState>({
    running: false, initialized: false, score: 0, lives: 3, lane: 1, targetLane: 1,
    frame: 0, speed: 0.006, hi: 0, obstacles: [], keys: [], particles: [],
    invincible: 0, raf: null, canvas: null, ctx: null, bgOffset: 0,
    keyTimer: 0, obsTimer: 0, roadLines: [], VPX: 0, VPY: 0, RBY: 0, RHW: 0,
    LANES3D: [0,0,0], currentX: 0, targetX: 0, touchStartX: 0, touchStartY: 0,
  })
  const startScreenRef = useRef<HTMLDivElement>(null)
  const overScreenRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)
  const livesRef = useRef<HTMLDivElement>(null)
  const scoreRef = useRef<HTMLDivElement>(null)
  const finalScoreRef = useRef<HTMLDivElement>(null)
  const hiOverRef = useRef<HTMLDivElement>(null)
  const hiStartRef = useRef<HTMLDivElement>(null)

  function updateHUD() {
    const g = gameRef.current
    if (livesRef.current) {
      let h = ''
      for(let i=0;i<g.lives;i++) h+='❤️'
      for(let i=g.lives;i<3;i++) h+='🖤'
      livesRef.current.innerHTML = h
    }
    if (scoreRef.current) scoreRef.current.innerHTML = '🔑 '+g.score
  }

  function spawnKey() {
    gameRef.current.keys.push({lane: Math.floor(Math.random()*3), z: 0.04, spin: 0})
  }

  function spawnObs() {
    const g = gameRef.current
    const n = g.score>15 && Math.random()<0.28 ? 2 : 1
    const used: number[] = []
    for(let i=0;i<n;i++){
      let l: number; do { l=Math.floor(Math.random()*3) } while(used.includes(l)); used.push(l)
      const cc = carColors[Math.floor(Math.random()*carColors.length)]
      g.obstacles.push({lane:l, z:0.04, colorLight:cc[0], colorDark:cc[1]})
    }
  }

  function spawnParticle(x: number, y: number) {
    const g = gameRef.current
    for(let i=0;i<10;i++){
      const a=Math.random()*Math.PI*2,sp=2+Math.random()*5
      g.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:35,maxLife:35})
    }
  }

  function endGame() {
    const g = gameRef.current
    g.running = false
    if(g.score>g.hi){ g.hi=g.score; try{localStorage.setItem('mbz_hi',''+g.hi)}catch(e){} }
    if(hudRef.current) hudRef.current.style.display='none'
    if(finalScoreRef.current) finalScoreRef.current.textContent='🔑 '+g.score+' Keys Collected'
    if(hiOverRef.current) hiOverRef.current.textContent='🏆 Best: '+g.hi
    if(overScreenRef.current){ overScreenRef.current.style.display='flex' }
  }

  function gameLoop() {
    const g = gameRef.current
    if(!g.running) return
    const c=g.canvas!, ctx=g.ctx!
    g.frame++
    ctx.clearRect(0,0,c.width,c.height)
    g.bgOffset=(g.bgOffset+g.speed*55)%46
    drawMBZBG(ctx,c,g.bgOffset)
    for(let ri=0;ri<g.roadLines.length;ri++){ g.roadLines[ri]+=g.speed*0.75; if(g.roadLines[ri]>1.0) g.roadLines[ri]=0.02 }
    draw3DRoad(ctx,c,g,g.bgOffset)
    g.currentX+=(g.targetX-g.currentX)*0.10
    g.speed=Math.min(0.006+g.score*0.00028,0.022)
    g.keyTimer++; if(g.keyTimer>Math.max(65-g.score*0.8,22)){ spawnKey(); g.keyTimer=0 }
    g.obsTimer++; if(g.obsTimer>Math.max(115-g.score*1.8,48)){ spawnObs(); g.obsTimer=0 }
    const all: {t:string;o:Key|Obstacle}[] = []
    g.keys.forEach(k=>all.push({t:'k',o:k}))
    g.obstacles.forEach(o=>all.push({t:'c',o:o}))
    all.sort((a,b)=>a.o.z-b.o.z)
    const remK: Key[]=[], remO: Obstacle[]=[]
    all.forEach(item=>{
      item.o.z+=g.speed
      if(item.t==='k'){
        const k=item.o as Key
        if(k.z>1.08){remK.push(k);return}
        if(k.z>0.83&&k.lane===g.lane){g.score++;const p=proj3D(k.lane,k.z,g);spawnParticle(p.x,p.y);updateHUD();remK.push(k);return}
        draw3DKey(ctx,k,g)
      } else {
        const o=item.o as Obstacle
        if(o.z>1.08){remO.push(o);return}
        if(g.invincible<=0&&o.z>0.80&&o.lane===g.lane){g.lives--;g.invincible=90;updateHUD();if(g.lives<=0){endGame();return}}
        draw3DCar(ctx,o,g)
      }
    })
    g.keys=g.keys.filter(k=>!remK.includes(k))
    g.obstacles=g.obstacles.filter(o=>!remO.includes(o))
    g.particles=g.particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;const a=p.life/p.maxLife;ctx.fillStyle=`rgba(255,214,10,${a})`;ctx.beginPath();ctx.arc(p.x,p.y,3.5*a,0,Math.PI*2);ctx.fill();return p.life>0})
    if(g.invincible>0) g.invincible--
    const flash=g.invincible>0&&Math.floor(g.invincible/6)%2===1
    drawSimplePlayer(ctx,g.currentX,g.RBY-45,flash)
    if(g.speed>0.013){
      ctx.strokeStyle='rgba(255,214,10,0.10)';ctx.lineWidth=1.5
      for(let sl=0;sl<8;sl++){const slx=30+Math.random()*(c.width-60),sly=g.VPY+10+Math.random()*(c.height-g.VPY-20);ctx.beginPath();ctx.moveTo(slx,sly);ctx.lineTo(slx-25,sly);ctx.stroke()}
    }
    g.raf=requestAnimationFrame(gameLoop)
  }

  function startGame() {
    const g = gameRef.current
    if(!g.initialized) return
    if(g.raf) cancelAnimationFrame(g.raf)
    g.score=0;g.lives=3;g.lane=1;g.frame=0;g.speed=0.006;g.bgOffset=0;g.invincible=0
    g.obstacles=[];g.keys=[];g.particles=[];g.keyTimer=0;g.obsTimer=0
    g.currentX=g.LANES3D[1];g.targetX=g.LANES3D[1]
    if(startScreenRef.current) startScreenRef.current.style.display='none'
    if(overScreenRef.current) overScreenRef.current.style.display='none'
    if(hudRef.current) hudRef.current.style.display='block'
    updateHUD();g.running=true;gameLoop()
  }

  useEffect(() => {
    const g = gameRef.current
    try { g.hi = parseInt(localStorage.getItem('mbz_hi')||'0')||0 } catch(e){}
    if(hiStartRef.current) hiStartRef.current.textContent='🏆 Best: '+g.hi

    const wrap = document.getElementById('mbz-game-wrap')
    const c = document.getElementById('mbz-game-canvas') as HTMLCanvasElement
    if(!wrap||!c) return
    c.width=wrap.offsetWidth; c.height=wrap.offsetHeight
    g.canvas=c; g.ctx=c.getContext('2d')
    const skyH=c.height*0.38
    g.VPX=c.width/2;g.VPY=skyH+18;g.RBY=c.height-18;g.RHW=c.width*0.46
    const ls=g.RHW*0.62
    g.LANES3D=[g.VPX-ls,g.VPX,g.VPX+ls]
    g.currentX=g.LANES3D[1];g.targetX=g.LANES3D[1]
    for(let i=0;i<12;i++) g.roadLines.push(i/12)
    g.initialized=true

    // Draw idle
    const ctx=g.ctx!
    ctx.clearRect(0,0,c.width,c.height)
    drawMBZBG(ctx,c,0)
    draw3DRoad(ctx,c,g,0)
    drawSimplePlayer(ctx,g.LANES3D[1],g.RBY-45,false)

    const onTouchStart=(e:TouchEvent)=>{g.touchStartX=e.touches[0].clientX;g.touchStartY=e.touches[0].clientY}
    const onTouchEnd=(e:TouchEvent)=>{
      if(!g.running){startGame();return}
      const dx=e.changedTouches[0].clientX-g.touchStartX
      const dy=e.changedTouches[0].clientY-g.touchStartY
      if(Math.abs(dx)>Math.abs(dy)){
        if(dx<-25) g.lane=Math.max(0,g.lane-1)
        else if(dx>25) g.lane=Math.min(2,g.lane+1)
        g.targetX=g.LANES3D[g.lane]
      }
    }
    const onKey=(e:KeyboardEvent)=>{
      if(!g.running)return
      if(e.key==='ArrowLeft'||e.key==='a'){g.lane=Math.max(0,g.lane-1);g.targetX=g.LANES3D[g.lane]}
      if(e.key==='ArrowRight'||e.key==='d'){g.lane=Math.min(2,g.lane+1);g.targetX=g.LANES3D[g.lane]}
    }
    c.addEventListener('touchstart',onTouchStart,{passive:true})
    c.addEventListener('touchend',onTouchEnd,{passive:true})
    document.addEventListener('keydown',onKey)
    return ()=>{
      if(g.raf) cancelAnimationFrame(g.raf)
      c.removeEventListener('touchstart',onTouchStart)
      c.removeEventListener('touchend',onTouchEnd)
      document.removeEventListener('keydown',onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="mbz-game-wrap" style={{ position: 'relative', width: '100%', height: 'calc(100dvh - 60px)', background: '#0d0d1a', overflow: 'hidden' }}>
      <canvas id="mbz-game-canvas" style={{ display: 'block', width: '100%', height: '100%' }} />

      {/* Start screen */}
      <div ref={startScreenRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.82)', zIndex: 10 }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🎮</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#FFD60A', letterSpacing: 2, marginBottom: 4 }}>MBZ RUNNER</div>
        <div style={{ fontSize: 13, color: '#aaa', marginBottom: 6 }}>Collect keys · Dodge traffic</div>
        <div ref={hiStartRef} style={{ fontSize: 12, color: '#FFD60A', marginBottom: 28 }}>🏆 Best: 0</div>
        <button onClick={startGame} style={{ background: '#FFD60A', color: '#000', border: 'none', borderRadius: 50, padding: '16px 48px', fontSize: 18, fontWeight: 800, cursor: 'pointer', letterSpacing: 1, boxShadow: '0 0 30px rgba(255,214,10,0.4)' }}>TAP TO PLAY</button>
        <div style={{ marginTop: 24, color: '#555', fontSize: 12 }}>Swipe LEFT / RIGHT to change lanes</div>
      </div>

      {/* Game over */}
      <div ref={overScreenRef} style={{ position: 'absolute', inset: 0, display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.88)', zIndex: 10 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>💥</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#ff4444', marginBottom: 4 }}>GAME OVER</div>
        <div ref={finalScoreRef} style={{ fontSize: 18, color: '#FFD60A', marginBottom: 4 }}>🔑 0 Keys Collected</div>
        <div ref={hiOverRef} style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>🏆 Best: 0</div>
        <button onClick={startGame} style={{ background: '#FFD60A', color: '#000', border: 'none', borderRadius: 50, padding: '14px 44px', fontSize: 17, fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>PLAY AGAIN</button>
      </div>

      {/* HUD */}
      <div ref={hudRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'none', padding: '10px 16px', zIndex: 5, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div ref={livesRef} style={{ fontSize: 20, letterSpacing: 2 }}>❤️❤️❤️</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: '#555', fontWeight: 700, letterSpacing: 2 }}>MBZ RENTALS</div>
          </div>
          <div ref={scoreRef} style={{ fontSize: 20, fontWeight: 800, color: '#FFD60A' }}>🔑 0</div>
        </div>
      </div>
    </div>
  )
}
