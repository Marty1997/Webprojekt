using Api.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Api.DAL.Repos {
    public class PlayerRepos : IRepository<Player> {
        
        public Func<IDbConnection> Connection { get; set; }

        public Player Create(Player entity) {
            throw new NotImplementedException();
        }

        public int Delete(int id) {
            throw new NotImplementedException();
        }

        public IEnumerable<Player> GetAll() {
            throw new NotImplementedException();
        }

        public Player GetByEmail(string email) {
            throw new NotImplementedException();
        }

        public Player GetById(int id) {
            throw new NotImplementedException();
        }

        public UserCredentialscs getCredentialscsByEmail(string email) {
            throw new NotImplementedException();
        }

        public void Insert(Player entity) {
            throw new NotImplementedException();
        }

        public void Save() {
            throw new NotImplementedException();
        }

        public bool Update(Player entity) {
            throw new NotImplementedException();
        }
    }
}
