﻿using Api.DAL.Entities;
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
        TEntity Update(TEntity entity);
        bool Delete(int id);
        UserCredentials getCredentialsByEmail(string email);
        IEnumerable<TEntity> GetBySearchCriteria(string sqlStatement);
        bool DeleteStrengthsAndWeaknesses(int player_ID);
        bool UpdateAdditionalInfo(Player entity);
        bool UpdateInfo(Player entity);
        bool UpdateStrengthsAndWeaknesses(Player entity);
        bool UpdateSportCV(Player entity);
        bool UpdateProfile(Player entity);
        bool UpdateVideo(Player entity);
    }
}
