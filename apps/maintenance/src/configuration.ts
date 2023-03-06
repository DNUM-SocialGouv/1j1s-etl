export type StrapiConfiguration = {
  AUTHENTICATION_URL: string
  BASE_URL: string
  INTERNSHIP_URL: string
  PASSWORD: string
  USERNAME: string
}

type Configuration = {
  STRAPI_CONFIGURATION: StrapiConfiguration
}

export class ConfigurationFactory {
  public static create(): Configuration {
    const { getOrError } = ConfigurationFactory;

    return <Configuration>{
      STRAPI_CONFIGURATION: {
        AUTHENTICATION_URL: getOrError("STRAPI_AUTHENTICATION_URL"),
        BASE_URL: getOrError("STRAPI_BASE_URL"),
        INTERNSHIP_URL: getOrError("STRAPI_INTERNSHIP_URL"),
        PASSWORD: getOrError("STRAPI_PASSWORD"),
        USERNAME: getOrError("STRAPI_USERNAME"),
      },
    };
  }

  private static getOrDefault(environmentVariableKey: string, defaultValue: string): string {
    const environmentVariable = process.env[environmentVariableKey];
    if (!environmentVariable) {
      return defaultValue;
    }
    return environmentVariable;
  }

  private static getOrError(environmentVariableKey: string): string {
    const environmentVariable = process.env[environmentVariableKey];
    if (!environmentVariable) {
      throw new Error(`Environment variable with name ${environmentVariableKey} is unknown`);
    }
    return environmentVariable;
  }

  private static toBoolean(value: string): boolean {
    return value.trim().toLowerCase() === "true";
  }
}
