import axios from "axios";

const uploadPic = async media => {
  try {
    const form = new FormData();
    form.append("file", media);
    form.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
    form.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);

    form.append("api_key", process.env.NEXT_PUBLIC_API_KEY);
    console.log("uploadPicToCloudinary.js: form:", form);
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/auto/upload`, form);
    console.log("uploadPicToCloudinary.js: res:", res);
    // const res = await axios.post(process.env.CLOUDINARY_URL, form);
    return res.data.secure_url;
  } catch (error) {
    console.log(error);
    return;
  }
};

export default uploadPic;
