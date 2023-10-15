const processEnv = { ...process.env };

export function setupProcessEnv() {
  process.env = {
    ...processEnv,
    POSTGRES_USER: "fastserver",
    POSTGRES_PASSWORD: "fastserver",
    POSTGRES_HOST: "db",
    POSTGRES_PORT: "5434",
    POSTGRES_DB: "fastserver",
  };
}
