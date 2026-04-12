const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const uploadDir = "pictures/profiles";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSiffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSiffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Nur Bilder sind erlaubt"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFiler: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
