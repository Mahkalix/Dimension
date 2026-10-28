import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthProvider } from "../auth/AuthProvider";
import { LogButton } from "./logbutton";

jest.mock("../auth/client", () => ({ preludeClient: null }));
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
function setup(overrides = {}) {
  const client = {
    refresh: jest.fn().mockRejectedValue(new Error("No session")),
    startOTP: jest.fn().mockResolvedValue(),
    checkOTP: jest.fn().mockResolvedValue(),
    retryOTP: jest.fn().mockResolvedValue(),
    logout: jest.fn().mockResolvedValue(), ...overrides,
  };
  render(<AuthProvider client={client}><LogButton /></AuthProvider>);
  return client;
}
async function sendCode() {
  fireEvent.click(await screen.findByRole("button", { name: "Log in" }));
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Send code" }));
  await screen.findByLabelText("Sign-in code");
}
test("verifies an OTP and restores the real SDK session before signing in", async () => {
  const client = setup();
  await sendCode();
  expect(client.startOTP).toHaveBeenCalledWith({ identifier: { type: "email_address", value: "listener@example.com" } });
  client.refresh.mockResolvedValue({ user: { accessToken: "test-token", profile: {} } });
  fireEvent.change(screen.getByLabelText("Sign-in code"), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify and sign in" }));
  expect(await screen.findByRole("button", { name: "Log out" })).toBeEnabled();
  expect(client.checkOTP).toHaveBeenCalledWith({ code: "123456" });
  fireEvent.click(screen.getByRole("button", { name: "Log out" }));
  await screen.findByRole("button", { name: "Log in" });
  expect(client.logout).toHaveBeenCalledTimes(1);
});
test("a rejected code never authenticates the user", async () => {
  setup({ checkOTP: jest.fn().mockRejectedValue(new Error("Wrong code")) });
  await sendCode();
  fireEvent.change(screen.getByLabelText("Sign-in code"), { target: { value: "000000" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify and sign in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("We could not sign you in");
  expect(screen.queryByRole("button", { name: "Log out" })).not.toBeInTheDocument();
});
test("restores an existing session on reload", async () => {
  setup({ refresh: jest.fn().mockResolvedValue({ user: { accessToken: "test-token" } }) });
  expect(await screen.findByRole("button", { name: "Log out" })).toBeEnabled();
});
test("missing configuration displays an unavailable state without sending an OTP", () => {
  render(<AuthProvider client={null}><LogButton /></AuthProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByRole("status")).toHaveTextContent("temporarily unavailable");
  expect(screen.queryByRole("button", { name: "Send code" })).not.toBeInTheDocument();
});
test("failed delivery keeps the email form available for retry", async () => {
  setup({ startOTP: jest.fn().mockRejectedValue(new Error("Rate limited")) });
  fireEvent.click(await screen.findByRole("button", { name: "Log in" }));
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "listener@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: "Send code" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("could not send");
  expect(screen.getByRole("button", { name: "Send code" })).toBeEnabled();
});
test("failed logout is reported rather than pretending the remote session was revoked", async () => {
  setup({ refresh: jest.fn().mockResolvedValue({ user: { accessToken: "test-token" } }),
    logout: jest.fn().mockRejectedValue(new Error("Offline")) });
  fireEvent.click(await screen.findByRole("button", { name: "Log out" }));
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("could not sign you out"));
  expect(screen.getByRole("button", { name: "Log out" })).toBeEnabled();
});
