using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext dataContext, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _dataContext = dataContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Photo = "Not found" });
                }
                if (photo.IsMain)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Photo = "You cannot delete your main photo" });
                }
                var result = _photoAccessor.RemovePhoto(photo.Id);
                if (result == null)
                {
                    throw new Exception("Problem deleting photo");
                }
                user.Photos.Remove(photo);
                var success = await _dataContext.SaveChangesAsync() > 0;
                if (success)
                {

                    return Unit.Value;
                }
                throw new Exception("Problem deleting photo");
            }
        }
    }
}