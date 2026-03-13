
const CORRECT_PASSWORD = "Just Yuri"; 

const levels = [
    { hint: "Ты мне напоминаешь...", phrase: ["утренний", "кофе,", "который", "бодрит"], pool: ["утренний", "кофе,", "который", "бодрит", "чай", "сон", "вкусный", "аромат", "завтрак"] },
    { hint: "Когда ты рядом, кажется...", phrase: ["будто", "весь", "мир", "замер"], pool: ["будто", "весь", "мир", "замер", "громко", "бежит", "холодно", "время", "планета"] },
    { hint: "Для меня ты всегда...", phrase: ["самое", "яркое", "солнце"], pool: ["самое", "яркое", "солнце", "звезда", "луна", "тучка", "небо", "пламя"] },
    { hint: "Твоя улыбка...", phrase: ["согревает", "даже", "в", "сильный", "мороз"], pool: ["согревает", "даже", "в", "сильный", "мороз", "светит", "греет", "холод", "вечер", "взгляд"] },
    { hint: "Я готов...", phrase: ["слушать", "твой", "голос", "вечно"], pool: ["слушать", "твой", "голос", "вечно", "петь", "смотреть", "всегда", "долго", "бесконечно"] },
    { hint: "Ты — мой...", phrase: ["самый", "любимый", "человек"], pool: ["самый", "любимый", "человек", "лучший", "друг", "мир", "сон", "космос"] },
    { hint: "В твоих глазах...", phrase: ["можно", "увидеть", "целую", "вселенную"], pool: ["можно", "увидеть", "целую", "вселенную", "утонуть", "найти", "глубину", "искры"] },
    { hint: "Каждый день с тобой...", phrase: ["это", "маленький", "праздник"], pool: ["это", "маленький", "праздник", "чудо", "просто", "сон", "радость", "счастье"] },
    { hint: "Никто и никогда...", phrase: ["не", "заменит", "мне", "тебя"], pool: ["не", "заменит", "мне", "тебя", "сможет", "забыть", "отнимет", "сломает"] },
    { hint: "Ты делаешь этот мир...", phrase: ["намного", "лучше", "и", "добрее"], pool: ["намного", "лучше", "и", "добрее", "красивее", "светлее", "ярче", "чудеснее"] },
    { hint: "И помни одно...", phrase: ["Just", "Yuri."], pool: ["Just", "Yuri.", "Only", "Everything", "One", "Always", "Forever", "Love"] }
];

// Данные для игры в блокноте
const poemWords = {
    good: ["любовь", "радость", "навсегда", "улыбка", "тепло", "счастье", "нежность", "свет", "мечта", "солнце"],
    meta: ["меланхолия", "вечность", "сущность", "призма", "тишина", "отражение", "пустота", "симфония", "туман", "истина"],
    bad: ["страх", "холод", "тень", "крик", "конец", "боль", "забытье", "осколки", "мрак", "одиночество"]
};

const poems = {
    // Вариант 1: Милый и добрый (Good)
    good: "Твоя душа — как дивный светлый сад,\nГде каждый вдох и каждый нежный взгляд\nДарует сердцу мир и теплоту,\nРождая в мире только красоту.\n\nПусть каждый день приносит лишь успех,\nИ льется звонко твой прекрасный смех.\nТы — мой причал, мой лучик золотой,\nЯ счастлив просто быть всегда с тобой.",

    // Вариант 2: Метафоричный и глубокий (Meta)
    meta: "В сплетении смыслов, истин и зеркал\nЯ образ твой сквозь вечность отыскал.\nТы — тихий шепот звездных берегов,\nИзящный ритм, свободный от оков.\n\nКак отраженье высших сфер земных,\nТы создана из мыслей чистоты.\nВ тебе одной слились мои мечты,\nСтирая грань реальности и сна.",

    // Вариант 3: Поддержка при выборе «плохих» слов (Bad)
    bad: "Пусть тени страха вьются за спиной,\nЗапомни: я всегда стою с тобой.\nСквозь холод стен и тихий крик тревог\nЯ проложу к тебе сто тысяч дорог.\n\nТы — лучше всех, и в самый трудный час\nМоя любовь согреет нежно нас.\nЯ разделю твой мрак и твою боль,\nВедь навсегда я связан лишь тобой."
};
let currentLevel = 0;
let currentInput = [];
let isTransitioning = false;
let sfxVolume = 0.5;


let scores = { good: 0, meta: 0, bad: 0 };
let totalWordsPicked = 0;
const MAX_WORDS = 20;



function checkPassword() {
    const loginInput = document.getElementById('login-input');
    const passInput = document.getElementById('pass-input');
    const loader = document.getElementById('win-loader');
    const btn = document.querySelector('.password-container button');

    const isNameCorrect = loginInput.value === "yuri"; // Строго маленькими буквами
    const isPassCorrect = passInput.value.trim().toLowerCase() === CORRECT_PASSWORD.toLowerCase();

    if (isNameCorrect && isPassCorrect) {
        btn.style.display = 'none';
        loginInput.disabled = true;
        passInput.disabled = true;
        loader.classList.remove('loader-hidden');

        setTimeout(() => {
            document.getElementById('password-screen').classList.remove('active');
            const ws = document.getElementById('welcome-screen');
            ws.classList.add('active');
            setTimeout(() => {
                document.getElementById('welcome-text').classList.add('fade-in');
                setTimeout(() => {
                    ws.classList.add('fade-out');
                    setTimeout(() => {
                        ws.classList.remove('active');
                        document.getElementById('garden-screen').classList.add('active');
                        loadLevel();
                        document.getElementById('bg-music').play().catch(()=>{});
                    }, 1500);
                }, 3000);
            }, 500);
        }, 6000);
    } else {
        if (!isNameCorrect && isPassCorrect) {
            showToast("Неверное имя пользователя (нужны маленькие буквы)");
        } else {
            showToast("Доступ запрещен");
        }
        passInput.value = "";
    }
}


const flowerTemplates = [
    { type: 'daisy', color: '#FFFFFF', center: '#FFD700', svg: `<svg viewBox="0 0 100 100"><circle class="petal" cx="50" cy="20" r="15"/><circle class="petal" cx="80" cy="50" r="15"/><circle class="petal" cx="50" cy="80" r="15"/><circle class="petal" cx="20" cy="50" r="15"/><circle class="petal" cx="28" cy="28" r="15"/><circle class="petal" cx="72" cy="28" r="15"/><circle class="petal" cx="72" cy="72" r="15"/><circle class="petal" cx="28" cy="72" r="15"/><circle class="center" cx="50" cy="50" r="18"/></svg>` },
    { type: 'rose', color: '#E53935', center: '#B71C1C', svg: `<svg viewBox="0 0 100 100"><circle class="petal" cx="50" cy="50" r="42" fill-opacity="0.8"/><path class="petal" d="M50,15 C70,15 90,35 90,55 C90,75 70,95 50,95 C30,95 10,75 10,55 C10,35 30,15 50,15"/><circle class="center" cx="50" cy="55" r="8"/></svg>` },
    { type: 'tulip', color: '#FFB300', center: '#F4511E', svg: `<svg viewBox="0 0 100 100"><path class="petal" d="M30,80 Q50,105 70,80 L90,20 Q50,0 10,20 Z" /><path class="petal" d="M40,85 Q50,105 60,85 L70,35 Q50,15 30,35 Z" fill-opacity="0.7"/><circle class="center" cx="50" cy="75" r="5"/></svg>` },
    { type: 'lily', color: '#F8BBD0', center: '#F06292', svg: `<svg viewBox="0 0 100 100"><path class="petal" d="M50,50 L50,5 Q75,25 50,50 Q25,25 50,5 Z"/><path class="petal" d="M50,50 L95,50 Q75,75 50,50 Q75,25 95,50 Z"/><path class="petal" d="M50,50 L50,95 Q75,75 50,50 Q25,75 50,95 Z"/><path class="petal" d="M50,50 L10,50 Q30,75 50,50 Q30,25 10,50 Z"/><circle class="center" cx="50" cy="50" r="10"/></svg>` }
];

function plantFlower(e) {
    
    if (isTransitioning || e.target.closest('.ui-control')) return;

    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);

    
    const existingFlowers = document.querySelectorAll('.flower');
    const minDistance = 70; 
    
    for (let f of existingFlowers) {
        const rect = f.getBoundingClientRect();
        const fx = rect.left + rect.width / 2;
        const fy = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(x - fx, 2) + Math.pow(y - fy, 2));
        
        if (dist < minDistance) {
            return; 
        }
    }

    const level = levels[currentLevel];
    const word = level.pool[Math.floor(Math.random() * level.pool.length)];
    const template = flowerTemplates[Math.floor(Math.random() * flowerTemplates.length)];

    const flower = document.createElement('div');
    flower.className = `flower sway-${Math.floor(Math.random() * 3) + 1}`;
    flower.style.left = x + 'px';
    flower.style.top = y + 'px';
    flower.innerHTML = `${template.svg}<div class="word-label">${word}</div>`;
    
    flower.querySelectorAll('.petal').forEach(p => p.style.fill = template.color);
    flower.querySelector('.center').style.fill = template.center;

    document.getElementById('garden-screen').appendChild(flower);

    
    flower.onpointerdown = (event) => {
        event.stopPropagation();
        const targetWord = level.phrase[currentInput.length];
        
        if (word === targetWord) {
            currentInput.push(word);
            document.getElementById('phrase-display').innerText = currentInput.join(" ");
            flower.style.pointerEvents = 'none';
            flower.querySelector('.center').style.fill = '#BB5588';
            if (currentInput.length === level.phrase.length) nextLevel();
        } else {
            handleError();
        }
    };
}

function handleError() {
    isTransitioning = true;
    showToast("Не то слово... Поле очищено");
    document.querySelectorAll('.flower').forEach(f => {
        f.style.opacity = '0';
        f.style.transition = '0.4s';
        setTimeout(() => f.remove(), 400);
    });
    setTimeout(() => {
        currentInput = [];
        document.getElementById('phrase-display').innerText = "";
        isTransitioning = false;
    }, 500);
}

function showToast(text) {
    const t = document.getElementById('toast');
    t.innerText = text; t.style.opacity = 1;
    setTimeout(() => t.style.opacity = 0, 2000);
}

function skipLevel() {
    if (!isTransitioning) nextLevel();
}

function nextLevel() {
    isTransitioning = true;
    setTimeout(() => {
        document.querySelectorAll('.flower').forEach(f => f.remove());
        document.getElementById('phrase-display').innerText = "";
        currentLevel++;
        currentInput = [];
        if (currentLevel < levels.length) {
            document.getElementById('hint').innerText = levels[currentLevel].hint;
            isTransitioning = false;
        } else {
            startPoemGame();
        }
    }, 800);
}

// --- ТРЕТЬЯ ИГРА (БЛОКНОТ) ---
function startPoemGame() {
    document.getElementById('garden-screen').classList.remove('active');
    document.getElementById('poem-game-screen').classList.add('active');
    isTransitioning = false;
    renderNewWords();
}

function renderNewWords() {
    const rightPage = document.getElementById('right-page');
    rightPage.innerHTML = '';
    
    // Пул слов (4 хороших, 3 метафоричных, 3 плохих)
    const pool = [
        ...shuffle(poemWords.good).slice(0, 4),
        ...shuffle(poemWords.meta).slice(0, 3),
        ...shuffle(poemWords.bad).slice(0, 3)
    ];
    
    shuffle(pool).forEach(word => {
        const div = document.createElement('div');
        div.className = 'poem-word';
        div.innerText = word;
        div.onclick = (e) => {
            e.stopPropagation();
            pickWord(word, div);
        };
        rightPage.appendChild(div);
    });
}

function pickWord(word, element) {
    if (isTransitioning) return;

    playPenSfx();

    // Считаем баллы
    if (poemWords.good.includes(word)) scores.good++;
    else if (poemWords.meta.includes(word)) scores.meta++;
    else if (poemWords.bad.includes(word)) scores.bad++;

    // Добавляем на левую страницу
    const leftPage = document.getElementById('left-page');
    const written = document.createElement('div');
    written.className = 'written-word';
    // Добавляем запятую, если слово не последнее в строке (по 4 слова)
    const needsComma = (totalWordsPicked + 1) % 4 !== 0;
    written.innerText = word + (needsComma ? "," : "");
    leftPage.appendChild(written);

    totalWordsPicked++;
    element.style.visibility = 'hidden';

    if (totalWordsPicked >= MAX_WORDS) {
        isTransitioning = true;
        setTimeout(finishPoem, 1000);
    } else {
        renderNewWords();
    }
}

function finishPoem() {
    const overlay = document.getElementById('poem-overlay');
    const textCont = document.getElementById('poem-text');
    
    
    const maxScore = Math.max(scores.good, scores.meta, scores.bad);
    let counts = 0;
    if (scores.good === maxScore) counts++;
    if (scores.meta === maxScore) counts++;
    if (scores.bad === maxScore) counts++;

    if (counts > 1) {
        
        showFinal();
        return;
    }

    
    let winner = 'good';
    if (scores.meta > scores.good && scores.meta > scores.bad) winner = 'meta';
    if (scores.bad > scores.good && scores.bad > scores.meta) winner = 'bad';

    textCont.innerText = poems[winner];
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.opacity = '1', 100);

    
    overlay.onclick = closePoemAndFinish;
}

function closePoemAndFinish() {
    const overlay = document.getElementById('poem-overlay');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        showFinal();
    }, 1000);
}


function showFinal() {
    const overlay = document.getElementById('final-overlay');
    overlay.style.display = 'flex';
    setTimeout(() => { 
        overlay.style.opacity = '1'; 
        overlay.querySelector('.monika-box').classList.add('show'); 
    }, 500);
}

function closeEverything() {
    const blackout = document.createElement('div');
    blackout.className = 'screen-off';
    document.body.appendChild(blackout);
    setTimeout(() => {
        document.body.innerHTML = `<div style="background:black;color:#BB5588;height:100vh;display:flex;align-items:center;justify-content:center;font-family:monospace;text-align:center;"><h1>Just Yuri.</h1></div>`;
    }, 1200);
}


function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Плеер
const audio = document.getElementById('bg-music');
function togglePlay() { 
    const btn = document.getElementById('play-pause-btn');
    if (audio.paused) { audio.play(); btn.innerText = "⏸"; } 
    else { audio.pause(); btn.innerText = "▶"; }
}
function rewind(s) { audio.currentTime += s; }

function changeVolume(id, val) {
    const audio = document.getElementById(id);
    if (audio) audio.volume = val;
}

// Регулировка эффектов
function changeSfxVolume(val) {
    sfxVolume = val;
}

// Функция проигрывания звука ручки
function playPenSfx() {
    const sfx = document.getElementById('sfx-pen');
    if (sfx) {
        sfx.volume = sfxVolume; // Применяем громкость из ползунка
        sfx.currentTime = 0;
        sfx.play().catch(() => {});
    }
}

function universalSkip() {
    if (isTransitioning) return;

    // Проверяем, какой экран сейчас активен
    const gardenActive = document.getElementById('garden-screen').classList.contains('active');
    const poemActive = document.getElementById('poem-game-screen').classList.contains('active');

    if (gardenActive) {
        // Логика пропуска для сада
        isTransitioning = true;
        setTimeout(() => {
            document.querySelectorAll('.flower').forEach(f => f.remove());
            document.getElementById('phrase-display').innerText = "";
            currentLevel++;
            currentInput = [];
            if (currentLevel < levels.length) {
                document.getElementById('hint').innerText = levels[currentLevel].hint;
                isTransitioning = false;
            } else {
                startPoemGame();
            }
        }, 300);
    } else if (poemActive) {
        // Логика пропуска для блокнота (сразу к финалу)
        finishPoem();
    }
}