const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage });
const { getCloudinaryUrlBymulter } = require("../utilites/cloudinary.js");


router.post("/", async (req, res) => {
  try {
    let { fname } = req.query;
    function answer() {
      return new Promise((resolve, reject) => {
        upload.single(fname)(req, null, async (err) => {
          if (err) {
            reject(err);
          }
          const result = await getCloudinaryUrlBymulter(req.file);
          resolve(result);
        });
      });
    }
    let result = await answer();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/Arr", async (req, res) => {
  try {
    let { fname } = req.query;
    function answer() {
      return new Promise((resolve, reject) => {
        upload.array(fname)(req, null, async (err) => {
          if (err) {
            reject(err);
          }
          let Arr = req.files.map((file) => getCloudinaryUrlBymulter(file));
          let result = await Promise.all(Arr);
          resolve(result.map((item) => item?.secure_url || "#") || []);
        });
      });
    }
    let result = await answer();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;