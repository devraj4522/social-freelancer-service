import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);

  data.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
  data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
  data.append("api_key", process.env.NEXT_PUBLIC_API_KEY);

  try {
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/auto/upload`, data);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export default upload;
