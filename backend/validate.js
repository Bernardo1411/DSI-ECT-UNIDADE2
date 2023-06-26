exports.validatePassword = (password) => {
    const re = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return re.test(String(password));
};

exports.validateUserName = (userName) => {
    const re = /^[a-zA-Z0-9]{3,}$/;
    return re.test(String(userName));
};