using Api.DAL.Entities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {
    public class SortListByPercentage : IComparer {
        public int Compare(object x, object y) {
            Player p1 = (Player)x;
            Player p2 = (Player)y;

            if (p1.SearchPercentage < p2.SearchPercentage)
                return 1;
            if (p1.SearchPercentage > p2.SearchPercentage)
                return -1;
            else
                return 0;
        }

        public int CompareClub(Club c1, Club c2) {
            if(c1.SearchPercentage < c2.SearchPercentage) {
                return 1;
            } else if(c1.SearchPercentage > c2.SearchPercentage) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}
