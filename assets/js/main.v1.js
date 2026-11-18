/* HORKI DETAILING: меню, аккордеон, сравнение до/после, зоны салона, подбор услуги, заявка */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  /* меню */
  var drawer = $('drawer'), burger = $('burger'), closeBtn = $('drawerClose'), lastFocus = null;
  function openD() {
    lastFocus = document.activeElement;
    drawer.setAttribute('data-open', 'true');
    document.body.classList.add('is-locked');
    burger.setAttribute('aria-expanded', 'true');
    var f = drawer.querySelector('a,button'); if (f) f.focus();
  }
  function closeD() {
    if (!drawer) return;
    drawer.setAttribute('data-open', 'false');
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', openD);
  if (closeBtn) closeBtn.addEventListener('click', closeD);
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeD(); });
    document.addEventListener('keydown', function (e) {
      if (drawer.getAttribute('data-open') !== 'true') return;
      if (e.key === 'Escape') { closeD(); return; }
      if (e.key === 'Tab') {
        var f = drawer.querySelectorAll('a,button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1099 && drawer.getAttribute('data-open') === 'true') closeD();
    });
  }

  /* аккордеон */
  document.querySelectorAll('.faq__q').forEach(function (b) {
    b.addEventListener('click', function () {
      var it = b.parentElement, open = it.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq__i').forEach(function (x) { x.setAttribute('data-open', 'false'); });
      it.setAttribute('data-open', open ? 'false' : 'true');
    });
  });

  /* сравнение до/после */
  var rng = $('cmpRange');
  if (rng) {
    var top = document.querySelector('.cmp__top'), div = document.querySelector('.cmp__div'), knob = document.querySelector('.cmp__knob');
    function set(v) {
      top.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
      div.style.left = v + '%';
      knob.style.left = v + '%';
    }
    rng.addEventListener('input', function () { set(+rng.value); });
    set(+rng.value);
  }

  /* зоны салона */
  var ZONE = {
    seats: { n: 'Сиденья и обивка', d: 'Ткань, кожа, алькантара. Здесь собирается больше всего пыли и пятен от еды и напитков.',
      w: ['Пенная чистка с мягкой щёткой', 'Обезжиривание и удаление пятен', 'Промывка и сушка', 'Защитная пропитка для ткани'] },
    ceiling: { n: 'Потолок', d: 'Самая деликатная зона: легко «перелить» воду и оставить разводы, поэтому работаем минимальной влагой.',
      w: ['Сухая пыль и продувка швов', 'Точечная чистка пятен', 'Мягкий состав без разводов', 'Просушка при контроле'] },
    carpet: { n: 'Ковролин и коврики', d: 'Песок и соль уходят в ворс, обычный пылесос достаёт не всё.',
      w: ['Глубокая продувка и пылесос', 'Экстракторная мойка', 'Пятна от реагентов и масла', 'Сушка и укладка'] },
    plastic: { n: 'Пластик и панель', d: 'Пыль в сотах и запылённая фактура делают салон уставшим даже после чистки.',
      w: ['Продувка щелей и кнопок', 'Мягкая чистка без разводов', 'Полировка пластика до ровного блеска', 'Матовая или сатиновая отделка на выбор'] },
    trunk: { n: 'Багажник', d: 'Здесь чаще всего остаются следы от инструмента, колясок и перевозки грузов.',
      w: ['Пылесос и продувка', 'Чистка обивки и пластика', 'Удаление запахов', 'Проверка дренажа'] },
    belts: { n: 'Ремни и мелочи', d: 'Ремни, подголовники, дефлекторы, ручки и бардачок — то, что замечают, когда садятся в машину.',
      w: ['Чистка ремней без потери прочности', 'Подголовники и ручки', 'Дефлекторы и кнопки', 'Финальная сборка'] }
  };
  var zOut = $('zoneOut'), zList = $('zones'), picked = [];
  if (zOut && zList) {
    function drawZone(key) {
      var z = ZONE[key];
      zOut.innerHTML = '<span class="mono">Зона салона</span><h3>' + z.n + '</h3><p>' + z.d + '</p>' +
        '<span class="mono">Что делаем</span><ul class="list">' + z.w.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<div class="zcount">Выбрано зон: <b>' + picked.length + '</b></div>' +
        '<a class="btn" href="https://wa.me/375295069999?text=' + encodeURIComponent('Здравствуйте! Интересует химчистка: ' + (picked.length ? picked.join(', ') : z.n) + '.') + '" target="_blank" rel="noopener">' + (picked.length ? 'Уточнить по выбранным зонам' : 'Спросить про эту зону') + '</a>';
    }
    zList.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var key = b.getAttribute('data-z');
        var on = b.getAttribute('aria-pressed') === 'true';
        b.setAttribute('aria-pressed', on ? 'false' : 'true');
        var name = ZONE[key].n;
        if (on) { picked = picked.filter(function (x) { return x !== name; }); }
        else if (picked.indexOf(name) < 0) { picked.push(name); }
        zList.querySelectorAll('button').forEach(function (x) {
          if (x.getAttribute('data-z') === key) return;
        });
        drawZone(key);
      });
    });
    drawZone('seats');
  }

  /* подбор услуги по задаче */
  var SOL = {
    smell: { n: 'Химчистка салона с устранением запаха', d: 'Запах редко уходит от «освежителя»: нужен источник — обивка, ковролин, дренаж или багажник.',
      s: ['Поиск источника запаха', 'Чистка обивки и ковролина', 'Обработка труднодоступных мест', 'Нейтрализация и проветривание'],
      who: 'Химчистка салона' },
    spots: { n: 'Локальная чистка пятен', d: 'Если салон в целом нормальный, а пятна от кофе, сока или масла видны — начинаем с точечной чистки.',
      s: ['Определение типа пятна', 'Подбор состава под материал', 'Чистка без разводов', 'Защита обработанного участка'],
      who: 'Химчистка салона' },
    fars: { n: 'Полировка фар', d: 'Мутные фары — это не только внешний вид, но и свет. Полируют их без снятия или со снятием.',
      s: ['Оценка состояния пластика', 'Шлифовка и полировка', 'Защитное покрытие', 'Проверка светового пучка'],
      who: 'Полировка фар' },
    plastic: { n: 'Полировка пластика салона', d: 'Выгоревший и запылённый пластик возвращает аккуратный вид без «жирного» блеска.',
      s: ['Очистка фактуры', 'Мягкая полировка', 'Выбор степени блеска', 'Антистатическая обработка'],
      who: 'Полировка пластика' },
    wrap: { n: 'Оклейка плёнкой', d: 'Защита кузова или смена вида: глянец, мат, хамелеон. Отдельные элементы или зоны.',
      s: ['Осмотр ЛКП и обсуждение плёнки', 'Подготовка поверхности', 'Оклейка с прогревом', 'Проверка кромок'],
      who: 'Оклейка плёнкой' },
    full: { n: 'Комплекс: салон и кузов', d: 'Когда хочется «как из салона»: салон, фары и пластик в одном заезде.',
      s: ['Химчистка салона', 'Полировка фар', 'Полировка пластика', 'Финальная уборка и проверка'],
      who: 'Комплекс работ' }
  };
  var pOut = $('pickOut'), pList = $('pick');
  if (pOut && pList) {
    function drawPick(key) {
      var s = SOL[key];
      pOut.innerHTML = '<span class="mono">Рекомендую</span><h3>' + s.n + '</h3><p>' + s.d + '</p>' +
        '<span class="mono">Что входит</span><ul class="list">' + s.s.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
        '<a class="btn" href="https://wa.me/375295069999?text=' + encodeURIComponent('Здравствуйте! Интересует: ' + s.who + '.') + '" target="_blank" rel="noopener">Обсудить в WhatsApp</a>';
      pList.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-p') === key ? 'true' : 'false');
      });
    }
    pList.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () { drawPick(b.getAttribute('data-p')); });
    });
    drawPick('smell');
  }

  /* форма */
  var form = $('reqForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (id) { var el = $(id); return el && el.value ? el.value.trim() : ''; };
      if (!g('fName')) { $('fName').focus(); return; }
      if (!g('fTel')) { $('fTel').focus(); return; }
      var text = 'Заявка с сайта HORKI DETAILING\nИмя: ' + g('fName') + '\nТелефон: ' + g('fTel') +
        '\nИнтересует: ' + g('fWhat') + (g('fMsg') ? '\nАвто и адрес: ' + g('fMsg') : '');
      window.open('https://wa.me/375295069999?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
