import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  // provide cloudinary config
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      // make unique name for image
      // rename file from original name
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // remove space
        .replace(/\./g, "-") // remove .
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, ""); // remove non alpha numeric !@#$

      const extension = file.originalname.split(".").pop();
      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extension;

      return uniqueFileName;
    },
  },
});

// mention multer the temporary storage
export const multerUpload = multer({ storage: storage });
