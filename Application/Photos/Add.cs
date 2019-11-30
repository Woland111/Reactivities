using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Photo>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(IPhotoAccessor photoAccessor, DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                var result = _photoAccessor.AddPhoto(request.File);
                var photo = new Photo
                {
                    Id = result.PublicId,
                    Url = result.Url,
                };
                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
                if (!user.Photos.Any(p => p.IsMain))
                {
                    photo.IsMain = true;
                }
                user.Photos.Add(photo);
                var success = await _context.SaveChangesAsync() > 0;
                if (success)
                {
                    return photo;
                }
                throw new Exception("Problem saving photo.");
            }
        }
    }
}