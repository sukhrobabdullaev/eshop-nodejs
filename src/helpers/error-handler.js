function errorHandler(err, req, res, next) {
    console.error("Error Details:", err);
    if(err.name=="UnauthorizedError") {
        // jwt authentication error
       return res.status(401).json({ message: "The user is not authorized" });
      }

    if(err.name=="ValidationError") {
        // mongoose validation error
       return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }

    // internal server error
    return res.status(500).json({ message: "Internal Server Error", error: err });
}


module.exports = errorHandler;