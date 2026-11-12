// Visual effects: the interactive dot field, headline reveal, card tilt,
// magnetic buttons, ticker, counters and scroll reveals. Purely decorative: the page
// works and reads the same without this file. Everything respects reduced motion.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function token(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
  var probe = document.createElement('canvas').getContext('2d');
  function toRgb(c) {
    probe.fillStyle = '#000'; probe.fillStyle = c;
    var v = probe.fillStyle;
    if (v[0] === '#') return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)];
    var m = v.match(/[\d.]+/g);
    return m ? [+m[0], +m[1], +m[2]] : [255, 255, 255];
  }
  function onThemeChange(fn) {
    new MutationObserver(fn).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.addEventListener) mq.addEventListener('change', fn);
  }

  // ---------- 1. Dot field behind the hero ----------
  // A grid of sensor points: they part around the cursor, a slow scan line sweeps
  // across like a lidar pass, and a click sends out a ripple.
  var cv = document.getElementById('field');
  if (cv && cv.getContext) {
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, gap = 28, pts = [], ripples = [];
    var mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4, in: false };
    var cA, cM, running = false, onScreen = true, start = performance.now();

    var readColors = function () { cA = toRgb(token('--accent')); cM = toRgb(token('--muted')); if (reduce) draw(0); };
    var layout = function () {
      var hl = document.querySelector('.highlights');
      var top = cv.parentNode.getBoundingClientRect().top;
      var bottom = hl ? hl.getBoundingClientRect().bottom : top + window.innerHeight;
      W = cv.parentNode.clientWidth;
      H = Math.max(320, Math.round(bottom - top + 60));
      cv.style.height = H + 'px';
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = W < 640 ? 24 : 30;
      pts = [];
      for (var y = gap / 2; y < H; y += gap) {
        for (var x = gap / 2; x < W; x += gap) pts.push({ x: x, y: y, ox: x, oy: y, vx: 0, vy: 0 });
      }
      if (reduce) draw(0);
    };

    var draw = function (now) {
      var t = (now - start) / 1000;
      var R = W < 640 ? 110 : 150;
      // eased cursor, so the field follows smoothly
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      var sweep = reduce ? -1e4 : ((t * 220) % (W + H + 600)) - 300;
      ctx.clearRect(0, 0, W, H);

      var near = [];
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 1;
        var glow = 0;
        if (!reduce && d < R) {
          var f = 1 - d / R;
          p.vx += (dx / d) * f * 2.4;
          p.vy += (dy / d) * f * 2.4;
          glow = f * f;
          if (d < R * 0.75) near.push(p);
        }
        for (var r = 0; r < ripples.length; r++) {
          var rp = ripples[r];
          var rx = p.ox - rp.x, ry = p.oy - rp.y;
          var rd = Math.sqrt(rx * rx + ry * ry) || 1;
          var band = 1 - Math.abs(rd - rp.r) / 40;
          if (band > 0) {
            p.vx += (rx / rd) * band * 3 * rp.life;
            p.vy += (ry / rd) * band * 3 * rp.life;
            glow = Math.max(glow, band * rp.life);
          }
        }
        // springs back to its place
        p.vx += (p.ox - p.x) * 0.05; p.vy += (p.oy - p.y) * 0.05;
        p.vx *= 0.8; p.vy *= 0.8;
        p.x += p.vx; p.y += p.vy;

        var s = (p.ox + p.oy * 0.55) - sweep;
        var scan = Math.exp(-(s * s) / 3200) * 0.55;
        var b = Math.min(1, Math.max(glow, scan));
        var a = 0.16 + b * 0.84;
        var col = [
          Math.round(cM[0] + (cA[0] - cM[0]) * b),
          Math.round(cM[1] + (cA[1] - cM[1]) * b),
          Math.round(cM[2] + (cA[2] - cM[2]) * b)
        ];
        ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 + b * 1.9, 0, 6.2832);
        ctx.fill();
      }

      // sensor lines from the cursor to the closest points
      if (near.length && mouse.in) {
        ctx.lineWidth = 1;
        for (var n = 0; n < near.length; n++) {
          var q = near[n];
          var ld = Math.hypot(q.x - mouse.x, q.y - mouse.y);
          ctx.strokeStyle = 'rgba(' + cA[0] + ',' + cA[1] + ',' + cA[2] + ',' + (0.35 * (1 - ld / (R * 0.75))).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }

      for (var k = ripples.length - 1; k >= 0; k--) {
        ripples[k].r += 9; ripples[k].life *= 0.965;
        if (ripples[k].life < 0.04) ripples.splice(k, 1);
      }
    };

    var loop = function (now) {
      if (!running) return;
      draw(now);
      requestAnimationFrame(loop);
    };
    var setRunning = function () {
      var should = !reduce && onScreen && !document.hidden;
      if (should && !running) { running = true; requestAnimationFrame(loop); }
      if (!should) running = false;
    };

    window.addEventListener('pointermove', function (e) {
      var rect = cv.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      mouse.in = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (mouse.x < -1e3) { mouse.x = x; mouse.y = y; }
      mouse.tx = mouse.in ? x : -1e4; mouse.ty = mouse.in ? y : -1e4;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.in = false; mouse.tx = mouse.ty = -1e4; });
    window.addEventListener('pointerdown', function (e) {
      if (reduce || e.target.closest('a, button, dialog')) return;
      var rect = cv.getBoundingClientRect();
      var x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (y >= 0 && y <= rect.height) ripples.push({ x: x, y: y, r: 0, life: 1 });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; setRunning(); }).observe(cv);
    }
    document.addEventListener('visibilitychange', setRunning);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 120); });
    readColors();
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    onThemeChange(readColors);
    setRunning();

    // The soft glow follows the cursor a little
    var glowEl = document.querySelector('.hero-glow');
    if (glowEl && !reduce && finePointer) {
      window.addEventListener('pointermove', function (e) {
        var gx = (e.clientX / window.innerWidth - 0.5) * 60;
        var gy = (e.clientY / window.innerHeight - 0.5) * 40;
        glowEl.style.transform = 'translate(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px)';
      }, { passive: true });
    }
  }

  // ---------- 2. Headline: words rise into place ----------
  var h1 = document.getElementById('headline');
  if (h1 && !reduce) {
    var wi = 0;
    var split = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var inner = document.createElement('span'); inner.className = 'wi'; inner.textContent = part;
            inner.style.setProperty('--i', wi++);
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          split(child);
        }
      });
    };
    split(h1);
    h1.classList.add('split');
  }

  // ---------- 4. Card tilt with a light glare, plus spotlight on panels ----------
  if (finePointer && !reduce) {
    var grid = document.getElementById('work-grid');
    if (grid) {
      grid.addEventListener('pointermove', function (e) {
        var card = e.target.closest('.case');
        if (!card) return;
        var th = card.querySelector('.thumb');
        var r = th.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        th.style.setProperty('--rx', ((0.5 - py) * 9).toFixed(2) + 'deg');
        th.style.setProperty('--ry', ((px - 0.5) * 11).toFixed(2) + 'deg');
        th.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        th.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        th.style.setProperty('--px', (px - 0.5).toFixed(3));
        th.style.setProperty('--py', (py - 0.5).toFixed(3));
        card.classList.add('tilting');
      });
      grid.addEventListener('pointerout', function (e) {
        var card = e.target.closest('.case');
        if (!card || card.contains(e.relatedTarget)) return;
        var th = card.querySelector('.thumb');
        ['--rx', '--ry', '--px', '--py'].forEach(function (v) { th.style.removeProperty(v); });
        card.classList.remove('tilting');
      });
    }
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.badge, .job, .edu-item');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    }, { passive: true });

    // ---------- 5. Magnetic buttons ----------
    document.addEventListener('pointermove', function (e) {
      var b = e.target.closest && e.target.closest('.btn, .theme-toggle');
      document.querySelectorAll('.magnet-on').forEach(function (m) {
        if (m !== b) { m.style.transform = ''; m.classList.remove('magnet-on'); }
      });
      if (!b) return;
      var r = b.getBoundingClientRect();
      var mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
      b.classList.add('magnet-on');
      b.style.transform = 'translate(' + (mx * 0.22).toFixed(1) + 'px,' + (my * 0.32).toFixed(1) + 'px)';
    }, { passive: true });
  }

  // ---------- 6. Ticker of skills ----------
  var ticker = document.getElementById('ticker');
  var skills = ((window.PORTFOLIO || {}).skills || []).reduce(function (all, g) { return all.concat(g.items || []); }, []);
  if (ticker && skills.length) {
    var pick = skills.filter(function (s) { return s.length <= 22; });
    var row = pick.map(function (s, i) { return '<span class="' + (i % 2 ? 'o' : '') + '">' + s.replace(/[&<>]/g, '') + '</span><b>✦</b>'; }).join('');
    ticker.innerHTML = '<div class="track">' + row + row + '</div>';
  } else if (ticker) {
    ticker.parentNode.hidden = true;
  }

  // ---------- 7. Counters and scroll reveals ----------
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.dataset.count) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;

  function countUp(el) {
    var m = el.dataset.count.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    var to = +m[2], t0 = performance.now(), dur = 1100;
    (function step(now) {
      var k = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(to * e) + m[3];
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  if (io && !reduce) {
    document.querySelectorAll('.highlights b').forEach(function (b) { b.dataset.count = b.textContent; io.observe(b); });
    var groups = ['.sec-title', '.case', '.job', '.badge', '.edu-item', '.skills > div', '.about > *', '.highlights li'];
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add('rv');
        el.style.setProperty('--d', (i % 4) * 70 + 'ms');
        io.observe(el);
      });
    });
  }

  // ---------- 8. Scroll progress in the header ----------
  var bar = document.getElementById('progress');
  if (bar) {
    var upd = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0).toFixed(4) + ')';
    };
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  // ---------- 9. Grain over the whole page ----------
  var grain = document.createElement('div');
  grain.className = 'grain'; grain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(grain);
})();
