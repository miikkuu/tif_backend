const errorHandler = (err, req, res, next) => {

    // Logging to the console for the developer for debugging
    console.error(err.stack);

    let statusCode = 500;

    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad request
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401; // Unauthorized
    } else if (err.name === 'NotFoundError') {
        statusCode = 404; // Not found
    }

    const errorResponse = {
        message: err.message || 'Internal Server Error Occurred', // 
        status: statusCode
    };

    res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
