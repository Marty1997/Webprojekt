using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public interface IRepository<TEntity> {
        Func<IDbConnection> Connection { get; set; }
    
        TEntity Create(TEntity entity);
        IEnumerable<TEntity> GetAll();
        TEntity GetById(int id);
        TEntity GetByEmail(string email);
        void Insert(TEntity entity);
        bool Update(TEntity entity);
        int Delete(int id);
        void Save();
        UserCredentialscs getCredentialscsByEmail(string email);
    }
}
