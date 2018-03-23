const pgp = require("pg-promise")({});

const connectionURL = "postgres://localhost:5432/ewokagram";
const connection = pgp(connectionURL);

module.exports = connection;
