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
        Club UpdateClubInfo(Club entity);
        Club UpdateTrainingHours(TrainingHours entity);
        IEnumerable<TEntity> GetBySearchCriteriaWithJobPosition(string sqlWhereStatementJobposition);
        IEnumerable<TEntity> GetBySearchCriteriaWithPreference(string sqlWhereStatementPreference);
        IEnumerable<TEntity> GetBySearchCriteriaWithValue(string sqlWhereStatementValue);
    }
}
