using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(a => a.Username, o => o.MapFrom(ua => ua.AppUser.UserName))
                .ForMember(a => a.DisplayName, o => o.MapFrom(ua => ua.AppUser.DisplayName))
                .ForMember(a => a.Image, o => o.MapFrom(ua => ua.AppUser.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(a => a.Following, o => o.MapFrom<FollowingResolver>());
        }
    }
}