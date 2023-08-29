const axios = require('axios');

// Configuration 
// cloudinary.config({
//   cloud_name: process.env.cloudinary_cloud_name,
//   api_key: process.env.cloudinary_api_key,
//   api_secret: process.env.cloudinary_api_secret,
// }); 


const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);

  data.append("upload_preset", process.env.UPLOAD_PRESET);
  data.append("cloud_name", process.env.CLOUD_NAME);
  data.append("api_key", process.env.API_KEY);
  
  
  try {
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/auto/upload`, data);
    const { url } = res.data;
    return url;
  } catch (err) {
    console.log(err);
  }
};
module.exports = upload;