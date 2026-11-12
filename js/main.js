// Renders the page from window.PORTFOLIO (js/content.js). You shouldn't need to edit this file to add content.
(function () {
  var data = window.PORTFOLIO || {};
  var profile = data.profile || {};
  var projects = data.projects || [];
  var certs = data.certifications || [];
  var awards = data.awards || [];

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function $(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // "2026-03" -> "Mar 2026", "2025" -> "2025"
  function fmtDate(d) {
    if (!d) return '';
    var m = String(d).match(/^(\d{4})(?:-(\d{1,2}))?/);
    if (!m) return String(d);
    return m[2] ? MONTHS[parseInt(m[2], 10) - 1] + ' ' + m[1] : m[1];
  }

  function year(d) { var m = String(d || '').match(/\d{4}/); return m ? m[0] : ''; }

  function linkList(links) {
    return (links || []).filter(function (l) { return l && l.url; }).map(function (l) {
      return '<a class="btn ghost small" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label || 'Link') + ' ↗</a>';
    }).join('');
  }

  // ---------- Profile ----------
  var name = profile.name || 'Your Name';
  var parts = name.trim().toLowerCase().split(/\s+/);
  $('mark').innerHTML = esc(parts[0]) + (parts.length > 1 ? '<i>.</i>' + esc(parts.slice(1).join('')) : '<i>.</i>');
  document.title = name + ' · Portfolio';
  $('headline').innerHTML = esc(profile.headline || 'Things I have built') +
    (profile.headlineAccent ? '<br><span>' + esc(profile.headlineAccent) + '</span>' : '');
  $('intro').textContent = profile.intro || '';
  $('sub-intro').textContent = profile.subIntro || '';
  if (!profile.subIntro) $('sub-intro').hidden = true;

  var heroBtns = '';
  if (profile.available) heroBtns += '<span class="status" style="flex-basis:100%">' + esc(profile.availableText || 'Open to new opportunities') + '</span>';
  heroBtns += '<a class="btn primary" href="#work">See the work</a>';
  if (profile.resume) heroBtns += '<a class="btn ghost" href="' + esc(profile.resume) + '" target="_blank" rel="noopener">Résumé</a>';
  $('hero-buttons').innerHTML = heroBtns;

  $('about-text').innerHTML = (profile.about || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  $('email').textContent = profile.email || '';
  if (!profile.email) $('copy-email').hidden = true;
  $('social').innerHTML = (profile.links || []).map(function (l) {
    return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a></li>';
  }).join('');
  $('footer-name').textContent = '© ' + new Date().getFullYear() + ' ' + name;
  $('footer-year').textContent = profile.location || '';

  $('copy-email').addEventListener('click', function () {
    var btn = this;
    function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = 'Copy email'; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(profile.email).then(function () { done('Copied'); }, function () { selectEmail(); done('Press Ctrl+C'); });
    } else { selectEmail(); done('Press Ctrl+C'); }
  });
  function selectEmail() {
    var r = document.createRange(); r.selectNodeContents($('email'));
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  // ---------- Thumbnails ----------
  function mockScreen(kind) {
    if (kind === 'list') return '<div class="screen"><i class="hl"></i><i></i><i style="width:80%"></i><i style="width:60%"></i><i></i><i style="width:70%"></i></div>';
    if (kind === 'tiles') return '<div class="screen"><i class="hl"></i><div class="tiles"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>';
    if (kind === 'text') return '<div class="screen"><i class="hl"></i><i style="width:90%"></i><i style="width:75%"></i><i style="width:85%"></i><i style="width:50%"></i></div>';
    var hs = [40, 65, 50, 85, 70, 95];
    return '<div class="screen"><i class="hl"></i><i style="width:70%"></i><div class="bars">' +
      hs.map(function (h) { return '<i style="--h:' + h + '%"></i>'; }).join('') + '</div></div>';
  }

  // Illustrated covers, drawn as SVG on a 320x200 canvas. Picked with `mock` in content.js.
  var MONO = 'font-family="ui-monospace,Menlo,Consolas,monospace"';
  var ART = {
    // agent-eval: the real report from the project's README
    terminal: function () {
      // [label, value, value colour, indented]. Columns are placed with x, since HTML-embedded SVG collapses spaces.
      var lines = [
        ['Pass rate:', '100.0%', '#5fd38d'],
        ['Latency p50/p95:', '1042ms / 57768ms', '#c9cdd8'],
        ['Tool calls:', '', ''],
        ['right tool', '100.0%', '#5fd38d', 1],
        ['valid arguments', '100.0%', '#5fd38d', 1],
        ['ran without error', '93.8%', '#ffd479', 1],
        ['Retries:', '1 (rate_limit 1)', '#c9cdd8'],
        ['Cost:', '$0.0027 total', '#c9cdd8'],
        ['Failures:', 'none', '#5fd38d']
      ];
      return '<g transform="translate(34 26)"><rect width="252" height="200" rx="9" fill="#11131a"/>' +
        '<path d="M0 9a9 9 0 0 1 9-9h234a9 9 0 0 1 9 9v10H0z" fill="#1d2030"/>' +
        '<circle cx="13" cy="10" r="3" fill="#ff5f57"/><circle cx="23" cy="10" r="3" fill="#febc2e"/><circle cx="33" cy="10" r="3" fill="#28c840"/>' +
        '<text x="126" y="13" font-size="7" fill="#8a8fa3" text-anchor="middle" ' + MONO + '>evalkit.report</text>' +
        '<g ' + MONO + ' font-size="8" fill="#c9cdd8">' +
        '<text x="12" y="38"><tspan fill="#ffb38a">Experiment 5</tspan>: groq-first · 48 trials</text>' +
        lines.map(function (l, i) {
          var y = 56 + i * 14;
          return '<text x="' + (l[3] ? 22 : 12) + '" y="' + y + '">' + esc(l[0]) + '</text>' +
            (l[1] ? '<text x="112" y="' + y + '" fill="' + l[2] + '">' + esc(l[1]) + '</text>' : '');
        }).join('') + '</g></g>';
    },
    // Drone: onboard camera view, the gate found by colour, frame centre and error
    drone: function (id) {
      return '<defs><linearGradient id="dg' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34445e"/><stop offset="1" stop-color="#151c2a"/></linearGradient></defs>' +
        '<rect width="320" height="200" fill="url(#dg' + id + ')"/>' +
        '<path d="M0 150 L320 138 L320 200 L0 200Z" fill="#0f1520" opacity=".7"/>' +
        '<rect x="132" y="56" width="88" height="88" rx="2" fill="none" stroke="#3d7bff" stroke-width="8"/>' +
        '<rect x="124" y="48" width="104" height="104" fill="none" stroke="#5fd38d" stroke-width="1.5" stroke-dasharray="5 4"/>' +
        '<text x="124" y="43" font-size="8" fill="#5fd38d" ' + MONO + '>gate</text>' +
        '<g stroke="#fff" stroke-width="1.2" opacity=".85"><path d="M160 92v16M152 100h16"/></g>' +
        '<path d="M160 100 L176 100" stroke="#ffb38a" stroke-width="2"/><circle cx="176" cy="100" r="3" fill="#ffb38a"/>' +
        '<g fill="none" stroke="#fff" stroke-width="2" opacity=".6"><path d="M14 30V14h16M306 30V14h-16M14 170v16h16M306 170v16h-16"/></g>' +
        '<g ' + MONO + ' font-size="8" fill="#fff" opacity=".85"><text x="24" y="32">TELLO · ALIGN</text><text x="24" y="178">err x +0.10  y 0.00</text></g>';
    },
    // Lux: audio waveform, transcript and a mind map
    transcript: function () {
      var bars = '';
      for (var i = 0; i < 34; i++) {
        var h = 4 + Math.round(Math.abs(Math.sin(i * 0.9) * 10 + Math.sin(i * 0.37) * 6));
        bars += '<rect x="' + (40 + i * 4) + '" y="' + (52 - h / 2) + '" width="2.2" height="' + h + '" rx="1" fill="#7b6fe0"/>';
      }
      var rows = [[0.92], [0.78], [0.86], [0.6]].map(function (w, i) {
        var y = 82 + i * 22;
        return '<text x="40" y="' + (y + 3) + '" font-size="6.5" fill="#8a8fa3" ' + MONO + '>00:' + (12 + i * 9) + '</text>' +
          '<rect x="64" y="' + y + '" width="' + Math.round(108 * w[0]) + '" height="5" rx="2.5" fill="#d9d6ee"/>' +
          '<rect x="64" y="' + (y + 8) + '" width="' + Math.round(80 * w[0]) + '" height="5" rx="2.5" fill="#ebe9f6"/>';
      }).join('');
      var nodes = [[252, 70], [292, 104], [256, 142], [212, 118]];
      return '<rect x="24" y="22" width="272" height="200" rx="10" fill="#fbfaff"/>' + bars + rows +
        '<line x1="196" y1="30" x2="196" y2="200" stroke="#ebe9f6"/>' +
        nodes.map(function (n) { return '<line x1="250" y1="106" x2="' + n[0] + '" y2="' + n[1] + '" stroke="#b7b0ea" stroke-width="1.5"/>'; }).join('') +
        nodes.map(function (n) { return '<circle cx="' + n[0] + '" cy="' + n[1] + '" r="7" fill="#e3dffa" stroke="#7b6fe0" stroke-width="1.5"/>'; }).join('') +
        '<circle cx="250" cy="106" r="12" fill="#7b6fe0"/><text x="250" y="109" font-size="7" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="700">Lux</text>' +
        '<rect x="210" y="166" width="74" height="18" rx="9" fill="#7b6fe0"/><rect x="220" y="173" width="48" height="4" rx="2" fill="#fff" opacity=".8"/>';
    },
    // Smart Mirror: a mirror with clock, recognised face and reminders
    mirror: function () {
      return '<rect x="96" y="14" width="128" height="200" rx="16" fill="#0c1313" stroke="#cfd8d5" stroke-width="5"/>' +
        '<path d="M104 24 L150 24 L104 92Z" fill="#fff" opacity=".05"/>' +
        '<text x="110" y="44" font-size="20" fill="#fff" font-family="sans-serif" font-weight="300">08:30</text>' +
        '<text x="111" y="56" font-size="7" fill="#9fb3ae" font-family="sans-serif">Monday</text>' +
        '<g fill="none" stroke="#5fd3c0" stroke-width="2"><path d="M138 76h-8v8M182 76h8v8M138 136h-8v-8M182 136h8v-8"/></g>' +
        '<circle cx="160" cy="98" r="14" fill="#2c3b3a"/><path d="M136 134c4-14 14-20 24-20s20 6 24 20" fill="#2c3b3a"/>' +
        '<text x="160" y="150" font-size="6.5" fill="#5fd3c0" text-anchor="middle" font-family="sans-serif">Face recognized</text>' +
        '<g fill="#9fb3ae"><circle cx="113" cy="170" r="2.5"/><circle cx="113" cy="184" r="2.5"/><circle cx="113" cy="198" r="2.5"/></g>' +
        '<g fill="#3f5552"><rect x="120" y="168" width="70" height="4" rx="2"/><rect x="120" y="182" width="56" height="4" rx="2"/><rect x="120" y="196" width="64" height="4" rx="2"/></g>';
    }
  };
  var artId = 0;

  function thumb(p) {
    if (p.cover) return '<div class="thumb"><img src="' + esc(p.cover) + '" alt="' + esc(p.title) + ' screenshot" loading="lazy"></div>';
    var c = p.colors && p.colors.length >= 2 ? p.colors : ['#ff9a6b', '#c2477a'];
    var bg = 'background:linear-gradient(140deg,' + esc(c[0]) + ',' + esc(c[1]) + ')';
    if (ART[p.mock]) {
      return '<div class="thumb" style="' + bg + '"><svg class="art" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        ART[p.mock](++artId) + '</svg></div>';
    }
    return '<div class="thumb" style="' + bg + '">' + mockScreen(p.mock) + '</div>';
  }

  // ---------- Work ----------
  var activeTag = 'all';

  function renderWork() {
    var list = projects.filter(function (p) { return activeTag === 'all' || (p.tags || []).indexOf(activeTag) !== -1; });
    $('work-count').textContent = projects.length + (projects.length === 1 ? ' project' : ' projects');
    if (!list.length) {
      $('work-grid').innerHTML = '<p class="empty">No projects yet. Add one to <code>js/content.js</code> under <code>projects</code>.</p>';
      return;
    }
    // Pairs alternate wide|narrow, narrow|wide. A last unpaired card spans the full row.
    $('work-grid').innerHTML = list.map(function (p, i) {
      var size = (i === list.length - 1 && i % 2 === 0) ? 'full' : ((Math.floor(i / 2) + i) % 2 === 0 ? 'wide' : 'narrow');
      return '<button class="case ' + size + '" type="button" data-project="' + projects.indexOf(p) + '">' +
        thumb(p) +
        '<span class="meta"><h3>' + esc(p.title) + '</h3><span class="yr">' + esc(p.year) + '</span></span>' +
        '<p>' + esc(p.summary) + '</p>' +
        '<span class="stack">' + esc((p.tags || []).join(' · ')) + '</span>' +
        '</button>';
    }).join('');
  }

  // Filter chips appear only when there are enough projects for filtering to help.
  var tagCounts = {};
  projects.forEach(function (p) { (p.tags || []).forEach(function (t) { tagCounts[t] = (tagCounts[t] || 0) + 1; }); });
  var topTags = Object.keys(tagCounts).filter(function (t) { return tagCounts[t] > 1; })
    .sort(function (a, b) { return tagCounts[b] - tagCounts[a]; }).slice(0, 6);
  if (projects.length >= 6 && topTags.length) {
    $('work-filters').innerHTML = ['all'].concat(topTags).map(function (t) {
      return '<button type="button" data-tag="' + esc(t) + '" aria-pressed="' + (t === 'all') + '">' + (t === 'all' ? 'All' : esc(t)) + '</button>';
    }).join('');
    $('work-filters').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      activeTag = b.dataset.tag;
      this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      renderWork();
    });
  }
  renderWork();

  // ---------- Experience ----------
  var experience = data.experience || [];
  if (experience.length) {
    $('exp-count').textContent = experience.length + (experience.length === 1 ? ' team' : ' teams');
    $('exp-list').innerHTML = experience.map(function (x) {
      return '<article class="job">' +
        '<div class="job-head">' +
          '<h3>' + esc(x.org) + '</h3>' +
          (x.school ? '<span class="org">' + esc(x.school) + '</span>' : '') +
          '<span class="when">' + esc(x.period) + (x.location ? ' · ' + esc(x.location) : '') + '</span>' +
          (x.award ? '<span class="pill">' + esc(x.award) + '</span>' : '') +
        '</div>' +
        '<ul class="results">' + (x.points || []).map(function (pt) { return '<li>' + esc(pt) + '</li>'; }).join('') + '</ul>' +
        '</article>';
    }).join('');
  } else {
    $('experience').hidden = true;
  }

  // ---------- Education & skills ----------
  var education = data.education || [];
  var skills = data.skills || [];
  if (education.length || skills.length) {
    $('edu-list').innerHTML = education.map(function (e) {
      return '<div class="edu-item"><span class="k">Education</span><h3>' + esc(e.school) + '</h3>' +
        '<p>' + esc(e.degree) + '</p>' +
        '<p class="when">' + esc(e.period) + (e.location ? ' · ' + esc(e.location) : '') + '</p>' +
        (e.note ? '<span class="pill">' + esc(e.note) + '</span>' : '') + '</div>';
    }).join('');
    $('skills-list').innerHTML = skills.map(function (s) {
      return '<div><dt>' + esc(s.group) + '</dt><dd>' + (s.items || []).map(function (i) { return '<span>' + esc(i) + '</span>'; }).join('') + '</dd></div>';
    }).join('');
  } else {
    $('skills').hidden = true;
  }

  // ---------- Credentials ----------
  var creds = certs.map(function (c, i) { return { kind: 'cert', item: c, i: i, date: c.date }; })
    .concat(awards.map(function (a, i) { return { kind: 'award', item: a, i: i, date: a.date }; }))
    .sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });

  var parts2 = [];
  if (certs.length) parts2.push(certs.length + (certs.length === 1 ? ' certification' : ' certifications'));
  if (awards.length) parts2.push(awards.length + (awards.length === 1 ? ' award' : ' awards'));
  $('cred-count').textContent = parts2.join(' · ');

  $('shelf').innerHTML = creds.length ? creds.map(function (c) {
    var it = c.item;
    var sub = c.kind === 'cert'
      ? esc(it.issuer) + (it.expires ? '. Valid through ' + esc(fmtDate(it.expires)) + '.' : '.')
      : esc(it.by) + (it.detail ? '. ' + esc(it.detail) : '');
    return '<button class="badge" type="button" data-kind="' + c.kind + '" data-i="' + c.i + '">' +
      '<span class="medal' + (c.kind === 'award' ? ' award' : '') + '"><b>' + esc(it.badge || initials(it.title)) + '</b></span>' +
      '<span class="k">' + (c.kind === 'cert' ? 'Certification' : 'Award') + (year(it.date) ? ' · ' + esc(year(it.date)) : '') + '</span>' +
      '<h3>' + esc(it.title) + '</h3><p>' + sub + '</p></button>';
  }).join('') : '<p class="empty">No certifications or awards yet. Add them to <code>js/content.js</code>.</p>';

  function initials(s) {
    return String(s || '').split(/\s+/).filter(Boolean).slice(0, 3).map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  // ---------- Detail dialog ----------
  var dialog = $('detail');

  function openDetail(html) {
    $('detail-body').innerHTML = html;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    dialog.scrollTop = 0;
  }
  $('detail-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

  function projectDetail(p) {
    var facts = [['Year', p.period || year(p.year)], ['Role', p.role], ['Tools', (p.tags || []).join(', ')]]
      .filter(function (f) { return f[1]; });
    var html = '<article class="detail">' + thumb(p) +
      '<div><span class="k">Project</span><h2 id="detail-title">' + esc(p.title) + '</h2></div>' +
      '<p class="summary">' + esc(p.summary) + '</p>';
    if (facts.length) html += '<dl>' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>';
    if (p.problem) html += '<div class="block"><h3>The problem</h3><p>' + esc(p.problem) + '</p></div>';
    if (p.solution) html += '<div class="block"><h3>What I built</h3><p>' + esc(p.solution) + '</p></div>';
    if (p.results && p.results.length) html += '<div class="block"><h3>Results</h3><ul class="results">' + p.results.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>';
    if (p.images && p.images.length) html += '<div class="gallery">' + p.images.map(function (src) { return '<img src="' + esc(src) + '" alt="" loading="lazy">'; }).join('') + '</div>';
    var links = linkList(p.links);
    if (links) html += '<div class="btns">' + links + '</div>';
    return html + '</article>';
  }

  function credDetail(kind, it) {
    var isCert = kind === 'cert';
    var facts = isCert
      ? [['Issuer', it.issuer], ['Issued', fmtDate(it.date)], ['Expires', it.expires ? fmtDate(it.expires) : 'No expiry'], ['Credential ID', it.credentialId]]
      : [['Awarded by', it.by], ['Date', fmtDate(it.date)]];
    facts = facts.filter(function (f) { return f[1]; });
    var html = '<article class="detail"><div><span class="k">' + (isCert ? 'Certification' : 'Award') + '</span>' +
      '<h2 id="detail-title">' + esc(it.title) + '</h2></div>';
    if (it.detail) html += '<p class="summary">' + esc(it.detail) + '</p>';
    html += '<dl>' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>';
    if (it.file && /\.(png|jpe?g|webp|gif|svg)$/i.test(it.file)) html += '<img class="doc" src="' + esc(it.file) + '" alt="' + esc(it.title) + ' certificate">';
    var links = [];
    if (it.verifyUrl) links.push({ label: 'Verify credential', url: it.verifyUrl });
    if (it.file) {
      var label = /\.pdf$/i.test(it.file) ? 'View certificate (PDF)' : /\.(png|jpe?g|webp|gif|svg)$/i.test(it.file) ? 'Open full size' : 'View certificate';
      links.push({ label: label, url: it.file });
    }
    if (links.length) html += '<div class="btns">' + linkList(links) + '</div>';
    return html + '</article>';
  }

  // Each project gets its own link: zeustucz.github.io/#project-agent-eval
  function slug(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function setHash(h) {
    try { history.replaceState(null, '', h ? '#' + h : location.pathname + location.search); } catch (err) {}
  }

  function openProject(i) {
    var p = projects[i];
    if (!p) return;
    var nav = projects.length > 1
      ? '<nav class="pager" aria-label="More projects">' +
          '<button type="button" class="btn ghost small" data-goto="' + ((i - 1 + projects.length) % projects.length) + '">← ' + esc(projects[(i - 1 + projects.length) % projects.length].title) + '</button>' +
          '<button type="button" class="btn ghost small" data-goto="' + ((i + 1) % projects.length) + '">' + esc(projects[(i + 1) % projects.length].title) + ' →</button>' +
        '</nav>'
      : '';
    openDetail(projectDetail(p).replace(/<\/article>$/, nav + '</article>'));
    setHash('project-' + slug(p.title));
  }
  dialog.addEventListener('close', function () {
    if (/^#project-/.test(location.hash)) setHash('');
  });

  function projectIndexByTitle(t) {
    for (var i = 0; i < projects.length; i++) if (projects[i].title === t) return i;
    return -1;
  }

  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto]');
    if (g) { openProject(+g.dataset.goto); return; }
    var c = e.target.closest('[data-project]');
    if (c) { openProject(+c.dataset.project); return; }
    var b = e.target.closest('.badge');
    if (b) openDetail(credDetail(b.dataset.kind, (b.dataset.kind === 'cert' ? certs : awards)[+b.dataset.i]));
  });

  // Open a project straight from a shared link
  (function () {
    var m = location.hash.match(/^#project-(.+)$/);
    if (!m) return;
    for (var i = 0; i < projects.length; i++) {
      if (slug(projects[i].title) === m[1]) { openProject(i); return; }
    }
  })();

  // ---------- Highlights ----------
  var highlights = profile.highlights || [];
  if (highlights.length) {
    $('highlights').innerHTML = highlights.map(function (h) {
      var i = h.project ? projectIndexByTitle(h.project) : -1;
      var inner = '<b>' + esc(h.value) + '</b><span>' + esc(h.label) + '</span>';
      if (i !== -1) return '<li><button type="button" data-project="' + i + '">' + inner + '</button></li>';
      if (h.link) return '<li><a href="' + esc(h.link) + '">' + inner + '</a></li>';
      return '<li><div>' + inner + '</div></li>';
    }).join('');
  } else {
    $('highlights').parentNode.hidden = true;
  }

  // ---------- Header: shadow once scrolled, current section marked in the menu ----------
  var head = $('site-head');
  function onScroll() { head.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var navLinks = document.querySelectorAll('.top nav a[href^="#"]');
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var current = null;
      navLinks.forEach(function (a) { if (!current && seen[a.getAttribute('href').slice(1)]) current = a; });
      navLinks.forEach(function (a) { if (a === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) io.observe(s); });
  }

  // ---------- Theme toggle ----------
  $('theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var current = root.dataset.theme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = current === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', next); } catch (err) {}
    // New theme spreads out in a circle from the button, where the browser supports it
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduceMotion) {
      var r = this.getBoundingClientRect();
      root.style.setProperty('--tx', (r.left + r.width / 2) + 'px');
      root.style.setProperty('--ty', (r.top + r.height / 2) + 'px');
      document.startViewTransition(function () { root.dataset.theme = next; });
    } else {
      root.dataset.theme = next;
    }
  });
})();
