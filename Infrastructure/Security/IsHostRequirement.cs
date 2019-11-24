using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext context, IUserAccessor userAccessor, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _userAccessor = userAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var user = _context.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername()).Result;
            var activityId = Guid.Parse(((AuthorizationFilterContext)(context.Resource)).RouteData.Values["id"].ToString());
            var attendance = _context.UserActivity.SingleOrDefaultAsync(ua => ua.AppUserId == user.Id && ua.ActivityId == activityId && ua.IsHost);
            if (attendance != null) 
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}