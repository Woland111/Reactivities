using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<UserProfileDto>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, UserProfileDto>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _mapper = mapper;
                _dataContext = dataContext;
            }

            public async Task<UserProfileDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);
                var userProfile = _mapper.Map<AppUser, UserProfileDto>(user);
                userProfile.Image = userProfile.Photos.FirstOrDefault(p => p.IsMain)?.Url;
                return userProfile;
            }
        }
    }
}