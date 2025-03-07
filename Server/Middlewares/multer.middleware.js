import multer from "multer"

const excelStorage  = multer.diskStorage({
    destination : function (req , file, cb) {
        cb( null, './uploads')
    },
    filename : function (req,file,cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,file.fieldname + '-' + uniqueSuffix)
    } 
})

const imageStorage = multer.memoryStorage(); 



const excelFilter = (req, file, cb) => {
  const allowedTypes = [
      "application/vnd.ms-excel", 
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
       "application/pdf"
  ];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"), false);
};

const pdfAllowedMimeTypes = [
    "application/pdf",  // PDF
    "application/msword",  // DOC (Older Word format)
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  // DOCX (Newer Word format)
    "application/rtf",  // RTF (Rich Text Format)
    "text/plain"  // TXT (Plain text) 
];

export const pdfUpload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (pdfAllowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PDFs and Excel files are allowed."), false);
        }
    }
});

export const excelUpload = multer({ 
    storage: excelStorage, 
    limits: { fileSize: 25 * 1024 * 1024 },
    excelFilter
 })

 const allowedImageMimeTypes = [
    "image/jpeg",  // JPG, JPEG
    "image/png",   // PNG
    "image/gif",   // GIF
    "image/webp",  // WEBP
    "image/tiff",  // TIFF
    "image/bmp",   // BMP
    "image/svg+xml", // SVG
    "application/pdf",  // PDF
    "application/pdf",  // PDF
    "application/msword",  // DOC (Older Word format)
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  // DOCX (Newer Word format)
    "application/rtf",  // RTF (Rich Text Format)
    "text/plain"  // TXT (Plain text) 
  ];


 export const uploadImage = multer({
      storage : imageStorage,
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        console.log("sfa")
        if (!allowedImageMimeTypes.includes(file.mimetype)) {
            console.log("ajsdfhk")
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    },
  });


