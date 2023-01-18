const path = require("path");
const _ = require("lodash");

const fileExtLimiter = (allowedExtArray) => {
    return (req, res, next) => {
        const files = req.files.files;

        const fileExtensions = [];
        if (files.length) {
            _.forEach(_.keysIn(files), (key) => {
                fileExtensions.push(path.extname(files[key].name));
            });
        } else {
            fileExtensions.push(path.extname(files.name));
        }

        // Are the file extension allowed?
        const allowed = fileExtensions.every((ext) =>
            allowedExtArray.includes(ext.toLowerCase())
        );

        if (!allowed) {
            const message =
                `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
                    ",",
                    ", "
                );

            return res.status(422).json({ status: "error", message });
        }

        next();
    };
};

module.exports = fileExtLimiter;
