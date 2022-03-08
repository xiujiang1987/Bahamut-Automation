export default {
    parameters: [],
    run: async ({ outputs }) => {
        return {
            logged_in: () =>
                (outputs.login && outputs.login.success) ||
                outputs.cookie_login ||
                (outputs.login_v2 && outputs.login_v2.success),
        };
    },
};
