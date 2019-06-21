using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IClubRepository<TEntity> : IRepository<TEntity> {
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPositionPreferenceValue(string sqlWhereStatementPreference,
                                                                            string sqlWhereStatementValue, string sqlSeason);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPoisitionPreference(string sqlWhereStatementPreference, string sqlSeason);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPoisitionValue(string sqlWhereStatementValue, string sqlSeason);
        bool UpdateInfo(Club entity);
        IEnumerable<TEntity> GetAll(string sql);
        bool UpdateTrainingHours(TrainingHours entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPosition(string sql);
        bool AddSquadPlayer(SquadPlayer entity, int club_ID);
        bool UpdateStaff(Club entity);
        bool UpdateValuesAndPreferences(Club entity);
        bool UpdateProfile(Club entity);
        bool UpdateFacility(Club entity);
        bool DeleteJobPosition(int jobPosition_ID, int club_ID);
        bool DeleteTrainingHours(string name, int club_ID);
        bool DeleteSquadPlayer(int squadPlayer_ID, int club_ID);
        bool AddOpenPosition(JobPosition entity, int club_ID);
        bool DeleteValuesAndPreferences(int club_ID);
        bool DeleteFacilityImage(string imagePath, int club_ID);
        List<SquadPlayer> GetNextSquadplayer(int club_ID);
        List<SquadPlayer> GetCurrentSquadplayer(int club_ID);
        List<JobPosition> GetOpenPositions(int id);
        List<TrainingHours> GetTrainingHours(int club_ID);
    }
}
