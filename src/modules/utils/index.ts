export default {
    parameters: [],
    run: async ({ outputs }) => {
        return {
            logged_in: () => (outputs.login && outputs.login.success) || outputs.cookie_login,
        };
    },
};
