import { describe, expect, it } from "vitest";
import { deriveDashboardMicrosoftState } from "./dashboardMicrosoftState";

describe("deriveDashboardMicrosoftState", () => {
  it("returns showcase for showcase mode", () => {
    expect(
      deriveDashboardMicrosoftState({
        showcaseMode: true,
        graphAuthLoading: false,
        graphConnected: false,
        graphAuthError: false,
        graphServiceError: false,
      })
    ).toBe("showcase");
  });

  it("returns authenticating while auth is loading", () => {
    expect(
      deriveDashboardMicrosoftState({
        showcaseMode: false,
        graphAuthLoading: true,
        graphConnected: false,
        graphAuthError: false,
        graphServiceError: false,
      })
    ).toBe("authenticating");
  });

  it("returns connected when token is valid and services are healthy", () => {
    expect(
      deriveDashboardMicrosoftState({
        showcaseMode: false,
        graphAuthLoading: false,
        graphConnected: true,
        graphAuthError: false,
        graphServiceError: false,
      })
    ).toBe("connected");
  });

  it("returns connected_service_error when token is valid but calendar failed", () => {
    expect(
      deriveDashboardMicrosoftState({
        showcaseMode: false,
        graphAuthLoading: false,
        graphConnected: true,
        graphAuthError: false,
        graphServiceError: true,
      })
    ).toBe("connected_service_error");
  });

  it("returns auth_error when authentication fails", () => {
    expect(
      deriveDashboardMicrosoftState({
        showcaseMode: false,
        graphAuthLoading: false,
        graphConnected: false,
        graphAuthError: true,
        graphServiceError: false,
      })
    ).toBe("auth_error");
  });

  it("returns disconnected when no auth token exists", () => {
    expect(
      deriveDashboardMicrosoftState({
        showcaseMode: false,
        graphAuthLoading: false,
        graphConnected: false,
        graphAuthError: false,
        graphServiceError: false,
      })
    ).toBe("disconnected");
  });
});
