import AccountService from '@/service/account.service';
import TokenService from '@/service/token.service';

export const requireAuth = (to, from, next) => {
    const token = TokenService.getToken();
    const account = AccountService.getAccount();

    if (!token.header.Authorization) {
        return next({ name: 'login' });
    }

    if (to.path.startsWith('/admin')) {
        if (account.account && account.account.role.name === 'SUPER_ADMIN') {
            return next();
        } else {
            return next({ name: 'Home' });
        }
    }

    next();
};
