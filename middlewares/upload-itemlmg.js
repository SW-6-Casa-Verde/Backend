import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.png`); // 이미지 저장 파일명
  },
});
const itemImg = multer({ storage });

export { itemImg };
