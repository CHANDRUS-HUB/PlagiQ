const validator = require('validator');

const validateUserInput = (username, email, password, phoneNumber) => {
    const errors = [];

    // Username validation
    if (!username || !/^[A-Za-z0-9_ -]{3,}$/.test(username.trim())) {
        errors.push("Username is required, must be at least 3 characters, and can include alphabets, numbers, spaces, underscores, and hyphens.");
    }

    // Email validation using validator library
    if (email && !validator.isEmail(email)) {
        errors.push("Invalid email format.");
    }

    // Password validation
    if (!password || password.length < 6 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must be at least 6 characters long, contain at least one number, one uppercase letter, and one special character.");
    }

    // Phone number validation
    if (phoneNumber && !/^\d{12}$/.test(phoneNumber.replace(/[\s-]/g, ''))) {
        errors.push("Phone number must be exactly 12 digits, and can include spaces or dashes.");
    }

    return errors;
};

module.exports = { validateUserInput };
