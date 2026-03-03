const API = {
    baseUrl: 'http://localhost:8000',

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('auth_token');

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'حدث خطأ');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Auth
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (data.access_token) {
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user_id', data.user_id);
        }
        return data;
    },

    async register(email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
    },

    // TikTok Accounts
    async getAccounts() {
        return this.request('/accounts');
    },

    async addAccount(username, session_id) {
        return this.request('/accounts/add', {
            method: 'POST',
            body: JSON.stringify({ username, session_id })
        });
    },

    // Bots
    async startBot(accountId, botType, target = null) {
        return this.request('/bots/start', {
            method: 'POST',
            body: JSON.stringify({ account_id: accountId, bot_type: botType, target })
        });
    },

    async stopBot(accountId, botType) {
        return this.request('/bots/stop', {
            method: 'POST',
            body: JSON.stringify({ account_id: accountId, bot_type: botType })
        });
    }
};

// Check if backend is available
API.checkConnection = async function () {
    try {
        await fetch(this.baseUrl + '/health', { method: 'GET' });
        return true;
    } catch {
        return false;
    }
};
