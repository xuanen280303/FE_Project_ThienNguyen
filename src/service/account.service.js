import { accountApi } from './auth.service';
import tokenService from './token.service';

class AccountService {
    getAccount() {
        const account_local = localStorage.getItem('account');
        if (account_local) {
            return { account: JSON.parse(account_local), storage: 'local' };
        }
        const account_session = sessionStorage.getItem('account');
        if (account_session) {
            return { account: JSON.parse(account_session), storage: 'session' };
        }
        return { account: null, storage: null };
    }

    async createAccount(isRemember) {
        const { storage } = tokenService.getToken();
        if (!storage) return;
        const newAccount = await accountApi();
        if (isRemember) {
            return localStorage.setItem('account', JSON.stringify(newAccount.data));
        }
        return sessionStorage.setItem('account', JSON.stringify(newAccount.data));
    }

    async updateAccount() {
        const { storage } = tokenService.getToken();
        if (!storage) return;
        const newAccount = await accountApi();
        const account = this.getAccount().storage;
        if (account === 'local') {
            return localStorage.setItem('account', JSON.stringify(newAccount.data));
        } else if (account === 'session') {
            return sessionStorage.setItem('account', JSON.stringify(newAccount.data));
        }
    }

    removeAccount() {
        localStorage.removeItem('account');
        sessionStorage.removeItem('account');
    }
}

export default new AccountService();
