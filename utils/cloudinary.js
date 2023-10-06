import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv';

// Config
dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:true

});
export async function uploadImage(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'perfil',
    transformation: {
      width: 150,
      height: 150,
      crop: 'fill' // Redimensiona la imagen manteniendo la relación de aspecto original y rellenando el cuadro
    }
  });
}
export async function uploadFirma(filePath){
  return await cloudinary.uploader.upload(filePath,{
      folder: 'firmas',
      transformation: {  width:250 , height:250 }
    })
  
}
export async function uploadImageMotivo(filePath){
  return await cloudinary.uploader.upload(filePath,{
      folder: 'motivos',
    })
  
}
export async function uploadDocument(filePath){
  return await cloudinary.uploader.upload(filePath,{
      folder: 'documentos',

    })
}

export const deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId)
  }

export default cloudinary;