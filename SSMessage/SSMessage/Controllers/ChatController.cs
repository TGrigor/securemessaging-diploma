using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SSMessage.Models;
using SSMessage.Models.UserViewModels;

namespace SSMessage.Controllers
{
    [Authorize]
    public class ChatController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public ChatController(UserManager<ApplicationUser> userManager,
                    SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;

        }

        public IActionResult Index()
        {
            var users = _userManager.Users.ToList();
            var user = users.Select(u => new UserViewModel()
            {
                UserName = u.UserName
            }).ToList();
            ViewData["Users"] = user;
            return View();
        }
    }
}