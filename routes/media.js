const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const { index, store, destroy } = require("../handlers/MediaHandler");
const filesPayloadExists = require("../middlewares/filesPayloadExists");
const fileExtLimiter = require("../middlewares/fileExtLimiter");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");

router.get("/", index);
router.post(
    "/images",
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".png", ".jpg", ".jpeg"]),
    fileSizeLimiter(2),
    store('image')
);
router.post(
    "/videos",
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter([".mp4"]),
    fileSizeLimiter(30),
    store('video')
);
router.delete("/:id", destroy);

module.exports = router;
