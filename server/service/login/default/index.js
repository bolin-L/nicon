class DefaultLogin {
    async login () {
        return null;
    }
}

let loginIns = new DefaultLogin();
module.exports = loginIns.login.bind(loginIns);
