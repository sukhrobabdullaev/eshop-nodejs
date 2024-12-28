const multer = require("multer");

const extension = (mimeType) => {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/jpeg') return 'jpeg';
  if (mimeType === 'image/jpg') return 'jpg';
  return 'jpg';
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    const isValid = file.mimetype.startsWith('image/');

    if (isValid) {  
      cb(null, 'public/uploads/')   
    } else {
      let error = new Error('Only images are allowed');
      cb(error, 'public/uploads/')
    }

  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-');
    cb(null, `${fileName}`)
  }
})

const uploadOptions = multer({ storage: storage })

module.exports = uploadOptions;