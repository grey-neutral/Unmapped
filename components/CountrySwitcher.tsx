import type { CountryCode } from "@/lib/types";

const countryOptions: Array<{ code: CountryCode; label: string; context: string }> = [
  { code: "GHA", label: "Ghana", context: "peri-urban repair and service economy" },
  { code: "BGD", label: "Bangladesh", context: "rural and agricultural transition economy" }
];

export function CountrySwitcher({
  value,
  onChange
}: {
  value: CountryCode;
  onChange: (countryCode: CountryCode) => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-line bg-canvas p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">Country Switcher</p>
      <p className="mt-2 text-sm leading-6 text-ink/70">
        Demo: switch from Ghana urban informal economy to Bangladesh rural/agricultural economy.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {countryOptions.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => onChange(option.code)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              value === option.code
                ? "border-teal bg-mist text-ink"
                : "border-line bg-white text-ink/75 hover:border-teal"
            }`}
          >
            <div className="font-semibold">{option.label}</div>
            <div className="mt-1 text-sm">{option.context}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
