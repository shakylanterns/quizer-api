import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { getDataSourceConfig } from "../src/data-source";

dotenv.config({
  path: ".env.test"
});

let source: DataSource | null;

const getDataSource = async () => {
  if (!source) {
    source = new DataSource(
      getDataSourceConfig(process.env.DB_NAME) as DataSourceOptions
    );
    await source.initialize();
  }
  return source;
};

const destoryDataSource = async () => {
  if (source.isInitialized) {
    await source.destroy();
    source = null;
  }
};

beforeEach(async () => {
  const src = await getDataSource();
  const entities = src.entityMetadatas;

  for (const entity of entities) {
    const repository = src.getRepository(entity.name);
    await repository.query(
      `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`
    );
  }
});

afterAll(async () => {
  await destoryDataSource();
});
