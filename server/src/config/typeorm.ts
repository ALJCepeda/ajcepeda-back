import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";
import User from "../models/User";
import Blog from "../models/Blog";
import TimelineEntry from "../../../shared/src/models/TimelineEntry";
import Log from "../models/Log";

export const typeORMConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || process.env.POSTGRES_USER,
  synchronize: true,
  logging: false,
  entities: [
    Log,
    User,
    Blog,
    TimelineEntry
  ]
};