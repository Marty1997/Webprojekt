//using System;
//using Xunit;
//using Api.DAL;
//using Moq;
//using Api.DAL.Repos;
//using Api.DataTransferObjects;
//using System.Collections.Generic;
//using Api.DAL.Entities;
//using Api.BusinessLogic;

//namespace Test {
//    public class TestSearchForPlayers {
//        [Fact]
//        public void SearchForPlayersWithNoCriteria() {
//            //Arrange
//            var playerRepos = new Mock<IRepository<Player>>();
//            SearchCriteriaForPlayer sc = new SearchCriteriaForPlayer();
//            playerRepos.Setup(x => x.GetAll())
//                .Returns(new List<Player>
//                {
//                    new Player { Id = 1, Country = "Denmark" },
//                    new Player { Id = 2, Country = "Sweden" },
//                    new Player { Id = 3, Country = "Sweden" }
//                });

//            PlayerLogic pl = new PlayerLogic(null, playerRepos.Object, null);

//            var list = pl.HandleSearchAlgorithm(sc);

//            Assert.Equal(3, list.Count);
//        }

//        [Fact]
//        public void SearchForPlayersWithLeaugeAndCountry() {
//            //Arrange
//            var playerRepos = new Mock<IRepository<Player>>();
//            SearchCriteriaForPlayer sc = new SearchCriteriaForPlayer();
//            //sc.PrimaryPosition = "Playmaker";
//            //sc.League = "Second League";
//            //playerRepos.Setup(x => x.GetBySearchCriteria())
//                .Returns(new List<Player>
//                {
//                    new Player { Id = 1, Country = "Denmark", League = "First League", PrimaryPosition = "Left back" },
//                    new Player { Id = 2, Country = "Sweden", League = "Second League", PrimaryPosition = "Playmaker" },
//                    new Player { Id = 3, Country = "Sweden", League = "Third League", PrimaryPosition = "Pivot" }
//                });

//            PlayerLogic pl = new PlayerLogic(null, playerRepos.Object, null);

//            var list = pl.HandleSearchAlgorithm(sc);

//            Assert.Equal("Playmaker", list[1].PrimaryPosition);
//        }
//    }
//}
