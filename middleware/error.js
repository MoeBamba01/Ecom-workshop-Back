function notFound(req, res, next) {
    res.status(404).json({ message: `Ay Route bi Existe woul XOlal fenen - ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
    console.error(err.message);

    // Proleme Momgo

    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID" });
    }

    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }

    if (err.code && err.code === 11000) {
        return res.status(400).json({ message: "Duplicate field value entered" });
    }

    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error",
    });
}

module.exports = { notFound, errorHandler };