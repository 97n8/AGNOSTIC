export type EnvironmentId = "publiclogic" | "phillipston";

export type Environment = {
  id: EnvironmentId;
  name: string;
  description: string;
  route: string;
};

export const ENVIRONMENTS: Environment[] = [
  {
    id: "publiclogic",
    name: "PublicLogic",
    description: "Front door and shared modules (M365-connected).",
    route: "/dashboard",
  },
  {
    id: "phillipston",
    name: "Phillipston",
    description: "Legacy demo screens (kept for reference).",
    route: "/phillipston/prr",
  },
];

export function getEnvironment(id: string | undefined) {
  return ENVIRONMENTS.find((e) => e.id === id) ?? null;
}
