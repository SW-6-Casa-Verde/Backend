import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("./uploads/images")) {
      fs.mkdirSync("./uploads/images", { recursive: true });
    }
    cb(null, "uploads/images"); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}_${Date.now()}.png`); // 이미지 저장 파일명
  },
});
const itemImg = multer({ storage });

export { itemImg };
