using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(r => r.Body).NotEmpty().WithMessage("Comment Body must not be empty.");
            }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _mapper = mapper;
                _dataContext = dataContext;
            }

            async Task<CommentDto> IRequestHandler<Command, CommentDto>.Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Activity= "Not Found" });
                }
                var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == request.Username);
                var comment = new Comment
                {
                    Body = request.Body,
                    Author = user,
                    Activity = activity,
                    CreatedAt = DateTime.Now
                };
                activity.Comments.Add(comment);
                var success = await _dataContext.SaveChangesAsync() > 0;
                if (success)
                {
                    return _mapper.Map<Comment, CommentDto>(comment);
                }
                throw new Exception("Problem creating comment.");
            }
        }
    }
}