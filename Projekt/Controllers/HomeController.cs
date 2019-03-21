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

        //Homepage
        public ActionResult abcdef12394raksHome() {
            return View();
        }

        //PlayerDashboard
        public ActionResult ajsnd2888s8jjPlayerDashboard() {
            return View();
        }

        //ClubDashboard
        public ActionResult k2klmmlk2mlkClubDashboard() {
            return View();
        }

        //SearchforPLayers
        public ActionResult klm2klmlakmsl2SearchForPlayers() {
            return View();
        }

        //SearchforClubs
        public ActionResult lkaslkm2lkmSearchForClubs() {
            return View();
        }
    }
}
