using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IClubRepository<TEntity> : IRepository<TEntity> {
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPositionPreferenceValue(string sqlWhereStatementPreference,
                                                                            string sqlWhereStatementValue);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPoisitionPreference(string sqlWhereStatementPreference);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPoisitionValue(string sqlWhereStatementValue);
        IEnumerable<TEntity> GetBySearchCriteriaWithPreference(string sqlWhereStatementPreference);
        IEnumerable<TEntity> GetBySearchCriteriaWithValue(string sqlWhereStatementValue);
        bool UpdateInfo(Club entity);
        bool UpdateTrainingHours(TrainingHours entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPosition();
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
        IEnumerable<TEntity> GetBySearchCriteriaWithPreferenceValue(string sqlPreference, string sqlValue);
    }
}
