using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IClub<Club> {
        IEnumerable<Club> GetBySearchCriteriaWithJobPositionPreferenceValue(string sqlWhereStatementJobposition, 
                                                                            string sqlWhereStatementPreference, 
                                                                            string sqlWhereStatementValue);
        IEnumerable<Club> GetBySearchCriteriaWithJobPoisitionPreference(string sqlWhereStatementJobposition,
                                                                        string sqlWhereStatementPreference);
        IEnumerable<Club> GetBySearchCriteriaWithJobPoisitionValue(string sqlWhereStatementJobposition,
                                                                   string sqlWhereStatementValue);
        IEnumerable<Club> GetBySearchCriteriaWithPreferenceValue(string sqlWhereStatementPreference,
                                                                 string sqlWhereStatementValue);
        IEnumerable<Club> GetBySearchCriteriaWithJobPosition(string sqlWhereStatementJobposition);
        IEnumerable<Club> GetBySearchCriteriaWithPreference(string sqlWhereStatementPreference);
        IEnumerable<Club> GetBySearchCriteriaWithValue(string sqlWhereStatementValue);
    }
}
