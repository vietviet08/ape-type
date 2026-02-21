#!/usr/bin/env node

import { execSync } from "node:child_process";

const DEFAULT_VERSION = "0.0.1";
const SEMVER_RE = /^v?(\d+)\.(\d+)\.(\d+)$/;

function parseVersion(tag) {
  const match = tag.match(SEMVER_RE);
  if (!match) {
    return null;
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function compareVersion(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function incrementVersion(current) {
  let { major, minor, patch } = current;

  patch += 1;
  if (patch >= 10) {
    patch = 0;
    minor += 1;
  }

  if (minor >= 10) {
    minor = 0;
    major += 1;
  }

  return `${major}.${minor}.${patch}`;
}

function getTags() {
  const cliTags = process.argv.slice(2).map((value) => value.trim()).filter(Boolean);
  if (cliTags.length > 0) {
    return cliTags;
  }

  const output = execSync("git tag --list", { encoding: "utf8" });
  return output
    .split(/\r?\n/g)
    .map((value) => value.trim())
    .filter(Boolean);
}

function main() {
  const tags = getTags();

  const versions = tags
    .map((tag) => parseVersion(tag))
    .filter((value) => value !== null);

  if (versions.length === 0) {
    process.stdout.write(DEFAULT_VERSION);
    return;
  }

  let latest = versions[0];
  for (const version of versions.slice(1)) {
    if (compareVersion(version, latest) > 0) {
      latest = version;
    }
  }

  process.stdout.write(incrementVersion(latest));
}

main();
