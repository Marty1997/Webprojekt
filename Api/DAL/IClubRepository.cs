using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IClubRepository<TEntity> : IRepository<TEntity> {
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPositionPreferenceValue(string sqlWhereStatementJobposition,
                                                                            string sqlWhereStatementPreference,
                                                                            string sqlWhereStatementValue);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPoisitionPreference(string sqlWhereStatementJobposition,
                                                                        string sqlWhereStatementPreference);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPoisitionValue(string sqlWhereStatementJobposition,
                                                                   string sqlWhereStatementValue);
        IEnumerable<TEntity> GetBySearchCriteriaWithPreferenceValue(string sqlWhereStatementPreference,
                                                                 string sqlWhereStatementValue);
        bool UpdateInfo(Club entity);
        bool UpdateTrainingHours(TrainingHours entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPosition(string sqlWhereStatementJobposition);
        bool AddSquadPlayer(SquadPlayer entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithPreference(string sqlWhereStatementPreference);
        bool AddOpenPosition(JobPosition entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithValue(string sqlWhereStatementValue);
        bool UpdateStaff(Club entity);
        bool CheckIfEmailExists(string email);
        bool UpdateValuesAndPreferences(Club entity);
        bool UpdateProfile(Club entity);
        bool UpdateFacility(Club entity);
        bool DeleteJobPosition(int jobPosition_ID, int club_ID);
        bool DeleteTrainingHours(int trainingHours_ID, int club_ID);
        bool DeleteSquadPlayer(int squadPlayer_ID, int club_ID);
        bool DeleteValuesAndPreferences(int club_ID);
    }
}
