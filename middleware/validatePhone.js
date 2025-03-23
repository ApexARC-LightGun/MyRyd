const validatePhone = (req, res, next) => {
    const phoneRegex = /^[+]?[0-9]{10,13}$/; // Supports international and standard formats
    if (!phoneRegex.test(req.body.phone)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }
    next();
};

module.exports = validatePhone;