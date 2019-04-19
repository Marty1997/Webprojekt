using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL {
    public static class RepositoryExtensions {
        public static IRepository<TEntity> With<TEntity>(this IRepository<TEntity> repository, Func<IDbConnection> connectionFactory) {
            repository.Connection = connectionFactory;
            return repository;
        }
    }
}
