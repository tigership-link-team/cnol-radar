// 약관 · 개인정보 페이지 언어 전환 (회원이 고른 언어를 그대로 보여줘요)
(function () {
  var LANGS = ['ko', 'en', 'ja'];
  var lang = null;
  try { lang = localStorage.getItem('radar.lang'); } catch (e) { /* 저장소를 못 쓰는 환경 */ }
  if (LANGS.indexOf(lang) < 0) {
    var list = (navigator.languages && navigator.languages.length ? Array.prototype.slice.call(navigator.languages) : [navigator.language || 'ko']).map(function (x) { return String(x || '').slice(0, 2).toLowerCase(); });
    lang = list.indexOf('ko') >= 0 ? 'ko' : (list.filter(function (x) { return LANGS.indexOf(x) >= 0; })[0] || 'ko');
  }
  function show(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll('article[lang]').forEach(function (a) { a.hidden = a.getAttribute('lang') !== l; });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    var h = document.querySelector('article[lang="' + l + '"] h1');
    if (h) document.title = h.textContent + ' · CNOL RADAR';
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      try { localStorage.setItem('radar.lang', l); } catch (e) { /* 무시 */ }
      show(l);
    });
  });
  show(lang);
})();
