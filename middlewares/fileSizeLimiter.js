const _ = require("lodash");

const fileSizeLimiter = (limit) => {
    const FILE_SIZE_LIMIT = limit * 1024 * 1024;
    return (req, res, next) => {
        const files = req.files.files;

        const filesOverLimit = [];
        // Which files are over the limit?
        if (files.length) {
            _.forEach(_.keysIn(files), (key) => {
                if (files[key].size > FILE_SIZE_LIMIT) {
                    filesOverLimit.push(files[key].name);
                }
            });
        } else {
            if (files.size > FILE_SIZE_LIMIT) {
                filesOverLimit.push(files.name);
            }
        }

        if (filesOverLimit.length) {
            const properVerb = filesOverLimit.length > 1 ? "are" : "is";

            const sentence =
                `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${limit} MB.`.replaceAll(
                    ",",
                    ", "
                );

            const message =
                filesOverLimit.length < 3
                    ? sentence.replace(",", " and")
                    : sentence.replace(/,(?=[^,]*$)/, " and");

            return res.status(413).json({ status: "error", message });
        }

        next();
    };
};

module.exports = fileSizeLimiter;
