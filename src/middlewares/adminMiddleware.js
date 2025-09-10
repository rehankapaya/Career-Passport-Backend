const admin = (req, res, next) => {
    // The 'protect' middleware must run first to attach req.user
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/controller
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };