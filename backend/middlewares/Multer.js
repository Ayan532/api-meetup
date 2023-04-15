const multer=require("multer")

const storage=multer.memoryStorage()


//We will only able get file when we use req.file cause file name is define in here
exports.singleupload=multer({storage}).single("file")