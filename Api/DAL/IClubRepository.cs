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
        void UpdateInfo(Club entity);
        void UpdateTrainingHours(TrainingHours entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPosition(string sqlWhereStatementJobposition);
        void AddSquadPlayer(SquadPlayer entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithPreference(string sqlWhereStatementPreference);
        void AddOpenPosition(JobPosition entity, int club_ID);
        IEnumerable<TEntity> GetBySearchCriteriaWithValue(string sqlWhereStatementValue);
        void UpdateStaff(Club entity);
        bool CheckIfEmailExists(string email);
        void UpdateValuesAndPreferences(Club entity);
        void UpdateProfile(Club entity);
        void UpdateFacility(Club entity);
        void DeleteJobPosition(int jobPosition_ID, int club_ID);
        void DeleteTrainingHours(int trainingHours_ID, int club_ID);
        void DeleteSquadPlayer(int squadPlayer_ID, int club_ID);
    }
}
