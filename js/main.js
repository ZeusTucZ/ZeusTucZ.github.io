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

  function thumb(p) {
    if (p.cover) return '<div class="thumb"><img src="' + esc(p.cover) + '" alt="" loading="lazy"></div>';
    var c = p.colors && p.colors.length >= 2 ? p.colors : ['#ff9a6b', '#c2477a'];
    return '<div class="thumb" style="background:linear-gradient(140deg,' + esc(c[0]) + ',' + esc(c[1]) + ')">' + mockScreen(p.mock) + '</div>';
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

  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-project]');
    if (c) { openDetail(projectDetail(projects[+c.dataset.project])); return; }
    var b = e.target.closest('.badge');
    if (b) openDetail(credDetail(b.dataset.kind, (b.dataset.kind === 'cert' ? certs : awards)[+b.dataset.i]));
  });

  // ---------- Theme toggle ----------
  $('theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var current = root.dataset.theme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = current === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (err) {}
  });
})();
