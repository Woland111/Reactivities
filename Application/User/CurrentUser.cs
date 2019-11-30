using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User> { }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(
                IUserAccessor userAccessor,
                UserManager<AppUser> userManager,
                IJwtGenerator jwtGenerator)
            {
                _userAccessor = userAccessor;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetCurrentUsername());
                if (user == null)
                {
                    throw new RestException(HttpStatusCode.Unauthorized);
                }
                return new User
                {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    Username = user.UserName,
                    Image = user.Photos.FirstOrDefault(p => p.IsMain)?.Url
                };
            }
        }
    }
}