using System.Threading.Tasks;
using Application.User;

namespace Application.Interfaces
{
    public interface IFacebookAccessor
    {
         public Task<FacebookUserInfo> FacebookLogin(string accessToken);
    }
}