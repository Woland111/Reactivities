using System.Threading.Tasks;

namespace Application.Profiles
{
    public interface IProfileReader
    {
         Task<UserProfileDto> ReadProfile(string username);
    }
}