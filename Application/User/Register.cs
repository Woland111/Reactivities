using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }

            public string Username { get; set; }

            public string Email { get; set; }

            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _context = context;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.Where(u => u.Email == request.Email).AnyAsync())
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email address already exists." });
                }

                if (await _context.Users.Where(u => u.UserName == request.Username).AnyAsync())
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username address already exists." });
                }

                var newUser = new AppUser
                {
                    DisplayName = request.DisplayName,
                    UserName = request.Username,
                    Email = request.Email
                };

                var result = await _userManager.CreateAsync(newUser, request.Password);
                if (result.Succeeded)
                {
                    return new User
                    {
                        DisplayName = newUser.DisplayName,
                        Token = _jwtGenerator.CreateToken(newUser),
                        Username = newUser.UserName,
                        Image = newUser.Photos.FirstOrDefault(p => p.IsMain)?.Url
                    };
                }

                throw new Exception("Problem creating user.");
            }
        }
    }
}