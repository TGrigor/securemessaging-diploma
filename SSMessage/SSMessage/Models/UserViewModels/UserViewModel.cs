using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SSMessage.Models.UserViewModels
{
    public class UserViewModel
    {
        public long UserId { get; set; }
        public int UserMessageId { get; set; }
        public string UserName { get; set; }
        public string UserLastName { get; set; }
        public string UserEmail { get; set; }
        public int UserAge { get; set; }
    }
}
