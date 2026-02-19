export type DashboardMicrosoftState =
  | "showcase"
  | "authenticating"
  | "connected"
  | "connected_service_error"
  | "auth_error"
  | "disconnected";

type DashboardMicrosoftStateArgs = {
  showcaseMode: boolean;
  graphAuthLoading: boolean;
  graphConnected: boolean;
  graphAuthError: boolean;
  graphServiceError: boolean;
};

export function deriveDashboardMicrosoftState({
  showcaseMode,
  graphAuthLoading,
  graphConnected,
  graphAuthError,
  graphServiceError,
}: DashboardMicrosoftStateArgs): DashboardMicrosoftState {
  if (showcaseMode) return "showcase";
  if (graphAuthLoading) return "authenticating";
  if (graphConnected && graphServiceError) return "connected_service_error";
  if (graphConnected) return "connected";
  if (graphAuthError) return "auth_error";
  return "disconnected";
}
