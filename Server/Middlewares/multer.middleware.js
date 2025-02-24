import multer from "multer"

const storage = multer.diskStorage({
    destination : function (req , file, cb) {
        cb( null, './uploads')
    },
    filename : function (req,file,cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,file.fieldname + '-' + uniqueSuffix)
    } 
})





const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only Excel files are allowed."), false);
    }
  };

const upload = multer({ 
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter
 })


 export default upload
