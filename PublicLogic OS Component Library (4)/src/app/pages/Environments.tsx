import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { ENVIRONMENTS } from "../environments";

const ENV_LABELS: Record<string, string> = {
  publiclogic: "PublicLogic",
  phillipston: "Phillipston PRR",
};

const ENV_DESCRIPTIONS: Record<string, string> = {
  publiclogic: "Core operations workspace for capture, inbox, tools, and governance controls.",
  phillipston:
    "Dedicated PRR environment: resident submissions, staff intake, case management, and SharePoint archiving (M.G.L. c. 66 §10).",
};

export default function Environments() {
  return (
    <div>
      <PageHeader
        title="Environments"
        subtitle="Launch town environments and internal modules from a single front door."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {ENVIRONMENTS.map((environment) => (
          <Card key={environment.id} className="rounded-3xl border-slate-200 p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
              Environment
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {ENV_LABELS[environment.id] ?? environment.name}
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-600">
              {ENV_DESCRIPTIONS[environment.id] ?? environment.description}
            </div>
            <div className="mt-6">
              <Link
                to={environment.route}
                className="inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
              >
                Open →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
