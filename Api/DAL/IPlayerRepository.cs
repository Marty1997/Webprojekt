using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IPlayerRepository<TEntity> : IRepository<TEntity> {
        bool DeleteStrengthsAndWeaknesses(int player_ID);
        bool UpdateAdditionalInfo(Player entity);
        IEnumerable<TEntity> GetAll();
        bool UpdateInfo(Player entity);
        bool UpdateStrengthsAndWeaknesses(Player entity);
        bool UpdateSportCV(Player entity);
        bool UpdateProfile(Player entity);
        bool UpdateVideo(Player entity);
        bool AddNationalTeam(NationalTeam entity, int player_ID);
        bool DeleteNationalTeam(int nationalTeam_ID, int player_ID);
        List<NationalTeam> GetNationalTeams(int id);
    }
}
