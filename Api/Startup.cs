using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Api.BusinessLogic;
using Api.DAL;
using Api.DAL.Entities;
using Api.DAL.Repos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Api {
    public class Startup {
        readonly string AllowOrigin = "allowOrigin";
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            //Dependency injections
            services.AddTransient<Authentication>();
            services.AddTransient<PlayerLogic>();
            services.AddTransient<ClubLogic>();
            services.AddTransient<IPlayerRepository<Player>>(s => {
                return RepositoryFactory<Player>.CreatePlayerRepos().WithPlayer(() => {
                    var conn = new SqlConnection(Configuration.GetConnectionString("DefaultConnection"));
                    conn.Open();
                    return conn;
                });
            });
            services.AddTransient<IClubRepository<Club>>(s => {
                return RepositoryFactory<Club>.CreateClubRepos().WithClub(() => {
                    var conn = new SqlConnection(Configuration.GetConnectionString("DefaultConnection"));
                    conn.Open();
                    return conn;
                });
            });

            services.AddDbContext<AuthenticationContext>(options => options.UseSqlServer
                                           (Configuration.GetConnectionString("DefaultConnection")));
            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
            });

            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromMinutes(10);
            });

            services.AddDefaultIdentity<User>().AddEntityFrameworkStores<AuthenticationContext>();


            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            //Tokens
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddAuthentication(x => {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x => {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            }); ;

            services.AddCors(c => {
                c.AddPolicy(AllowOrigin, options => options.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
            });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            }
            else {
                app.UseHsts();
            }
            
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions() {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseCors(AllowOrigin);
            app.UseMvc();
        }
    }
}
