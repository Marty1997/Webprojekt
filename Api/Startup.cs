﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
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
            services.AddTransient<Account>();
            services.AddTransient<UserCredentialsLogic>();
            services.AddTransient<PlayerLogic>();
            services.AddTransient<ClubLogic>();
            services.AddTransient<IRepository<Player>>(s => {
                return RepositoryFactory<Player>.CreatePlayerRepos().With(() => {
                    var conn = new SqlConnection(Configuration.GetConnectionString("DefaultConnection"));
                    conn.Open();
                    return conn;
                });
            });
            services.AddTransient<IRepository<Club>>(s => {
                return RepositoryFactory<Club>.CreateClubRepos().With(() => {
                    var conn = new SqlConnection(Configuration.GetConnectionString("DefaultConnection"));
                    conn.Open();
                    return conn;
                });
            });

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            //Tokens
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddAuthentication(x => {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            //.AddFacebook(facebookOptions => {
            //    facebookOptions.AppId = "";
            //    facebookOptions.AppSecret = "";
            //})
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
                c.AddPolicy(AllowOrigin, options => options.WithOrigins("http://localhost:4200/").AllowAnyOrigin()
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
            app.UseCors(AllowOrigin);
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseMvc();
            
        }
    }
}
