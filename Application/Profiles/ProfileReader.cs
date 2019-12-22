using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;
        private readonly IMapper _mapper;
        public ProfileReader(DataContext dataContext, IUserAccessor userAccessor, IMapper mapper)
        {
            _mapper = mapper;
            _userAccessor = userAccessor;
            _dataContext = dataContext;
        }

        public async Task<UserProfileDto> ReadProfile(string username)
        {
            var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if (user == null)
            {
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });
            }
            var userProfile = new UserProfileDto 
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = user.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                Photos = user.Photos,
                Bio = user.Bio,
                FollowersCount = user.Followers.Count,
                FollowingCount = user.Followings.Count
            };
            var currentUser = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetCurrentUsername());
            userProfile.IsFollowed = user.Followers.Any(f => f.ObserverId == currentUser.Id);
            return userProfile;
        }
    }
}