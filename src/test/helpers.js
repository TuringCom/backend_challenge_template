import models, { sequelize } from '../database/models';

function truncateTable(modelName) {
  return models[modelName].destroy({
    where: {},
    force: true,
    truncate: {
      cascade: true,
    },
    logging: true,
  });
}

// eslint-disable-next-line import/prefer-default-export
export function createTables() {
  return sequelize.sync({ force: true, logging: true }); // DROP TABLE IF EXISTS, then CREATE TABLES
}

export default async function truncate(model) {
  if (model) {
    return truncateTable(model);
  }

  return Promise.all(
    Object.keys(models).map(key => {
      if (['sequelize', 'Sequelize'].includes(key)) return null;
      return truncateTable(key);
    })
  );
}
