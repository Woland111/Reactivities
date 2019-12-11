using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
                var targetUser = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);
                if (targetUser == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });
                }
                var following = await _dataContext.Followings.SingleOrDefaultAsync(f => f.ObserverId == currentUser.Id && f.TargetId == targetUser.Id);
                if (following != null)
                {   
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You are already following this user" });
                }
                var userFollowing = new UserFollowing
                {
                    Observer = currentUser,
                    Target = targetUser
                };
                _dataContext.Followings.Add(userFollowing);
                var success = await _dataContext.SaveChangesAsync() > 0;
                if (!success)
                {
                    throw new Exception("Problem saving changes");
                }
                return Unit.Value;
            }
        }
    }
}