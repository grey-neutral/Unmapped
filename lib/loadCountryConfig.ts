import { countryConfigModules } from "@/lib/dataSources";
import type { CountryCode, CountryConfig } from "@/lib/types";

export function loadCountryConfig(countryCode: CountryCode): CountryConfig {
  const moduleSet = countryConfigModules[countryCode];

  return {
    ...(moduleSet.country as CountryConfig),
    educationMapping: moduleSet.education as CountryConfig["educationMapping"],
    laborMarketSignals: moduleSet.labor as CountryConfig["laborMarketSignals"],
    automationCalibration: moduleSet.automation as CountryConfig["automationCalibration"],
    opportunityTypes: moduleSet.opportunityTypes as string[],
    language: moduleSet.language as CountryConfig["language"]
  };
}
