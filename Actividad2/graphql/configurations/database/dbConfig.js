const dbConfig = {
    INFRACTION_DB_HOST: process.env.INFRACTION_DB_HOST || "localhost",
    INFRACTION_DB_USER: process.env.INFRACTION_DB_USER || "root",
    INFRACTION_DB_PASSWORD: process.env.INFRACTION_DB_PASSWORD || "root",
    INFRACTION_DB_DATABASE: process.env.INFRACTION_DB_DATABASE || "infracciones_db",
    INFRACTION_DB_PORT: process.env.INFRACTION_DB_PORT || "3000",
};

export default dbConfig;