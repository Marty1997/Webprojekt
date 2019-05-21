using System;
using Xunit;
using Api.DAL;
using Moq;
using Api.DAL.Repos;
using Api.DataTransferObjects;
using System.Collections.Generic;
using Api.DAL.Entities;
using Api.BusinessLogic;

namespace Test {
    public class TestSearchForClubs {
        [Fact]
        public void SearchForClubWithNoCriteria() {
            //Arrange
            var clubRepos = new Mock<IClubRepository<Club>>();
            ClubSearchCriteria cc = new ClubSearchCriteria();
            clubRepos.Setup(x => x.GetAll())
                .Returns(new List<Club>
                {
                    new Club { Id = 1, Country = "Denmark" },
                    new Club { Id = 2, Country = "Sweden" },
                    new Club { Id = 3, Country = "Sweden" }
                });

            ClubLogic cl = new ClubLogic(null, clubRepos.Object, null, null);

            var list = cl.HandleClubSearchAlgorithm(cc, 0);

            Assert.Equal(3, list.Count);
        }
    }
}
