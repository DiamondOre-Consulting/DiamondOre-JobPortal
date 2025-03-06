import multer from "multer"
export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
       
        if (err.code === "LIMIT_FILE_SIZE") {
            console.log("lo")
            return res.status(400).json({ message: "File size too large!" });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
    
        return res.status(400).json({ message: err.message });
    }
    next();
};