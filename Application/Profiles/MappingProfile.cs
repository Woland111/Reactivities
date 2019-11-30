using AutoMapper;
using Domain;

namespace Application.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppUser, UserProfileDto>();
        }
    }
}