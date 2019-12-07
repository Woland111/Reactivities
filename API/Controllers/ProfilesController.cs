using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController: BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<UserProfileDto>> Get(string username)
        {
            return await Mediator.Send(new Details.Query { Username = username } );
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Change(Update.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}