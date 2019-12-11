using System.Threading;
using System.Threading.Tasks;
using MediatR;

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
            private readonly IProfileReader _profileReader;
            public Handler(IProfileReader profileReader)
            {
                _profileReader = profileReader;
            }

            public async Task<UserProfileDto> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _profileReader.ReadProfile(request.Username);
            }
        }
    }
}