const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const { Media } = require("../models");
const { APP_HOSTNAME, APP_CODE } = process.env;

module.exports = {
    index: async (req, res) => {
        try {
            const media = await Media.findAll({
                where: { user: req.user.data.id },
                attributes: ["id", "type", "file"],
            });

            const mappedMedia = media.map((m) => {
                m.file = `${APP_HOSTNAME}/${m.file}`;
                return m;
            });

            return res.json({
                status: "success",
                message: "files successfully got",
                data: mappedMedia,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "internal server error",
            });
        }
    },
    store: (type) => async (req, res) => {
        try {
            const files = req.files.files;
            let data = [];

            if (files.length) {
                for (const file of files) {
                    const fileName = `${APP_CODE}-${Date.now()}${path.extname(
                        file.name
                    )}`;

                    //move photo to uploads directory
                    file.mv(`./public/assets/${type}s/${fileName}`);

                    const media = await Media.create({
                        file: `assets/${type}s/${fileName}`,
                        type,
                        user: req.user.data.id,
                    });

                    data.push({ id: media.id, type, file: `${APP_HOSTNAME}/${media.file}` });
                }
            } else {
                const fileName = `${APP_CODE}-${Date.now()}${path.extname(
                    files.name
                )}`;

                //move photo to uploads directory
                files.mv(`./public/assets/${type}s/${fileName}`);

                const media = await Media.create({
                    file: `assets/${type}s/${fileName}`,
                    type,
                    user: req.user.data.id,
                });
                data = { id: media.id, type, file: `${APP_HOSTNAME}/${media.file}` };
            }
            return res.json({
                status: "success",
                message: "files successfully uploaded",
                data,
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "internal server error",
            });
        }
    },
    destroy: async (req, res) => {
        try {
            const { id } = req.params;
            const media = await Media.findByPk(id);

            if (!media) {
                return res.status(404).json({
                    status: "error",
                    message: "File not found",
                });
            }

            if (media.user !== req.user.data.id) {
                return res.status(403).json({
                    status: "error",
                    message: "You are not allowed to delete this file",
                });
            }

            fs.unlink(`./public/${media.file}`, async (err) => {
                if (err) {
                    return res.status(400).json({
                        status: "error",
                        message: err.message,
                    });
                }

                await media.destroy();
                return res.json({
                    status: "success",
                    message: "file successfully deleted",
                });
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "internal server error",
            });
        }
    },
};
