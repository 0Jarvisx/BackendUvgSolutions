const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("./../config/aws");

console.log(process.env.AWS_REGION);

exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = `products/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por archivo
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos JPEG y PNG"), false);
    }
  },
});
