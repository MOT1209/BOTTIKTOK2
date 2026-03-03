const defaultState = {
    isAuthenticated: false,
    coins: 2500,
    user: null,
    linkedAccounts: [],
    inventory: { followers: 0, likes: 0, views: 0 },
    stats: { followers: 1240, likes: '15.4K', views: '1.2M' }
};

let state = { ...defaultState };

function loadState() {
    const saved = localStorage.getItem('tikboost_v2_state');
    if (saved) state = JSON.parse(saved);
}

function saveState() {
    localStorage.setItem('tikboost_v2_state', JSON.stringify(state));
}

// --- Navigation ---
function router(page) {
    console.log("Navigating to:", page);
    const content = document.getElementById('view-content');

    // Update Nav UI
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('nav-active'));
    const activeBtn = document.getElementById('btn-' + page);
    if (activeBtn) activeBtn.classList.add('nav-active');

    if (!state.isAuthenticated && page !== 'login') {
        renderLogin(content);
        return;
    }

    switch (page) {
        case 'home': renderHome(content); break;
        case 'earn': renderEarn(content); break;
        case 'shop': renderShop(content); break;
        case 'profile': renderProfile(content); break;
        case 'login': renderLogin(content); break;
        default: renderHome(content);
    }
}

// --- Views ---

function renderLogin(container) {
    container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center px-10 space-y-12 animate-slide">
            <div class="relative">
                <div class="w-32 h-32 bg-white flex items-center justify-center rounded-[40px] shadow-[0_0_50px_rgba(255,255,255,0.2)] rotate-6">
                    <i class="fa-brands fa-tiktok text-6xl text-black"></i>
                </div>
                <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-accent-cyan rounded-full flex items-center justify-center border-4 border-black">
                    <i class="fa-solid fa-bolt-lightning text-black text-sm"></i>
                </div>
            </div>

            <div class="text-center space-y-2">
                <h1 class="text-5xl font-black tracking-tighter">TikBoost</h1>
                <p class="text-white/40 text-sm font-medium">الجيل القادم من خوارزميات النمو</p>
            </div>

            <div class="w-full space-y-4">
                <button onclick="loginDemo()" class="w-full py-5 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition">
                    <i class="fa-brands fa-google"></i>
                    الدخول السريع (جوجل)
                </button>
                <button class="w-full py-5 rounded-2xl bg-white/5 border border-white/10 font-bold text-sm text-white/60">
                    أو إنشاء حساب بالبريد
                </button>
            </div>
        </div>
    `;
}

function renderHome(container) {
    container.innerHTML = `
        <div class="h-full relative overflow-hidden flex flex-col">
            <!-- Feed Headers -->
            <div class="absolute top-8 w-full flex justify-center gap-6 z-20 font-black text-sm opacity-60">
                <span class="text-white/40">متابعة</span>
                <span class="text-white border-b-2 border-white pb-1">لك</span>
            </div>

            <div class="flex-1 bg-gradient-to-b from-gray-900 to-black relative">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center animate-pulse">
                        <i class="fa-solid fa-play text-white/20 text-4xl"></i>
                    </div>
                </div>

                <!-- RHS Icons -->
                <div class="absolute right-4 bottom-24 flex flex-col gap-6 items-center">
                    <div class="flex flex-col items-center">
                        <div class="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg">
                            <img src="https://ui-avatars.com/api/?name=AI&background=random" class="w-full h-full object-cover">
                        </div>
                        <div class="w-4 h-4 bg-accent-pink rounded-full flex items-center justify-center -mt-2 border-2 border-black z-10">
                            <i class="fa-solid fa-plus text-[6px] text-white"></i>
                        </div>
                    </div>
                    <div class="flex flex-col items-center">
                        <i class="fa-solid fa-heart text-3xl text-white/90"></i>
                        <span class="text-[10px] font-bold mt-1">1.2M</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <i class="fa-solid fa-comment-dots text-3xl text-white/90"></i>
                        <span class="text-[10px] font-bold mt-1">540K</span>
                    </div>
                </div>

                <!-- Info -->
                <div class="absolute left-6 bottom-24 max-w-[70%] space-y-2">
                    <h3 class="font-black text-lg">@tikboost_pro</h3>
                    <p class="text-sm text-white/80 line-clamp-2">شاهد كيف يعمل الذكاء الاصطناعي في جلب المتابعين بسرعة خيالية! ✨ #ترند #TikTok</p>
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-music text-[10px] text-white/40"></i>
                        <marquee class="text-[10px] text-white/40 font-bold">TikBoost Original Audio - AI Engine V2.0</marquee>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderEarn(container) {
    container.innerHTML = `
        <div class="h-full p-8 pt-12 space-y-8 no-scrollbar overflow-y-auto pb-24 animate-slide">
            <div class="flex justify-between items-center">
                <h1 class="text-4xl font-black">مهام الربح</h1>
                <div class="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-2xl border border-yellow-400/20">
                    <i class="fa-solid fa-coins text-yellow-400"></i>
                    <span class="font-black">${state.coins}</span>
                </div>
            </div>

            <div class="p-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-[30px] flex justify-between items-center shadow-2xl shadow-yellow-500/10 relative overflow-hidden">
                <div class="space-y-1 relative z-10">
                    <h3 class="text-black font-black text-xl">المكافأة اليومية</h3>
                    <p class="text-black/60 text-xs font-bold">استلم 100 عملة الآن</p>
                    <button onclick="toast('تم استلام المكافأة!', true)" class="mt-4 px-6 py-2 bg-black text-white rounded-xl text-xs font-black">استلام</button>
                </div>
                <i class="fa-solid fa-gift text-7xl text-white/20 absolute -right-4 -bottom-4 rotate-12"></i>
            </div>

            <div class="space-y-4">
                ${generateTaskItem('follow', 'متابعة حساب سريع', 50, 'fa-user-plus', 'accent-cyan')}
                ${generateTaskItem('like', 'إعجاب بمنشور بريميوم', 25, 'fa-heart', 'accent-pink')}
                ${generateTaskItem('watch', 'مشاهدة فيديو تعليمي', 40, 'fa-eye', 'white')}
            </div>
        </div>
    `;
}

function generateTaskItem(id, title, reward, icon, color) {
    return `
        <div class="glass p-5 rounded-[25px] flex items-center justify-between group hover:border-white/20 transition">
            <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shadow-inner">
                    <i class="fa-solid ${icon} text-2xl text-${color}"></i>
                </div>
                <div class="space-y-1">
                    <h4 class="font-black text-sm">${title}</h4>
                    <span class="text-yellow-400 text-[10px] font-black">+${reward} عملة ذهبية</span>
                </div>
            </div>
            <button onclick="doTask('${id}', ${reward})" class="p-4 bg-white/5 rounded-2xl hover:bg-white text-white hover:text-black transition">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
        </div>
    `;
}

function renderShop(container) {
    container.innerHTML = `
        <div class="h-full p-8 pt-12 space-y-8 no-scrollbar overflow-y-auto pb-24 animate-slide">
             <div class="flex justify-between items-center">
                <h1 class="text-4xl font-black">المتجر</h1>
                <div class="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl">
                    <i class="fa-solid fa-coins text-yellow-400"></i>
                    <span class="font-black">${state.coins}</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                ${generateShopItem('1000 Follower', 500, 'fa-users', 'accent-cyan')}
                ${generateShopItem('5000 Views', 200, 'fa-eye', 'white')}
                ${generateShopItem('2000 Likes', 300, 'fa-heart', 'accent-pink')}
                ${generateShopItem('100 Comments', 150, 'fa-comment', 'accent-cyan')}
            </div>
        </div>
    `;
}

function generateShopItem(title, price, icon, color) {
    return `
        <div class="glass p-6 rounded-[35px] flex flex-col items-center space-y-4 text-center group">
            <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center shadow-2xl group-hover:scale-110 transition">
                <i class="fa-solid ${icon} text-3xl text-${color}"></i>
            </div>
            <div>
                <h4 class="font-black text-sm">${title}</h4>
                <p class="text-[10px] text-white/30 font-bold">تسليم فوري (AI)</p>
            </div>
            <button onclick="buy('${title}', ${price})" class="w-full py-3 bg-white text-black rounded-2xl font-black text-[10px] shadow-lg shadow-white/5">
                ${price} عملة
            </button>
        </div>
    `;
}

function renderProfile(container) {
    container.innerHTML = `
        <div class="h-full p-8 pt-12 space-y-8 no-scrollbar overflow-y-auto pb-24 animate-slide">
            <div class="flex flex-col items-center space-y-4">
                <div class="w-32 h-32 rounded-[50px] border-4 border-accent-cyan p-2 rotate-6 shadow-[0_0_30px_rgba(37,244,238,0.2)]">
                    <img src="https://ui-avatars.com/api/?name=${state.user || 'Tik'}&background=0D1117&color=fff&size=256" class="w-full h-full rounded-[35px] object-cover">
                </div>
                <div class="text-center">
                    <h2 class="text-3xl font-black">@${state.user || 'مستخدم_جديد'}</h2>
                    <span class="text-[10px] bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full font-bold">عضو بريميوم</span>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-2">
                <div class="glass py-6 rounded-[25px] text-center">
                    <h5 class="text-xl font-black">${state.stats.followers}</h5>
                    <p class="text-[9px] text-white/30 font-bold uppercase">متابع</p>
                </div>
                <div class="glass py-6 rounded-[25px] text-center border-accent-pink/30">
                    <h5 class="text-xl font-black">${state.stats.likes}</h5>
                    <p class="text-[9px] text-white/30 font-bold uppercase">إعجاب</p>
                </div>
                <div class="glass py-6 rounded-[25px] text-center">
                    <h5 class="text-xl font-black">${state.stats.views}</h5>
                    <p class="text-[9px] text-white/30 font-bold uppercase">مشاهدة</p>
                </div>
            </div>

            <div class="space-y-4">
                <h3 class="text-xs font-black text-white/20 uppercase tracking-widest px-2">الحسابات المربوطة</h3>
                <div id="acc-list" class="space-y-3">
                    ${state.linkedAccounts.length > 0 ? state.linkedAccounts.map(a => `
                        <div class="glass p-4 rounded-[20px] flex justify-between items-center animate-slide">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                    <i class="fa-brands fa-tiktok text-accent-cyan"></i>
                                </div>
                                <span class="font-bold text-sm">${a.username}</span>
                            </div>
                            <span class="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                        </div>
                    `).join('') : `
                        <button onclick="openLinkModal()" class="w-full py-8 glass border-dashed border-white/20 rounded-[30px] flex flex-col items-center gap-3 active:scale-95 transition">
                            <i class="fa-solid fa-link text-2xl text-white/20"></i>
                            <span class="text-xs font-bold text-white/40">اضغط لربط حساب تيك توك حقيقي</span>
                        </button>
                    `}
                </div>
            </div>

            <button onclick="logout()" class="w-full py-5 rounded-[25px] bg-red-500/10 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition">
                تسجيل الخروج
            </button>
        </div>
    `;
}

// --- Logic ---

function loginDemo() {
    state.isAuthenticated = true;
    state.user = "Demo_User";
    saveState();
    toast("مرحباً بك في تيك بوست البريميوم", true);
    router('home');
}

function logout() {
    state = { ...defaultState };
    saveState();
    router('login');
}

function toast(msg, success = true) {
    const el = document.getElementById('toast');
    const txt = document.getElementById('toast-msg');
    const icon = document.getElementById('toast-icon');
    const bg = document.getElementById('toast-icon-bg');

    txt.innerText = msg;
    icon.className = success ? "fa-solid fa-check text-[10px] text-accent-cyan" : "fa-solid fa-xmark text-[10px] text-accent-pink";
    bg.className = success ? "w-6 h-6 rounded-full flex items-center justify-center bg-accent-cyan/20" : "w-6 h-6 rounded-full flex items-center justify-center bg-accent-pink/20";

    el.style.transform = "translateX(-50%) scale(1.2)";
    setTimeout(() => el.style.transform = "translateX(-50%) scale(1)", 100);
    setTimeout(() => el.style.transform = "translateX(-50%) scale(0)", 2500);
}

function openLinkModal() { document.getElementById('modal').style.display = 'flex'; }
function closeModal() { document.getElementById('modal').style.display = 'none'; }

async function confirmLink() {
    const user = document.getElementById('link-user').value;
    const sid = document.getElementById('link-sid').value;
    if (!user || !sid) return toast("يرجى إدخال جميع البيانات", false);

    toast("جاري التحقق من الحساب...", true);

    try {
        const res = await API.addAccount(user, sid);
        state.linkedAccounts.push({ username: user, sid: sid });
        saveState();
        closeModal();
        toast("تم ربط الحساب بنجاح!", true);
        router('profile');
    } catch (e) {
        toast("فشل الربط! تأكد من تشغيل الخادم", false);
    }
}

function doTask(id, reward) {
    toast("جاري توجيهك للمهمة...", true);
    setTimeout(() => {
        state.coins += reward;
        saveState();
        toast(`تمت العملية! حصلت على ${reward} عملة`, true);
        router('earn');
    }, 2000);
}

function buy(item, price) {
    if (state.coins < price) return toast("الرصيد غير كافٍ!", false);
    if (state.linkedAccounts.length === 0) return toast("اربط حساب تيك توك أولاً!", false);

    state.coins -= price;
    saveState();
    toast(`جاري تنفيذ طلب ${item}...`, true);
    setTimeout(() => toast("بدأ التنفيذ بنجاح! راقب حسابك", true), 1500);
    router('shop');
}

// Initial Run
loadState();
router(state.isAuthenticated ? 'home' : 'login');
