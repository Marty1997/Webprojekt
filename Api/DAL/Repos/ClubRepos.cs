using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Repos {
    public class ClubRepos : IRepository<Club> {
        public Func<IDbConnection> Connection { get; set; }

        public Club Create(Club entity) {
            throw new NotImplementedException();
        }

        public int Delete(int id) {
            throw new NotImplementedException();
        }

        public IEnumerable<Club> GetAll() {
            throw new NotImplementedException();
        }

        public Club GetById(int id) {
            throw new NotImplementedException();
        }

        public void Insert(Club entity) {
            throw new NotImplementedException();
        }

        public void Save() {
            throw new NotImplementedException();
        }

        public bool Update(Club entity) {
            throw new NotImplementedException();
        }
    }
}
