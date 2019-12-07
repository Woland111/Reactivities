using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(c => c.DisplayName, m => m.MapFrom(c => c.Author.DisplayName))
                .ForMember(c => c.Image, m => m.MapFrom(c => c.Author.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(c => c.Username, m => m.MapFrom(c => c.Author.UserName));
        }
    }
}