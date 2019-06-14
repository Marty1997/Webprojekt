using Api.DAL.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Repos {
    public class AuthenticationContext : IdentityDbContext {

        public DbSet<User> User { get; set; }

        public AuthenticationContext(DbContextOptions options):base(options) {

        }
    }
}
