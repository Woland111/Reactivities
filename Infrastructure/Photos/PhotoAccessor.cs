using System;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account
            {
                Cloud = config.Value.CloudName,
                ApiKey = config.Value.APIKey,
                ApiSecret = config.Value.APISecret
            };
            _cloudinary = new Cloudinary(account);
        }

        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            var imageUploadResult = new ImageUploadResult();
            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    imageUploadResult = _cloudinary.Upload(new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                    });
                }
            }
            if (imageUploadResult.Error != null)
            {
                throw new Exception(imageUploadResult.Error.Message);
            }
            return new PhotoUploadResult
            {
                PublicId = imageUploadResult.PublicId,
                Url = imageUploadResult.SecureUri.AbsoluteUri
            };
        }

        public string RemovePhoto(string publicId)
        {
            var result = _cloudinary.Destroy(new DeletionParams(publicId));
            return result.Result == "ok" ? result.Result : null;
        }
    }
}