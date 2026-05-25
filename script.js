

// ТЕМА (светлая / тёмная)
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hrfTheme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = theme === 'light' ? '☾ Тёмная' : '☀ Светлая';
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}


function toggleMenu() {
    var nav = document.getElementById('mobileNav');
    if (nav) nav.classList.toggle('open');
}

document.addEventListener('click', function (e) {
    var nav = document.getElementById('mobileNav');
    var burger = document.querySelector('.burger');
    if (nav && nav.classList.contains('open')) {
        if (!nav.contains(e.target) && e.target !== burger) {
            nav.classList.remove('open');
        }
    }
});

//СЛАЙДЕР (index.html)
var currentSlide = 0;
var autoSlideTimer = null;

function initSlider() {
    var items = document.querySelectorAll('.slider .item');
    var dotsContainer = document.getElementById('sliderDots');
    if (!items.length || !dotsContainer) return;

    dotsContainer.innerHTML = '';
    items.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
        dot.addEventListener('click', function () { goToSlide(i); });
        dotsContainer.appendChild(dot);
    });

    showSlide(0);
    startAuto();

    var sliderEl = document.querySelector('.slider');
    if (sliderEl) {
        sliderEl.addEventListener('mouseenter', stopAuto);
        sliderEl.addEventListener('mouseleave', startAuto);
    }

    // Свайп
    var tx = 0;
    document.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].screenX; }, { passive: true });
    document.addEventListener('touchend', function (e) {
        var diff = tx - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
    }, { passive: true });
}

function showSlide(n) {
    var items = document.querySelectorAll('.slider .item');
    var dots  = document.querySelectorAll('.dot');
    if (!items.length) return;
    if (n >= items.length) currentSlide = 0;
    if (n < 0) currentSlide = items.length - 1;
    items.forEach(function (el) { el.classList.remove('active'); });
    dots.forEach(function (el) { el.classList.remove('active'); });
    items[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function changeSlide(dir) { currentSlide += dir; showSlide(currentSlide); }
function goToSlide(i)     { currentSlide = i;   showSlide(currentSlide); }
function startAuto()      { stopAuto(); autoSlideTimer = setInterval(function () { changeSlide(1); }, 5000); }
function stopAuto()       { clearInterval(autoSlideTimer); }

// КАТАЛОГ (catalog.html)

// Данные
var PERSONS = [
    // Правители
    { id:1,  name:'Рюрик',                  era:'rulers',  years:'ок. 830 — 879',  short:'Легендарный основатель династии Рюриковичей, призванный новгородцами и положивший начало Русскому государству.',                                                                       photo:'rurik.png' },
    { id:2,  name:'Владимир Великий',        era:'rulers',  years:'ок. 958 — 1015', short:'Великий князь Киевской Руси, крестивший страну в 988 году. Провёл военные и административные реформы, объединил восточнославянские племена.',                                          photo:'vladimir.png' },
    { id:3,  name:'Ярослав Мудрый',          era:'rulers',  years:'978 — 1054',     short:'Великий князь, при котором Киевская Русь достигла расцвета. Составил первый письменный свод законов — «Русскую правду».',                                                               photo:'zroslav.png' },
    { id:4,  name:'Александр Невский',       era:'rulers',  years:'1221 — 1263',    short:'Полководец, разгромивший шведов на Неве и Тевтонский орден на Чудском озере. Умелой дипломатией защитил Русь от монгольского разорения.',                                              photo:'nevskiy.png' },
    { id:5,  name:'Иван III Великий',        era:'rulers',  years:'1440 — 1505',    short:'Государь, объединивший русские земли вокруг Москвы и завершивший зависимость от Орды. Принял титул «Государь всея Руси».',                                                             photo:'ivan 3.png' },
    { id:6,  name:'Иван IV Грозный',         era:'rulers',  years:'1530 — 1584',    short:'Первый русский царь. Провёл реформы управления, расширил территорию страны на восток, но вошёл в историю и жестокими опричными репрессиями.',                                          photo:'ivan 4.png' },
    { id:7,  name:'Пётр I Великий',          era:'rulers',  years:'1672 — 1725',    short:'Первый российский император. Провёл масштабные реформы, основал Санкт-Петербург, создал регулярную армию и флот, открыв России «окно в Европу».',                                     photo:'petr1.png' },
    { id:8,  name:'Екатерина II Великая',    era:'rulers',  years:'1729 — 1796',    short:'Императрица, при которой Россия расширила границы на юг и запад. Покровительствовала просвещению и искусству. Её эпоха — «золотой век» дворянства.',                                  photo:'katy2.png' },
    { id:9,  name:'Александр I',             era:'rulers',  years:'1777 — 1825',    short:'Победитель Наполеона. При нём Россия вошла в число ведущих мировых держав, а Отечественная война 1812 года стала символом народного единства.',                                        photo:'alek1.png' },
    { id:10, name:'Александр II Освободитель',era:'rulers', years:'1818 — 1881',    short:'Отменил крепостное право в 1861 году. Провёл судебную, военную и земскую реформы, дав толчок развитию гражданского общества.',                                                        photo:'alek2.png' },
    { id:11, name:'Николай II',              era:'rulers',  years:'1868 — 1918',    short:'Последний российский император. При нём страна переживала бурный экономический рост, но революции 1905 и 1917 годов привели к крушению монархии.',                                     photo:'nikolay2.png' },

    // Полководцы
    { id:12, name:'Дмитрий Донской',         era:'military',years:'1350 — 1389',    short:'Великий князь московский, разгромивший монгольское войско в Куликовской битве 1380 года — переломном событии в истории освобождения Руси.',                                            photo:'donskoy.png' },
    { id:13, name:'Александр Суворов',       era:'military',years:'1730 — 1800',    short:'Великий полководец, не проигравший ни одного сражения. Разработал новаторскую «науку побеждать», прошёл Альпы с войском и освободил Италию.',                                         photo:'suvorov.png' },
    { id:14, name:'Михаил Кутузов',          era:'military',years:'1745 — 1813',    short:'Фельдмаршал, главнокомандующий в Отечественной войне 1812 года. Его стратегия изматывания армии Наполеона привела к полному разгрому захватчиков.',                                   photo:'kutuzov.png' },
    { id:15, name:'Фёдор Ушаков',            era:'military',years:'1745 — 1817',    short:'Выдающийся флотоводец, не потерявший ни одного корабля и ни одного матроса в плен. Был причислен к лику святых Русской православной церкви.',                                         photo:'ushakov.png' },
    { id:16, name:'Георгий Жуков',           era:'military',years:'1896 — 1974',    short:'Маршал Советского Союза, четырежды Герой СССР. Один из ключевых полководцев Великой Отечественной войны. Принял капитуляцию Германии в мае 1945 года.',                               photo:'zhukov.png' },
    { id:17, name:'Константин Рокоссовский', era:'military',years:'1896 — 1968',    short:'Маршал, командовавший войсками в битвах за Москву, Сталинград и Берлин. Единственный советский военачальник, ставший маршалом двух стран.',                                           photo:'rokosovsky.png' },

    // Учёные
    { id:18, name:'Михаил Ломоносов',        era:'science', years:'1711 — 1765',    short:'Первый великий русский учёный. Открытия в физике, химии и астрономии. Основал Московский университет и заложил основы русского литературного языка.',                                 photo:'lomonosov.png' },
    { id:19, name:'Дмитрий Менделеев',       era:'science', years:'1834 — 1907',    short:'Создал периодическую таблицу химических элементов — одно из величайших открытий в истории науки, лежащее в основе всей современной химии.',                                           photo:'mendeleev.png' },
    { id:20, name:'Николай Лобачевский',     era:'science', years:'1792 — 1856',    short:'Математик, создавший неевклидову геометрию — революционное открытие, изменившее представление человечества о пространстве и природе мира.',                                           photo:'lobachevskiy.png' },
    { id:21, name:'Иван Павлов',             era:'science', years:'1849 — 1936',    short:'Физиолог, первый русский лауреат Нобелевской премии (1904). Открыл условные рефлексы, заложив основы науки о поведении человека и животных.',                                         photo:'pavlov.png' },
    { id:22, name:'Сергей Королёв',          era:'science', years:'1907 — 1966',    short:'Главный конструктор советской ракетно-космической программы. Под его руководством запущен первый спутник и осуществлён первый полёт человека в космос.',                              photo:'korolev.png' },
    { id:23, name:'Андрей Сахаров',          era:'science', years:'1921 — 1989',    short:'Физик-ядерщик, один из создателей советской водородной бомбы. Впоследствии стал правозащитником, лауреатом Нобелевской премии мира.',                                                photo:'saharov.png' },
    { id:24, name:'Лев Ландау',              era:'science', years:'1908 — 1968',    short:'Выдающийся физик-теоретик, лауреат Нобелевской премии 1962 года. Создал множество фундаментальных теорий в физике твёрдого тела, атомного ядра и квантовой механике.',               photo:'landau.png' },

    // Писатели и поэты
    { id:25, name:'Александр Пушкин',        era:'culture', years:'1799 — 1837',    short:'Основоположник современного русского литературного языка. «Евгений Онегин», «Капитанская дочка», сказки — вечная классика мировой литературы.',                                       photo:'pushkin.png' },
    { id:26, name:'Лев Толстой',             era:'culture', years:'1828 — 1910',    short:'Автор «Войны и мира» и «Анны Карениной» — эпических романов, переведённых на сотни языков. Один из величайших писателей в истории человечества.',                                     photo:'tolstoy.png' },
    { id:27, name:'Фёдор Достоевский',       era:'culture', years:'1821 — 1881',    short:'Великий романист, исследовавший глубины человеческой психологии. «Преступление и наказание», «Братья Карамазовы» — мировая классика.',                                                photo:'dostoevskiy.png' },
    { id:28, name:'Антон Чехов',             era:'culture', years:'1860 — 1904',    short:'Мастер короткого рассказа и драматург. Его пьесы «Чайка», «Три сестры», «Вишнёвый сад» до сих пор идут на лучших театральных сценах мира.',                                           photo:'chehov.png' },
    { id:29, name:'Николай Гоголь',          era:'culture', years:'1809 — 1852',    short:'Писатель, создавший «Мёртвые души», «Ревизора» и «Тараса Бульбу». Его сатира на российскую действительность не теряет актуальности.',                                               photo:'gogol.png' },
    { id:30, name:'Михаил Булгаков',         era:'culture', years:'1891 — 1940',    short:'Автор романа «Мастер и Маргарита» — одного из самых читаемых произведений XX века. Драматург и прозаик, чьё творчество было долгие годы под запретом.',                              photo:'bulgakov.png' },

    // Первопроходцы и путешественники
    { id:31, name:'Ермак Тимофеевич',        era:'explore', years:'ок. 1532 — 1585',short:'Казачий атаман, начавший завоевание Сибири. Его поход открыл России путь к огромным территориям за Уралом.',                                                                           photo:'ermak.png' },
    { id:32, name:'Семён Дежнёв',            era:'explore', years:'ок. 1605 — 1673',short:'Первый мореплаватель, прошедший проливом между Азией и Америкой, задолго до Беринга. Открыл крайнюю восточную точку Азиатского материка.',                                             photo:'degnev.png' },
    { id:33, name:'Витус Беринг',            era:'explore', years:'1681 — 1741',    short:'Датский мореплаватель на русской службе. Возглавил Камчатские экспедиции, исследовал северо-восток Азии и достиг берегов Северной Америки.',                                          photo:'bereng.png' },
    { id:34, name:'Юрий Гагарин',            era:'explore', years:'1934 — 1968',    short:'Первый человек в космосе. 12 апреля 1961 года совершил орбитальный полёт вокруг Земли, открыв эпоху пилотируемой космонавтики.',                                                      photo:'gagarin.png' },
    { id:35, name:'Алексей Леонов',          era:'explore', years:'1934 — 2019',    short:'Первый человек, вышедший в открытый космос 18 марта 1965 года. Его выход длился 12 минут и стал одним из величайших достижений советской космонавтики.',                              photo:'leonov.png' },

    // Религиозные и духовные деятели
    { id:36, name:'Сергий Радонежский',      era:'religion',years:'ок. 1314 — 1392',short:'Святой, основавший Троице-Сергиеву лавру. Благословил Дмитрия Донского перед Куликовской битвой. Духовный символ объединения Руси.',                                                  photo:'radonezgskiy.png' },
    { id:37, name:'Патриарх Никон',          era:'religion',years:'1605 — 1681',    short:'Патриарх, проведший церковную реформу XVII века. Его реформы вызвали раскол в православной церкви, последствия которого ощущались веками.',                                           photo:'nikon.png' },

    // Революционеры и политики
    { id:38, name:'Владимир Ленин',          era:'politics',years:'1870 — 1924',    short:'Революционный деятель, основавший советское государство. Возглавил революцию 1917 года и создал СССР — государство, существовавшее почти 70 лет.',                                   photo:'lenin.png' },
    { id:39, name:'Иосиф Сталин',            era:'politics',years:'1878 — 1953',    short:'Руководитель СССР с конца 1920-х до 1953 года. Провёл индустриализацию страны, руководил победой во Второй мировой войне, но его режим унёс миллионы жизней.',                      photo:'stalin.png' },

    // Деятели культуры и искусства
    { id:40, name:'Пётр Чайковский',         era:'culture', years:'1840 — 1893',    short:'Величайший русский композитор. «Лебединое озеро», «Щелкунчик», «Спящая красавица» — его балеты по сей день идут на лучших сценах мира.',                                             photo:'chaikovskiy.png' },
    { id:41, name:'Илья Репин',              era:'culture', years:'1844 — 1930',    short:'Крупнейший русский живописец-реалист. «Бурлаки на Волге», «Иван Грозный и его сын Иван» — полотна, ставшие символами русского изобразительного искусства.',                          photo:'repin.png' },
    { id:42, name:'Константин Станиславский',era:'culture', years:'1863 — 1938',    short:'Режиссёр и реформатор театра, создавший «Систему Станиславского» — метод актёрской игры, который используется во всём мире по сей день.',                                             photo:'stanislavskiy.png' },
    { id:43, name:'Сергей Дягилев',          era:'culture', years:'1872 — 1929',    short:'Антрепренёр, основавший «Русские сезоны» в Париже. Познакомил Европу с русским балетом, музыкой и живописью, произведя культурную революцию.',                                       photo:'digelev.png' },
    { id:44, name:'Владимир Высоцкий',       era:'culture', years:'1938 — 1980',    short:'Актёр и поэт-бард, чьи песни стали голосом целого поколения. Его творчество обходило советскую цензуру и говорило о главном — честно и в полный голос.',                             photo:'visockiy.png' },
];

var ERA_LABELS = {
    rulers:   'Правители',
    military: 'Полководцы',
    science:  'Учёные',
    culture:  'Культура и искусство',
    explore:  'Первопроходцы',
    religion: 'Духовные деятели',
    politics: 'Политики',
};

var currentEra = 'all';
var searchQuery = '';

function initCatalog() {
    if (!document.getElementById('catalogGrid')) return;
    renderEraFilters();
    renderCards();

    var inp = document.getElementById('searchInput');
    if (inp) inp.addEventListener('input', function () {
        searchQuery = this.value.toLowerCase().trim();
        renderCards();
    });
}

function renderEraFilters() {
    var wrap = document.getElementById('eraFilters');
    if (!wrap) return;
    var eras = ['all'].concat(Object.keys(ERA_LABELS));
    wrap.innerHTML = eras.map(function (era) {
        var label = era === 'all' ? 'Все' : ERA_LABELS[era];
        return '<button class="era-btn' + (era === currentEra ? ' active' : '') + '" onclick="filterEra(\'' + era + '\')">' + label + '</button>';
    }).join('');
}

function filterEra(era) {
    currentEra = era;
    renderEraFilters();
    renderCards();
}

function renderCards() {
    var grid = document.getElementById('catalogGrid');
    if (!grid) return;

    var filtered = PERSONS.filter(function (p) {
        var matchEra  = currentEra === 'all' || p.era === currentEra;
        var matchName = p.name.toLowerCase().includes(searchQuery);
        return matchEra && matchName;
    });

    if (!filtered.length) {
        grid.innerHTML = '<p class="no-results">Никого не нашли 😔 Попробуй другой запрос.</p>';
        return;
    }

    grid.innerHTML = filtered.map(function (p) {
        var bg = p.photo
            ? 'background-image:url(\'' + p.photo + '\')'
            : 'background-color:var(--card-bg-empty)';
        return '<div class="person-card" onclick="openModal(' + p.id + ')">' +
            '<div class="card-photo" style="' + bg + '">' +
                (!p.photo ? '<span class="card-initials">' + p.name.charAt(0) + '</span>' : '') +
            '</div>' +
            '<div class="card-body">' +
                '<span class="card-era">' + ERA_LABELS[p.era] + '</span>' +
                '<h3 class="card-name">' + p.name + '</h3>' +
                '<span class="card-years">' + p.years + '</span>' +
                '<p class="card-short">' + p.short + '</p>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ===== МОДАЛЬНОЕ ОКНО =====
function openModal(id) {
    var p = PERSONS.find(function (x) { return x.id === id; });
    if (!p) return;
    var modal = document.getElementById('personModal');
    var bg = p.photo
        ? 'background-image:url(\'' + p.photo + '\')'
        : 'background-color:var(--card-bg-empty)';

    document.getElementById('modalPhoto').setAttribute('style', bg);
    document.getElementById('modalInitial').textContent = p.photo ? '' : p.name.charAt(0);
    document.getElementById('modalEra').textContent   = ERA_LABELS[p.era];
    document.getElementById('modalName').textContent  = p.name;
    document.getElementById('modalYears').textContent = p.years;
    document.getElementById('modalDesc').textContent  = p.short;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    var modal = document.getElementById('personModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', function () {
    // Применяем сохранённую тему
    var saved = localStorage.getItem('hrfTheme') || 'dark';
    applyTheme(saved);

    // Запускаем нужные модули
    initSlider();
    initCatalog();

    // Плавное появление секций
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function (el) { observer.observe(el); });

    // Закрытие модалки по фону
    var modal = document.getElementById('personModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }
});
