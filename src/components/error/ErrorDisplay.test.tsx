import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorDisplay from "./ErrorDisplay";

describe("ErrorDisplay", () => {
  it("renders nothing when error is null", () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the error message", () => {
    render(<ErrorDisplay error={new Error("Boom")} />);
    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  it("prefers the override message over error.message", () => {
    render(<ErrorDisplay error={new Error("Boom")} message="Custom message" />);
    expect(screen.getByText("Custom message")).toBeInTheDocument();
    expect(screen.queryByText("Boom")).not.toBeInTheDocument();
  });

  it("falls back to a default when both message and error.message are empty", () => {
    render(<ErrorDisplay error={new Error("")} />);
    expect(
      screen.getByText("An unexpected error occurred"),
    ).toBeInTheDocument();
  });

  it("only renders the retry button when onRetry is provided", () => {
    const { rerender } = render(<ErrorDisplay error={new Error("x")} />);
    expect(screen.queryByRole("button", { name: /try again/i })).toBeNull();

    rerender(<ErrorDisplay error={new Error("x")} onRetry={() => {}} />);
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it("invokes onRetry when the retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorDisplay error={new Error("x")} onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
