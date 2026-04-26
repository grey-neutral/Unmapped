import type { CountryConfig } from "@/lib/types";

export function ConfigDebugger({ config }: { config: CountryConfig }) {
  return (
    <details className="rounded-[1.5rem] border border-line bg-canvas p-4">
      <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
        Config inspector for {config.countryName}
      </summary>
      <div className="mt-4 grid gap-3 text-sm text-ink/75 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="font-semibold text-ink">Education mapping</p>
          <p className="mt-2">
            Secondary credential: <span className="font-medium">{config.secondaryCredentialName}</span>
          </p>
          <p className="mt-1">Default context: {config.defaultCityContext}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="font-semibold text-ink">Automation calibration</p>
          <p className="mt-2">Connectivity constraint: {config.automationCalibration.connectivityConstraint}</p>
          <p className="mt-1">Informality adjustment: {config.automationCalibration.informalityAdjustment}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="font-semibold text-ink">Opportunity types</p>
          <p className="mt-2">{config.opportunityTypes.join(", ")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="font-semibold text-ink">Language pack</p>
          <p className="mt-2">Default language: {config.language.defaultLanguage}</p>
          <p className="mt-1">{config.language.lowBandwidthNote}</p>
        </div>
      </div>
    </details>
  );
}
