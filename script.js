// ===== 3D 玻璃晶体场景：拖拽 / 旋转 / 缩放 =====
const stage = document.getElementById('stage');
const wrap = document.getElementById('crystals');
const crystals = Array.from(document.querySelectorAll('.crystal'));

// 初始布局（用于重置）
const initial = {};
crystals.forEach(c => {
  initial[c.dataset.key] = {
    x: c.style.getPropertyValue('--x') || '0px',
    y: c.style.getPropertyValue('--y') || '0px',
    z: c.style.getPropertyValue('--z') || '0px',
  };
});

// 场景旋转 / 缩放状态
let rx = 12, ry = 0, zoom = 1;
function applyScene() {
  wrap.style.setProperty('--rx', rx + 'deg');
  wrap.style.setProperty('--ry', ry + 'deg');
  wrap.style.setProperty('--zoom', zoom);
}
applyScene();

// ---- 拖动单个晶体 ----
let drag = null;
crystals.forEach(c => {
  c.addEventListener('pointerdown', e => {
    e.stopPropagation();                 // 阻止触发场景旋转
    drag = {
      el: c,
      px: e.clientX, py: e.clientY,
      ox: parseFloat(c.style.getPropertyValue('--x')) || 0,
      oy: parseFloat(c.style.getPropertyValue('--y')) || 0,
    };
    // 置顶：提升 z 深度
    const z = parseFloat(c.style.getPropertyValue('--z')) || 0;
    c.style.setProperty('--z', z + 120 + 'px');
    c.setPointerCapture(e.pointerId);
    document.body.classList.add('dragging');
  });
  c.addEventListener('pointermove', e => {
    if (!drag || drag.el !== c) return;
    const nx = drag.ox + (e.clientX - drag.px);
    const ny = drag.oy + (e.clientY - drag.py);
    c.style.setProperty('--x', nx + 'px');
    c.style.setProperty('--y', ny + 'px');
  });
  c.addEventListener('pointerup', e => {
    if (drag && drag.el === c) { drag = null; document.body.classList.remove('dragging'); }
  });
  c.addEventListener('pointercancel', () => { drag = null; document.body.classList.remove('dragging'); });
});

// ---- 拖动空白处旋转整个场景 ----
let orbit = null;
stage.addEventListener('pointerdown', e => {
  orbit = { px: e.clientX, py: e.clientY, rx, ry };
  document.body.classList.add('dragging');
});
window.addEventListener('pointermove', e => {
  if (!orbit) return;
  ry = orbit.ry + (e.clientX - orbit.px) * 0.25;
  rx = Math.max(-30, Math.min(45, orbit.rx - (e.clientY - orbit.py) * 0.2));
  applyScene();
});
window.addEventListener('pointerup', () => {
  if (orbit) { orbit = null; document.body.classList.remove('dragging'); }
});

// ---- 滚轮缩放景深 ----
stage.addEventListener('wheel', e => {
  e.preventDefault();
  zoom = Math.max(0.6, Math.min(1.8, zoom - e.deltaY * 0.0008));
  applyScene();
}, { passive: false });

// 点击 HUD 不旋转场景
document.querySelector('.hud').addEventListener('pointerdown', e => e.stopPropagation());

// ---- 重置布局 ----
document.getElementById('reset').addEventListener('click', () => {
  crystals.forEach(c => {
    const o = initial[c.dataset.key];
    c.style.setProperty('--x', o.x);
    c.style.setProperty('--y', o.y);
    c.style.setProperty('--z', o.z);
  });
  rx = 12; ry = 0; zoom = 1; applyScene();
});

// ---- 技能条动画 ----
window.addEventListener('load', () => {
  document.querySelectorAll('.track i').forEach((i, idx) => {
    const w = i.dataset.w;
    setTimeout(() => { i.style.width = w; }, 250 + idx * 150);
  });
});
