import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("multer in ", req);
    cb(null, "/uploads/images");
  },
  filename: (req, file, cb) => {
    console.log("요청 바디 : ", req.body);
    console.log("file:", file);
    cb(null, `${Date.now()}.png`);
  },
});
const itemImg = multer({ storage });

const testMiddle = (req, res, next) => {
  console.log("test middle in", req.params);
  next();
};

export { testMiddle, itemImg };
