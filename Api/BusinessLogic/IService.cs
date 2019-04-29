using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.BusinessLogic {
    public interface IService<TEntity> {
        
        TEntity Create(TEntity entity);
    }
}
