const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500; // i am using default status code 500 if not set

    res.status(statusCode).json({
        message: err.message,
    });
};

module.exports = errorHandler;
