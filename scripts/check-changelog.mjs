#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const requiredFields = [
  "id",
  "area",
  "type",
  "title",
  "summary",
  "impact",
  "shippedAt",
  "shippedBy",
  "source",
  "relatedFiles",
  "tags",
  "includeInReport"
];

const validAreas = new Set(["website", "marketing"]);
const validTypes = new Set([
  "feature",
  "fix",
  "content",
  "analytics",
  "maintenance",
  "reporting"
]);

const now = new Date();
const localMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
const month = process.env.CHECK_CHANGELOG_MONTH || localMonth;
const changelogPath = `reports/changelog/${month}.json`;

const meaningfulSitePatterns = [
  /^.*\.html$/i,
  /^assets\/(css|js)\//i,
  /^blog\//i,
  /^Images\//i,
  /^llms(\/|\.txt$|-full\.txt$)/i,
  /^neighborhoods\//i,
  /^partials\//i,
  /^reviews\//i,
  /^seo\//i,
  /^services\//i,
  /^we-love-chicago\//i,
  /^robots\.txt$/i,
  /^sitemap\.xml$/i
];

const ignoredChangedPatterns = [
  /^AGENTS\.md$/i,
  /^reports\/changelog\//i,
  /^scripts\/check-changelog\.mjs$/i
];

function fail(message) {
  console.error(`Changelog check failed: ${message}`);
  process.exitCode = 1;
}

function normalizePath(path) {
  return path.replaceAll("\\", "/");
}

function getChangedFiles() {
  try {
    const output = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });

    return output
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const status = line.slice(0, 2);
        const rawPath = line.slice(3).trim();
        if (status.includes("R") || status.includes("C")) {
          return rawPath.split(" -> ").pop();
        }
        return rawPath;
      })
      .filter(Boolean)
      .map(normalizePath);
  } catch {
    return [];
  }
}

function isMeaningfulSiteFile(path) {
  if (ignoredChangedPatterns.some((pattern) => pattern.test(path))) {
    return false;
  }
  return meaningfulSitePatterns.some((pattern) => pattern.test(path));
}

if (!existsSync(changelogPath)) {
  fail(`${changelogPath} does not exist.`);
} else {
  let entries;

  try {
    entries = JSON.parse(readFileSync(changelogPath, "utf8"));
  } catch (error) {
    fail(`${changelogPath} is not valid JSON. ${error.message}`);
  }

  if (!Array.isArray(entries)) {
    fail(`${changelogPath} must contain a JSON array.`);
  } else {
    entries.forEach((entry, index) => {
      for (const field of requiredFields) {
        if (!(field in entry)) {
          fail(`Entry ${index} is missing required field "${field}".`);
        }
      }

      if (!validAreas.has(entry.area)) {
        fail(`Entry ${index} has invalid area "${entry.area}".`);
      }

      if (!validTypes.has(entry.type)) {
        fail(`Entry ${index} has invalid type "${entry.type}".`);
      }

      if (!Array.isArray(entry.relatedFiles)) {
        fail(`Entry ${index} field "relatedFiles" must be an array.`);
      }

      if (!Array.isArray(entry.tags)) {
        fail(`Entry ${index} field "tags" must be an array.`);
      }

      if (typeof entry.includeInReport !== "boolean") {
        fail(`Entry ${index} field "includeInReport" must be a boolean.`);
      }
    });
  }
}

const changedFiles = getChangedFiles();
const meaningfulChanges = changedFiles.filter(isMeaningfulSiteFile);
const changelogUpdated = changedFiles.includes(changelogPath);

if (meaningfulChanges.length > 0 && !changelogUpdated) {
  fail(
    `Meaningful site files changed without updating ${changelogPath}: ${meaningfulChanges.join(", ")}`
  );
}

if (!process.exitCode) {
  console.log(`Changelog check passed for ${changelogPath}.`);
}
