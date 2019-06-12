using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IRepository<TEntity> {
        Func<IDbConnection> Connection { get; set; }
        bool Create(TEntity entity);
        IEnumerable<TEntity> GetAll();
        TEntity GetById(int id);
        TEntity GetByEmail(string email);
        TEntity Update(TEntity entity);
        int Delete(int id);
        IEnumerable<TEntity> GetBySearchCriteria(string sqlStatement);
        string GetEmailByID(int id);
    }
}
