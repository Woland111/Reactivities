using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class NotAttend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
                var attendance = await _context.UserActivity.SingleOrDefaultAsync(ua => ua.AppUserId == user.Id && ua.ActivityId == request.Id);
                if (attendance == null)
                {
                    return Unit.Value;
                }
                if (attendance.IsHost)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Attendance = "Host cannot be removed from activity." });
                }
                _context.UserActivity.Remove(attendance);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Error cancelling attendance.");
            }
        }
    }
}