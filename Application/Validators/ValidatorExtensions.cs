using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T,string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6).WithMessage("Password must have at least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least 1 upper case character")
                .Matches("[a-z]").WithMessage("Password must contain at least 1 lower case character")
                .Matches("[0-9]").WithMessage("Password must contain at least 1 number")
                .Matches("[^A-Za-z0-9]").WithMessage("Passowrd must contain at least 1 non-alphanumeric character");
            
            return options;
        }
    }
}