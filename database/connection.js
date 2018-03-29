const pgp = require("pg-promise")({});

const connectionURL =
  process.env.DATABASE_URL || "postgres://localhost:5432/ewokagram";
const connection = pgp(connectionURL);

module.exports = connection;
