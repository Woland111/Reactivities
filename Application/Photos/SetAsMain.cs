using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Linq;
using System.Net;
using Application.Errors;
using System;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
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
                var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
                if (currentMain != null)
                {
                    currentMain.IsMain = false;
                }
                photo.IsMain = true;
                var success = await _dataContext.SaveChangesAsync() > 0;
                if (success) 
                {
                    return Unit.Value;
                }
                throw new Exception("Problem setting a photo as main");
            }
        }
    }
}