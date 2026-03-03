// ─── State ───
let user = null;
let accounts = [];
let queue = [];

function isLoggedIn() { return !!localStorage.getItem('tikboost_token'); }

// ─── Navigation ───
function go(page) {
    const c = document.getElementById('content');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    const active = document.querySelector(`[data-page="${page}"]`);
    if (active) active.classList.add('active');

    if (!isLoggedIn() && page !== 'login') { renderLogin(c); return; }

    switch (page) {
        case 'home': renderHome(c); break;
        case 'earn': renderEarn(c); break;
        case 'shop': renderShop(c); break;
        case 'profile': renderProfile(c); break;
        default: renderLogin(c);
    }
}

// ─── Toast ───
function toast(msg, ok = true) {
    const el = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const txt = document.getElementById('toast-text');
    txt.textContent = msg;
    icon.className = ok ? 'fa-solid fa-circle-check text-cyan text-sm' : 'fa-solid fa-circle-xmark text-pink text-sm';
    el.style.opacity = '1'; el.style.transform = 'translateX(-50%) scale(1)';
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(-50%) scale(0.9)'; }, 2500);
}

// ─── Login Page ───
function renderLogin(c) {
    document.getElementById('navbar').style.display = 'none';
    c.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center px-8 fade-in">
            <div class="w-28 h-28 bg-gradient-to-br from-cyan to-pink rounded-[35px] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(37,244,238,0.15)] rotate-6">
                <i class="fa-brands fa-tiktok text-5xl text-white"></i>
            </div>
            <h1 class="text-4xl font-black mb-2">TikBoost</h1>
            <p class="text-white/30 text-sm mb-10 text-center">تابع حسابات حقيقية → اكسب نقاط → احصل على متابعين حقيقيين</p>
            
            <div class="w-full space-y-3 mb-6">
                <input id="l-email" type="email" class="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan transition text-sm" placeholder="البريد الإلكتروني">
                <input id="l-pass" type="password" class="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-cyan transition text-sm" placeholder="كلمة المرور">
            </div>
            
            <button onclick="doLogin()" id="login-btn" class="w-full py-4 bg-white text-black font-black rounded-2xl text-sm mb-3 active:scale-95 transition">
                <i class="fa-solid fa-right-to-bracket ml-2"></i> دخول
            </button>
            <button onclick="doRegister()" class="text-white/30 text-xs underline">إنشاء حساب جديد</button>
        </div>
    `;
}

// ─── Home Page ───
function renderHome(c) {
    document.getElementById('navbar').style.display = 'flex';
    const coins = user ? user.coins : 0;
    const accs = user ? user.accounts.length : 0;
    const tasks = user ? user.totalTasksDone : 0;

    c.innerHTML = `
        <div class="h-full overflow-y-auto no-scroll p-6 pt-4 pb-24 fade-in">
            <div class="mb-8">
                <h1 class="text-3xl font-black">مرحباً 👋</h1>
                <p class="text-white/30 text-sm">لوحة التحكم الخاصة بك</p>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-3 gap-3 mb-8">
                <div class="bg-card rounded-3xl p-5 text-center border border-white/5">
                    <div class="text-2xl font-black text-cyan">${coins}</div>
                    <div class="text-[9px] text-white/30 mt-1 uppercase tracking-wider">نقاط</div>
                </div>
                <div class="bg-card rounded-3xl p-5 text-center border border-white/5">
                    <div class="text-2xl font-black text-pink">${accs}</div>
                    <div class="text-[9px] text-white/30 mt-1 uppercase tracking-wider">حسابات</div>
                </div>
                <div class="bg-card rounded-3xl p-5 text-center border border-white/5">
                    <div class="text-2xl font-black">${tasks}</div>
                    <div class="text-[9px] text-white/30 mt-1 uppercase tracking-wider">مهام</div>
                </div>
            </div>

            <!-- Quick Actions -->
            <h3 class="text-xs font-black text-white/20 uppercase tracking-widest mb-4">إجراءات سريعة</h3>
            <div class="space-y-3">
                <button onclick="go('earn')" class="w-full bg-gradient-to-r from-cyan/10 to-cyan/5 border border-cyan/20 p-5 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition">
                    <div class="w-12 h-12 bg-cyan/10 rounded-2xl flex items-center justify-center"><i class="fa-solid fa-bolt text-cyan text-xl"></i></div>
                    <div class="text-right">
                        <h4 class="font-black text-sm">ابدأ كسب النقاط</h4>
                        <p class="text-[10px] text-white/30">تابع حسابات حقيقية واكسب 10 نقاط لكل متابعة</p>
                    </div>
                </button>
                <button onclick="go('shop')" class="w-full bg-gradient-to-r from-pink/10 to-pink/5 border border-pink/20 p-5 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition">
                    <div class="w-12 h-12 bg-pink/10 rounded-2xl flex items-center justify-center"><i class="fa-solid fa-users text-pink text-xl"></i></div>
                    <div class="text-right">
                        <h4 class="font-black text-sm">اشترِ متابعين</h4>
                        <p class="text-[10px] text-white/30">استخدم نقاطك للحصول على متابعين حقيقيين</p>
                    </div>
                </button>
                ${accs === 0 ? `
                <button onclick="openModal()" class="w-full bg-card border border-dashed border-white/20 p-5 rounded-2xl flex items-center gap-4 active:scale-[0.98] transition">
                    <div class="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><i class="fa-solid fa-link text-white/40 text-xl"></i></div>
                    <div class="text-right">
                        <h4 class="font-black text-sm text-white/60">اربط حساب تيك توك أولاً</h4>
                        <p class="text-[10px] text-white/20">مطلوب لبدء استخدام المنصة</p>
                    </div>
                </button>` : ''}
            </div>
        </div>
    `;
}

// ─── Earn Page ───
async function renderEarn(c) {
    document.getElementById('navbar').style.display = 'flex';

    if (!user || user.accounts.length === 0) {
        c.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center p-10 fade-in">
                <i class="fa-solid fa-link-slash text-5xl text-white/10 mb-6"></i>
                <h2 class="text-xl font-black mb-2">لا يوجد حساب مربوط</h2>
                <p class="text-white/30 text-xs text-center mb-6">يجب ربط حساب تيك توك أولاً حتى يتمكن البوت من المتابعة نيابةً عنك</p>
                <button onclick="openModal()" class="px-8 py-4 bg-cyan text-black font-black rounded-2xl text-sm">ربط حساب الآن</button>
            </div>`;
        return;
    }

    c.innerHTML = `
        <div class="h-full overflow-y-auto no-scroll p-6 pt-4 pb-24 fade-in">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-black">كسب النقاط ⚡</h1>
                <div class="bg-card border border-white/10 px-4 py-2 rounded-2xl text-xs font-black"><i class="fa-solid fa-coins text-yellow-400 ml-1"></i> ${user.coins}</div>
            </div>
            <p class="text-white/30 text-xs mb-6">اضغط "تابع" ← البوت يتابع الحساب فعلياً من حسابك ← تكسب 10 نقاط</p>
            <div id="task-list" class="space-y-3">
                <div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-white/20 text-2xl"></i></div>
            </div>
        </div>`;

    // Load task queue
    try {
        queue = await API.getQueue();
        const list = document.getElementById('task-list');
        if (queue.length === 0) {
            list.innerHTML = '<p class="text-center text-white/20 text-sm py-10">لا توجد مهام متاحة حالياً</p>';
            return;
        }
        list.innerHTML = queue.map((q, i) => `
            <div class="bg-card border border-white/5 p-5 rounded-2xl flex items-center justify-between fade-in" style="animation-delay:${i * 0.08}s">
                <div class="flex items-center gap-4">
                    <img src="https://ui-avatars.com/api/?name=${q.username}&background=141414&color=25F4EE&size=80" class="w-12 h-12 rounded-xl border border-white/10">
                    <div>
                        <h4 class="font-bold text-sm">@${q.username}</h4>
                        <span class="text-[10px] text-yellow-400 font-bold">+10 نقطة</span>
                    </div>
                </div>
                <button onclick="doFollow('${q.username}', this)" class="px-5 py-3 bg-cyan text-black font-black text-xs rounded-xl active:scale-90 transition">
                    تابع
                </button>
            </div>
        `).join('');
    } catch (e) {
        document.getElementById('task-list').innerHTML = `<p class="text-red-400 text-xs text-center">${e.message}</p>`;
    }
}

// ─── Shop Page ───
function renderShop(c) {
    document.getElementById('navbar').style.display = 'flex';
    const coins = user ? user.coins : 0;
    const hasAccount = user && user.accounts.length > 0;

    c.innerHTML = `
        <div class="h-full overflow-y-auto no-scroll p-6 pt-4 pb-24 fade-in">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-black">شراء متابعين 🛒</h1>
                <div class="bg-card border border-white/10 px-4 py-2 rounded-2xl text-xs font-black"><i class="fa-solid fa-coins text-yellow-400 ml-1"></i> ${coins}</div>
            </div>
            <p class="text-white/30 text-xs mb-6">كل متابع حقيقي = 5 نقاط. المتابعون سيصلون خلال دقائق.</p>
            
            <div class="grid grid-cols-2 gap-3">
                ${[10, 50, 100, 500].map(amt => `
                    <div class="bg-card border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center">
                        <div class="w-16 h-16 bg-pink/10 rounded-2xl flex items-center justify-center mb-3">
                            <i class="fa-solid fa-user-plus text-pink text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-black">${amt}</h3>
                        <p class="text-[10px] text-white/30 mb-4">متابع حقيقي</p>
                        <button onclick="doRedeem(${amt})" class="w-full py-3 ${coins >= amt * 5 ? 'bg-white text-black' : 'bg-white/5 text-white/30'} font-black text-[11px] rounded-xl transition" ${coins < amt * 5 ? 'disabled' : ''}>
                            ${amt * 5} نقطة
                        </button>
                    </div>
                `).join('')}
            </div>
            
            ${!hasAccount ? '<p class="text-center text-white/20 text-xs mt-8">⚠️ اربط حساب تيك توك أولاً من صفحة حسابي</p>' : ''}
        </div>
    `;
}

// ─── Profile Page ───
function renderProfile(c) {
    document.getElementById('navbar').style.display = 'flex';
    const accs = user ? user.accounts : [];

    c.innerHTML = `
        <div class="h-full overflow-y-auto no-scroll p-6 pt-4 pb-24 fade-in">
            <div class="flex flex-col items-center mb-8">
                <div class="w-24 h-24 bg-gradient-to-br from-cyan to-pink p-[3px] rounded-[30px] rotate-3 mb-4">
                    <div class="w-full h-full bg-oled rounded-[27px] flex items-center justify-center">
                        <i class="fa-solid fa-user text-3xl text-white/60"></i>
                    </div>
                </div>
                <h2 class="text-xl font-black">${user ? user.email : ''}</h2>
                <span class="text-[10px] bg-cyan/10 text-cyan px-3 py-1 rounded-full font-bold mt-2">عضو نشط</span>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-8">
                <div class="bg-card rounded-2xl p-4 text-center border border-white/5">
                    <div class="text-xl font-black text-cyan">${user ? user.coins : 0}</div>
                    <div class="text-[9px] text-white/30">نقاط</div>
                </div>
                <div class="bg-card rounded-2xl p-4 text-center border border-white/5">
                    <div class="text-xl font-black">${user ? user.totalTasksDone : 0}</div>
                    <div class="text-[9px] text-white/30">مهام مكتملة</div>
                </div>
            </div>

            <h3 class="text-xs font-black text-white/20 uppercase tracking-widest mb-4">الحسابات المربوطة</h3>
            <div class="space-y-3 mb-8">
                ${accs.length > 0 ? accs.map(a => `
                    <div class="bg-card border border-white/5 p-4 rounded-2xl flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center">
                                <i class="fa-brands fa-tiktok text-cyan"></i>
                            </div>
                            <div>
                                <span class="font-bold text-sm">@${a.username}</span>
                                <div class="text-[10px] text-white/30">${a.followers || 0} متابع</div>
                            </div>
                        </div>
                        <span class="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                    </div>
                `).join('') : `
                    <button onclick="openModal()" class="w-full py-8 bg-card border border-dashed border-white/15 rounded-2xl flex flex-col items-center gap-3 active:scale-95 transition">
                        <i class="fa-solid fa-plus text-2xl text-white/15"></i>
                        <span class="text-xs text-white/30">اضغط لربط حساب تيك توك</span>
                    </button>
                `}
            </div>

            <button onclick="openModal()" class="w-full py-4 bg-cyan/10 text-cyan border border-cyan/20 rounded-2xl font-bold text-sm mb-3 active:scale-95 transition">
                <i class="fa-solid fa-plus ml-2"></i> ربط حساب إضافي
            </button>
            <button onclick="doLogout()" class="w-full py-4 bg-red-500/10 text-red-400 rounded-2xl font-bold text-sm active:scale-95 transition">
                تسجيل الخروج
            </button>
        </div>
    `;
}

// ─── Actions ───

async function doLogin() {
    const email = document.getElementById('l-email').value;
    const pass = document.getElementById('l-pass').value;
    if (!email || !pass) return toast('أدخل البريد وكلمة المرور', false);

    const btn = document.getElementById('login-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    try {
        const data = await API.login(email, pass);
        localStorage.setItem('tikboost_token', data.access_token);
        await loadUser();
        // ─── LOGIN & AUTH ───
        async function handleTikTokLogin() {
            const username = document.getElementById('login-username').value;
            if (!username) return toast('يرجى إدخال اسم المستخدم', false);

            try {
                const data = await API.post('/auth/tiktok', { username });
                localStorage.setItem('tikboost_token', data.token);
                user = data.user;
                await syncUser(); // Assuming syncUser is the new loadUser
                toast('تم الدخول بنجاح! 🚀');
                router('home'); // Assuming router is the new go
            } catch (e) {
                toast('خطأ في الدخول: ' + e.message, false);
            }
        }

        function doLogout() {
            localStorage.removeItem('tikboost_token');
            user = null; accounts = [];
            go('login');
        }

        function openModal() { document.getElementById('modal').style.display = 'flex'; }
        function closeModal() { document.getElementById('modal').style.display = 'none'; }

        async function linkAccount() {
            const username = document.getElementById('m-user').value.replace('@', '');
            const sid = document.getElementById('m-sid').value;
            if (!username || !sid) return toast('أدخل جميع البيانات', false);

            const btn = document.getElementById('link-btn');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الربط...';
            try {
                await API.addAccount(username, sid);
                await loadUser();
                closeModal();
                toast(`تم ربط @${username} بنجاح!`);
                go('profile');
            } catch (e) {
                toast('فشل الربط: ' + e.message, false);
            } finally {
                btn.innerHTML = 'ربط الآن';
            }
        }

        async function doFollow(targetUsername, btnEl) {
            if (!user || user.accounts.length === 0) return toast('اربط حساب أولاً', false);
            const account = user.accounts[0];

            // Direct Manual Follow Flow
            toast("جاري فتح حساب @" + targetUsername);
            window.open(`https://www.tiktok.com/@${targetUsername}`, '_blank');

            // Change button to Verify mode
            btnEl.innerHTML = 'تأكيد المتابعة (Verify)';
            btnEl.className = 'px-5 py-3 bg-yellow-400 text-black font-black text-[10px] rounded-xl animate-pulse';

            btnEl.onclick = async () => {
                btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                btnEl.disabled = true;
                try {
                    const result = await API.earnFollow(account.id, targetUsername);
                    if (result.success) {
                        user.coins = result.newCoins;
                        btnEl.innerHTML = '✓ تم التحقق';
                        btnEl.onclick = null;
                        btnEl.className = 'px-5 py-3 bg-green-500/20 text-green-400 font-black text-[10px] rounded-xl cursor-default';
                        toast("تمت المتابعة! +10 نقاط 💰");
                        updateStats(); // Update UI coins
                    } else {
                        btnEl.innerHTML = 'إعادة التحقق';
                        btnEl.disabled = false;
                        toast(result.message, false);
                    }
                } catch (e) {
                    btnEl.innerHTML = 'خطأ';
                    btnEl.disabled = false;
                    toast(e.message, false);
                }
            };
        }

        async function doRedeem(amount) {
            if (!user || user.accounts.length === 0) return toast('اربط حساب أولاً', false);
            const cost = amount * 5;
            if (user.coins < cost) return toast(`تحتاج ${cost} نقطة، رصيدك ${user.coins}`, false);

            if (!confirm(`هل تريد شراء ${amount} متابع حقيقي مقابل ${cost} نقطة؟`)) return;

            try {
                const result = await API.redeem(user.accounts[0].id, amount);
                user.coins = result.newCoins;
                toast(result.message);
                go('shop');
            } catch (e) {
                toast(e.message, false);
            }
        }

        // ─── Load User Data ───
        async function loadUser() {
            try {
                user = await API.me();
            } catch (e) {
                user = null;
            }
        }

        // ─── Init ───
        (async () => {
            if (isLoggedIn()) {
                await loadUser();
                go('home');
            } else {
                go('login');
            }
        })();
