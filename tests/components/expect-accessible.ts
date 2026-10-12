import axe, { type RuleObject } from "axe-core";
import { expect } from "vitest";

const JSDOM_DISABLED_RULES: RuleObject = {
  "color-contrast": { enabled: false },
  region: { enabled: false },
};

export const expectAccessible = async (
  container: Element,
  extraRules: RuleObject = {},
) => {
  const results = await axe.run(container, {
    rules: { ...JSDOM_DISABLED_RULES, ...extraRules },
  });

  const violations = results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help}\n  ${violation.nodes
        .map((node) => node.html)
        .join("\n  ")}`,
  );

  expect(violations).toEqual([]);
};
