using System.Linq;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class FollowingResolver : IValueResolver<UserActivity, AttendeeDto, bool>
    {
        private readonly IUserAccessor _userAccessor;
        private readonly DataContext _dataContext;
        public FollowingResolver(IUserAccessor userAccessor, DataContext dataContext)
        {
            _dataContext = dataContext;
            _userAccessor = userAccessor;
        }

        public bool Resolve(UserActivity source, AttendeeDto destination, bool destMember, ResolutionContext context)
        {
            var currentUser = _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername()).Result;
            var following = _dataContext.Followings.FirstOrDefaultAsync(f => f.TargetId == source.AppUserId && f.ObserverId == currentUser.Id).Result;
            return following != null;
        }
    }
}