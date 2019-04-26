﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {

    // Class used for giving an error message
    public static class ErrorHandling {

        public static string Exception(SqlException e) {
            string errorMessage = "";
            switch (e.Number) {
                case 53:
                    errorMessage = "Der er ikke forbindelse til databasen";
                    break;
                case 8178:
                    errorMessage = "Ressourcen du prøver at tilgå findes ikke";
                    break;

                default:
                    errorMessage = "Der er sket en ukendt fejl";
                    break;
            }
            return errorMessage;
        }   
    }
}
