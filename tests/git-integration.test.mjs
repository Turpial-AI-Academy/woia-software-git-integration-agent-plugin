import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");

const skillRoot = path.join(ROOT, "skills", "git-integration");

test("skill preserves discover-decide-implement-validate-report order", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const discover = skill.indexOf("## Discover");
  const decide = skill.indexOf("## Decide");
  const implement = skill.indexOf("## Implement");
  const validate = skill.indexOf("## Validate");
  const report = skill.indexOf("## Report");
  assert.ok(discover >= 0 && decide > discover && implement > decide && validate > implement && report > validate);
});

test("policy discovery is repository-first and does not confuse local defaults with policy", async () => {
  const policy = await readFile(path.join(skillRoot, "references", "POLICY_DISCOVERY.md"), "utf8");
  assert.match(policy, /Server-enforced repository policy/);
  assert.match(policy, /Repository-owned instructions/);
  assert.match(policy, /Pull-request state/);
  assert.match(policy, /Local operator defaults/);
  assert.match(policy, /do not by themselves establish organization or repository policy/i);
  assert.match(policy, /POLICY_BLOCKED/);
});

test("integration strategy remains neutral across merge and rewrite methods", async () => {
  const standard = await readFile(path.join(skillRoot, "references", "GIT_INTEGRATION_STANDARD.md"), "utf8");
  assert.match(standard, /does not globally rank integration strategies/i);
  for (const method of ["fast-forward", "merge commit", "rebase", "squash", "merge queue"]) {
    assert.match(standard, new RegExp(method.replace("-", "\\-"), "i"));
  }
  assert.match(standard, /Repository policy wins over author preference/i);
});

test("evidence continuity distinguishes preserved identity from rewritten equivalence", async () => {
  const continuity = await readFile(path.join(skillRoot, "references", "EVIDENCE_CONTINUITY.md"), "utf8");
  assert.match(continuity, /### DIRECT/);
  assert.match(continuity, /### REWRITTEN_EQUIVALENT/);
  assert.match(continuity, /### REVALIDATION_REQUIRED/);
  assert.match(continuity, /A clean rebase rewrites commit identities/i);
  assert.match(continuity, /A squash intentionally collapses multiple source commits/i);
  assert.match(continuity, /patch-id is supporting evidence.*not proof for every/i);
});

test("conflicts and material integration mutations invalidate evidence proportionally", async () => {
  const standard = await readFile(path.join(skillRoot, "references", "GIT_INTEGRATION_STANDARD.md"), "utf8");
  const recovery = await readFile(path.join(skillRoot, "references", "FAILURE_RECOVERY.md"), "utf8");
  assert.match(standard, /conflict resolution/);
  assert.match(standard, /Rerun the smallest sufficient affected review\/testing checks/i);
  assert.match(recovery, /treat conflict resolution as a mutation/i);
  assert.match(recovery, /Return CONFLICT_BLOCKED/);
});

test("target movement is reconciled instead of hidden behind stale evidence", async () => {
  const standard = await readFile(path.join(skillRoot, "references", "GIT_INTEGRATION_STANDARD.md"), "utf8");
  const recovery = await readFile(path.join(skillRoot, "references", "FAILURE_RECOVERY.md"), "utf8");
  assert.match(standard, /The target can change between review and integration/i);
  assert.match(standard, /Branch was green yesterday.*not proof of today's integrated state/is);
  assert.match(recovery, /record the old and new target heads/i);
  assert.match(recovery, /integrate against the actual current target/i);
});

test("final verification proves target identity, continuity and clean attributable state", async () => {
  const verification = await readFile(path.join(skillRoot, "references", "FINAL_STATE_VERIFICATION.md"), "utf8");
  assert.match(verification, /final target HEAD/);
  assert.match(verification, /final target tree/);
  assert.match(verification, /git merge-base --is-ancestor/);
  assert.match(verification, /git ls-files -u/);
  assert.match(verification, /git diff --check/);
  assert.match(verification, /zero unexplained integration-attributable residue/i);
});

test("integration does not silently use destructive history operations", async () => {
  const standard = await readFile(path.join(skillRoot, "references", "GIT_INTEGRATION_STANDARD.md"), "utf8");
  const recovery = await readFile(path.join(skillRoot, "references", "FAILURE_RECOVERY.md"), "utf8");
  assert.match(standard, /Never silently:/);
  assert.match(standard, /force-push/);
  assert.match(standard, /bypass branch protection/);
  assert.match(standard, /rewrite published tags\/history/);
  assert.match(recovery, /Never use force push as an automatic conflict or rebase recovery technique/i);
});

test("report template separates source, policy, final state, continuity, validation and hygiene", async () => {
  const report = await readFile(path.join(skillRoot, "assets", "integration-report.template.md"), "utf8");
  const source = report.indexOf("## 2. Source evidence");
  const policy = report.indexOf("## 4. Effective policy");
  const finalState = report.indexOf("## 6. Final target state");
  const continuity = report.indexOf("## 7. Source-to-final continuity proof");
  const validation = report.indexOf("## 9. Final validation");
  const hygiene = report.indexOf("## 10. Integration hygiene");
  assert.ok(source >= 0 && policy > source && finalState > policy && continuity > finalState && validation > continuity && hygiene > validation);
});

test("machine-readable evidence template covers the git-integration contract boundary", async () => {
  const evidence = JSON.parse(await readFile(path.join(skillRoot, "assets", "integration-evidence.template.json"), "utf8"));
  assert.equal(evidence.schema, "com.turpial.git-integration-evidence/v1");
  assert.deepEqual(Object.keys(evidence.source), [
    "ref", "head", "tree", "reviewed_base", "reviewed_delta", "review_evidence", "test_evidence"
  ]);
  assert.ok("head_final" in evidence.target);
  assert.ok("continuity_proof" in evidence.integration);
  assert.ok("evidence_reconciliation" in evidence);
  assert.ok("integration_attributable_residue" in evidence.hygiene);
  assert.ok("target_ref_verified" in evidence.remote);
});

test("only integrated verified is defined as the successful completed integration", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  for (const status of [
    "INTEGRATION_READY",
    "INTEGRATED_VERIFIED",
    "EVIDENCE_REVALIDATION_REQUIRED",
    "POLICY_BLOCKED",
    "CONFLICT_BLOCKED",
    "BLOCKED",
  ]) {
    assert.match(skill, new RegExp("^" + status + "$", "m"));
  }
  assert.match(skill, /Only INTEGRATED_VERIFIED means the reviewed\/tested change is demonstrably integrated/i);
});

test("bounded continuation reuses exact evidence while retaining current Git and continuity invariants", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const bounded = skill.split("## Bounded continuation\n")[1]?.split("## Deep path\n")[0];
  assert.ok(bounded);
  for (const obligation of [
    /durable.*exact source HEAD\/tree/is, /reviewed delta/i, /target context/i,
    /effective policy/i, /Re-anchor source and target/i, /dirty\/index\/interrupted/i,
    /remote policy\/PR\/queue/i, /Preserve unrelated valid evidence/i,
    /ancestry/i, /content\/delta equivalence/i, /mandatory.*post-integration/is,
    /final target HEAD\/tree/i, /attributable hygiene/i,
  ]) assert.match(bounded, obligation);
  assert.match(bounded, /do not replay full history/i);
  assert.match(bounded, /already verified.*instead of repeating the merge/is);
  assert.match(bounded, /references.*affected/is);
});

test("deep continuation handles material mutations, target drift and unproven integration", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const deep = skill.split("## Deep path\n")[1]?.split("## Evidence lifecycle\n")[0];
  assert.ok(deep);
  for (const risk of [
    /missing evidence/i, /unclear.*identity/is, /conflicting.*policy/is,
    /target movement/i, /environment drift/i, /conflicts.*manual edits/i,
    /dependency changes/i, /missing continuity proof/i, /failed invariant/i,
    /public.*schema/i, /persisted.*migration/i, /auth.*security/i,
    /deployment.*rollback/i, /cross-provider/i,
  ]) assert.match(deep, risk);
});

test("durable evidence reuse preserves unaffected proof and distinguishes fresh required observations", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const lifecycle = skill.split("## Evidence lifecycle\n")[1]?.split("## Discover\n")[0];
  const continuity = await readFile(path.join(skillRoot, "references", "EVIDENCE_CONTINUITY.md"), "utf8");
  assert.ok(lifecycle);
  assert.match(lifecycle, /durable.*inspectable/is);
  assert.match(lifecycle, /prose claims.*not proof/is);
  assert.match(lifecycle, /Invalidate the affected evidence.*preserve unaffected.*rerun/is);
  assert.match(lifecycle, /Mutable refs.*current observation or execution/is);
  assert.match(continuity, /fresh execution separately from reused execution/i);
  assert.match(continuity, /unchanged tree.*does not prove remote policy/is);
});
