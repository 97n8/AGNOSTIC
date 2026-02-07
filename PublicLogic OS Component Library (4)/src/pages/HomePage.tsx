import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Scale, Archive, Landmark } from "lucide-react";

import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { focusStyles } from "@/components/focusStyles";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: 0.06 * i },
  }),
};

export function HomePage() {
  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* subtle structural grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/5 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="max-w-3xl"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                Governance engineering
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-100">
                Massachusetts
              </Badge>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-800" />
                System posture: Operational
              </span>
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Structure is care.
            </h1>

            <p className="mt-5 text-pretty text-lg leading-relaxed text-slate-700">
              PublicLogic is a practitioner-led governance engineering practice. We
              move risk from people to structure by encoding authority, institutional
              memory, and compliance into the work itself.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/discovery"
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-xl",
                  "bg-emerald-800 px-5 py-3 text-sm font-medium text-white",
                  "shadow-sm shadow-emerald-900/10 hover:bg-emerald-700",
                  "transition-colors",
                  focusStyles,
                ].join(" ")}
              >
                Discovery
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/writing"
                className={[
                  "inline-flex items-center justify-center gap-2 rounded-xl",
                  "border border-slate-200 bg-white/70 px-5 py-3 text-sm font-medium text-slate-900",
                  "backdrop-blur hover:bg-white",
                  "transition-colors",
                  focusStyles,
                ].join(" ")}
              >
                Registry
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </motion.div>

          {/* principles */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            {[
              {
                icon: Scale,
                title: "Authority must be explicit",
                body: "Decision rights, delegation, and accountability are defined and enforced in the work.",
              },
              {
                icon: Archive,
                title: "Institutional memory survives turnover",
                body: "Records, rationale, and outcomes remain legible when people change.",
              },
              {
                icon: Landmark,
                title: "Compliance is automatic, not heroic",
                body: "Deadlines, retention posture, and defensibility are structurally supported.",
              },
            ].map((p, i) => (
              <motion.div key={p.title} variants={fadeUp} custom={i + 1}>
                <Card className="h-full border border-slate-200 bg-white/70 p-5 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-2">
                      <p.icon className="h-4 w-4 text-emerald-800" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {p.title}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-700">
                        {p.body}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FRAMEWORK INDEX */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <SectionHeader
          title="Where the work lives determines risk"
          subtitle="We embed authority and defensibility into structure—without exposing proprietary internals."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            <motion.div variants={fadeUp} custom={0}>
              <Card className="h-full border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Badge className="border border-slate-200 bg-slate-50 text-slate-700">
                      CASE™
                    </Badge>
                    <span className="text-xs font-medium text-slate-500">
                      case-based authority & workflow
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  A disciplined way to hold authority, decisions, and work artifacts in a
                  case container so obligations remain legible and defensible.
                </p>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            <motion.div variants={fadeUp} custom={1}>
              <Card className="h-full border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Badge className="border border-emerald-100 bg-emerald-50 text-emerald-800">
                    VAULT™
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">
                    institutional records & compliance
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  A proprietary compliance framework that protects institutional records,
                  timelines, and defensibility through governed structure.
                </p>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            <motion.div variants={fadeUp} custom={2}>
              <Card className="h-full border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <Badge className="border border-slate-200 bg-slate-50 text-slate-700">
                    ABA™
                  </Badge>
                  <span className="text-xs font-medium text-slate-500">
                    adaptive boundary architecture
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  A board–administration boundary standard: explicit authority, controlled
                  handoffs, and durable governance under turnover.
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* CTAs (reinforce routing integrity) */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Start with the Registry.
            </div>
            <div className="mt-1 text-sm text-slate-700">
              Doctrine, briefings, and institutional essays—written for public officials.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/writing"
              className={[
                "inline-flex items-center justify-center gap-2 rounded-xl",
                "border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900",
                "hover:bg-white/70 transition-colors",
                focusStyles,
              ].join(" ")}
            >
              Registry
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Link>
            <Link
              to="/discovery"
              className={[
                "inline-flex items-center justify-center gap-2 rounded-xl",
                "bg-emerald-800 px-4 py-2 text-sm font-medium text-white",
                "hover:bg-emerald-700 transition-colors",
                focusStyles,
              ].join(" ")}
            >
              Discovery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
