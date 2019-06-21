using Api.DAL.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public static class RepositoryFactory<TEnitity> {
        public static IPlayerRepository<TEnitity> CreatePlayerRepos() {
            return new PlayerRepos() as IPlayerRepository<TEnitity>;
        }

        public static IClubRepository<TEnitity> CreateClubRepos() {
            return new ClubRepos() as IClubRepository<TEnitity> ;
        }
    }
}
