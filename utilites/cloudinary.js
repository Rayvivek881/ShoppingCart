const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dvclzi87c', 
  api_key: '414231947285516', 
  api_secret: 'cXKCkatIk00-VpFAitPSYlwrMXw' 
});

const getCloudinaryUrl = async (base64File) => {
  const buffer = new Buffer.from(base64File.split(',')[1], 'base64');
  const cloudinaryPromise = new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve({
        url: result?.url,
        public_id: result?.public_id,
      });
    }).end(buffer);
  });
  return cloudinaryPromise;
}

const getCloudinaryUrlByBase64 = async (base64File, format) => {
  const buffer = new Buffer.from(base64File.split(',')[1], 'base64');
  const cloudinaryPromise = new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ 
      resource_type: 'auto',
      format: format || "png", 
    }, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }).end(buffer);
  });
  return cloudinaryPromise;
}


const getCloudinaryUrlBymulter = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "auto",
    // folder: "pdf",
  });
  return result;
}


module.exports = { 
  getCloudinaryUrl, 
  getCloudinaryUrlByBase64,
  getCloudinaryUrlBymulter,
};