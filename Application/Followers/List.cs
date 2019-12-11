using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<List<UserProfileDto>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserProfileDto>>
        {
            private readonly DataContext _dataContext;
            private readonly IProfileReader _profileReader;
            public Handler(DataContext dataContext, IProfileReader profileReader)
            {
                _profileReader = profileReader;
                _dataContext = dataContext;
            }

            public async Task<List<UserProfileDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var queryable = _dataContext.Followings.AsQueryable();
                var userFollowings = new List<UserFollowing>();
                var profiles = new List<UserProfileDto>();
                switch (request.Predicate)
                {
                    case "followers":
                        userFollowings = await queryable.Where(f => f.Target.UserName == request.Username).ToListAsync();
                        foreach (UserFollowing uf in userFollowings)
                        {
                            profiles.Add(await _profileReader.ReadProfile(uf.Observer.UserName));
                        }
                        break;
                    case "following":
                        userFollowings = await queryable.Where(uf => uf.Observer.UserName == request.Username).ToListAsync();
                        foreach (UserFollowing uf in userFollowings)
                        {
                            profiles.Add(await _profileReader.ReadProfile(uf.Target.UserName));
                        }
                        break;
                }
                return profiles;
            }
        }
    }
}