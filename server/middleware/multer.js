import multer from 'multer'


const storage = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png"
            || file.mimetype === "image/jpg"
            || file.mimetype === "image/jpeg")
            {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }

})
