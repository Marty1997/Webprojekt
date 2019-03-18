using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Projekt.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult PlayerDashboard() {
            return View();
        }

        public ActionResult ClubDashboard() {
            return View();
        }

        public ActionResult SearchForPlayers() {
            return View();
        }

        public ActionResult SearchForClubs() {
            return View();
        }
    }
}
