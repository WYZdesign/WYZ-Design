import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PaginatedSection from "./PaginatedSection";

describe("PaginatedSection", () => {
  const items = ["One", "Two", "Three", "Four", "Five"];

  const renderSection = () => render(
    <PaginatedSection
      items={items}
      getItemKey={(item) => item}
      renderItem={(item) => <article>{item}</article>}
      label="Featured work"
      itemsPerPage={2}
    />
  );

  it("shows a focused first page and disables Previous", () => {
    renderSection();

    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
    expect(screen.queryByText("Three")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByText(/Showing 1 through 2 of 5/)).toBeInTheDocument();
  });

  it("moves through pages and keeps controls bounded", () => {
    renderSection();
    const next = screen.getByRole("button", { name: "Next" });

    fireEvent.click(next);
    expect(screen.getByText("Three")).toBeInTheDocument();
    expect(screen.getByText("Four")).toBeInTheDocument();

    fireEvent.click(next);
    expect(screen.getByText("Five")).toBeInTheDocument();
    expect(next).toBeDisabled();
    expect(screen.getByText(/Showing 5 through 5 of 5/)).toBeInTheDocument();
  });

  it("uses the supplied empty state without pagination controls", () => {
    render(
      <PaginatedSection
        items={[] as string[]}
        getItemKey={(item) => item}
        renderItem={(item) => <article>{item}</article>}
        label="Featured work"
        emptyState="No work is available."
      />
    );

    expect(screen.getByText("No work is available.")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
