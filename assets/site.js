/* Budapesti Békemag public site: small live touches on a page that is rebuilt once a day.
   Today is always the Budapest day, so a missed rebuild never shows yesterday as upcoming. */
(function () {
  var tz = 'Europe/Budapest';
  var today = new Intl.DateTimeFormat('sv-SE', {timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date());
  function daysBetween(a, b) { return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 864e5); }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

  // upcoming items whose day has passed disappear; an emptied group goes with them
  each('[data-upcoming][data-date]', function (el) { if (el.getAttribute('data-date') < today) { el.hidden = true; } });
  each('[data-group]', function (g) { if (!g.querySelector('[data-date]:not([hidden])')) { g.hidden = true; } });
  each('[data-when-empty]', function (el) {
    var scope = document.querySelector(el.getAttribute('data-when-empty'));
    if (scope && !scope.querySelector('[data-date]:not([hidden])')) { el.hidden = false; }
  });

  // "Ma este", "Holnap", "3 nap múlva"
  each('[data-rel]', function (el) {
    var n = daysBetween(today, el.getAttribute('data-rel'));
    var t = n === 0 ? 'Ma este' : n === 1 ? 'Holnap' : (n > 1 && n < 7) ? n + ' nap múlva' : '';
    if (t) { el.textContent = t; el.hidden = false; }
  });

  // calendar: today and the past days
  each('.cal td[data-day]', function (td) {
    var d = td.getAttribute('data-day');
    if (d === today) { td.classList.add('today'); } else if (d < today) { td.classList.add('past'); }
  });

  // the daily 20:22 live meditation on YouTube
  var hm = new Intl.DateTimeFormat('en-GB', {timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false}).format(new Date());
  var mins = parseInt(hm.slice(0, 2), 10) * 60 + parseInt(hm.slice(3, 5), 10);
  var on = mins >= 20 * 60 && mins < 21 * 60;
  var text = on ? 'Most élőben: közös meditáció a YouTube-on' : mins < 20 * 60 ? 'Ma 20:22-kor élőben a YouTube-on' : 'Holnap 20:22-kor élőben a YouTube-on';
  each('[data-live-text]', function (el) { el.textContent = text; });
  each('[data-live]', function (el) { el.classList.toggle('on', on); });

  // share an evening's page
  each('[data-share]', function (b) {
    b.addEventListener('click', function () {
      var url = b.getAttribute('data-share');
      if (navigator.share) { navigator.share({title: document.title, url: url}).catch(function () {}); return; }
      if (navigator.clipboard) { navigator.clipboard.writeText(url).then(function () { b.textContent = 'Link kimásolva'; }); }
    });
  });
  each('[data-print]', function (b) { b.addEventListener('click', function () { window.print(); }); });
})();
