---
name: git-integration
description: Integrates reviewed and tested source changes into a repository according to its effective Git policy, with verifiable evidence and reconciled final state. Use when finalizing a feature branch or pull request, proving that a tested source HEAD reached the target branch, handling rebase or squash identity changes, reconciling evidence after conflicts or target movement, or verifying Git integration hygiene.
license: MIT
compatibility: Requires Git access to the target repository. Remote-provider access is needed only when effective policy or final-state proof depends on pull requests, protected branches, merge queues, or server-side rulesets.
metadata:
  author: Turpial AI Academy
  version: "0.5.7"
---

# git-integration

## Operating flow

~~~text
DISCOVER
  -> DECIDE
  -> IMPLEMENT
  -> VALIDATE
  -> REPORT
~~~

## Purpose

Take an exact source state that has review/testing evidence and integrate it into the intended target according to the repository's effective Git policy, while preserving or deliberately re-establishing evidence continuity.

The capability ends in a reconciled Git state with explicit proof of what was integrated, how it relates to the reviewed/tested source, what evidence is still valid, what had to be rerun, and whether integration-attributable hygiene is clean.

It can operate standalone or satisfy ASPS git-integration/v1.

## Inputs

Expect, or discover and make explicit:

- the source HEAD intended for integration;
- review/testing evidence and the exact source state it covers;
- the intended target branch/ref;
- repository and remote integration policy;
- authorization boundaries for merge/rebase/squash/push/branch cleanup;
- any pre-existing dirty state or unrelated repository work.

If the source HEAD or evidence identity is ambiguous, stop before integration and resolve the ambiguity.

## Output

Produce integration evidence containing:

- exact source HEAD/tree and reviewed delta identity;
- target branch and target base observed before integration;
- effective integration policy and evidence for it;
- integration method actually used;
- final target HEAD/tree;
- proof connecting reviewed/tested source to the final integrated state;
- evidence reused, invalidated, and rerun;
- conflict-resolution or target-movement reconciliation;
- integration-attributable hygiene result;
- remaining risks/blockers;
- one final result status.

## Non-negotiable rules

- Discover policy before mutating Git history or target refs.
- Anchor every claimed review/test result to the exact source state it actually covered.
- Never assume the author's preferred merge strategy is repository policy.
- Do not treat a changed commit SHA as automatic evidence loss; rebase and squash intentionally rewrite identities.
- Do not treat content similarity as automatic proof; demonstrate source-to-final continuity with repository evidence.
- Any conflict resolution or manual edit during integration is a new mutation and may invalidate prior evidence.
- Target movement must be reconciled before claiming that old evidence still proves the final state.
- Record pre-existing dirty state; do not clean unrelated work to manufacture a clean integration report.
- Do not silently force-push, delete branches, bypass protections, rewrite published history, or cross another authorization boundary.
- A skipped, stale, historical, or different-HEAD check is not current evidence.
- Only INTEGRATED_VERIFIED satisfies the successful integration gate.

## Bounded continuation

Use this path when durable review/testing and integration evidence identify a healthy exact source HEAD/tree, reviewed delta, target context, and effective policy, and a current preflight confirms those inputs remain applicable.

1. Locate the authoritative evidence. Re-anchor source and target refs, trees, dirty/index/interrupted-operation state, and required remote policy/PR/queue state before relying on it.
2. Inspect the affected integration delta and required context. Preserve unrelated valid evidence; do not replay full history or whole-repository review when exact identity and continuity already establish unchanged surfaces.
3. Prove ancestry for preserved identity or content/delta equivalence for rewritten identity using the method-appropriate evidence. A changed SHA alone does not invalidate content-equivalent evidence.
4. Reconcile only materially invalidated review/testing evidence, while freshly running or observing every mandatory final-state and post-integration check required by policy.
5. Record final target HEAD/tree, continuity proof, evidence reused/invalidated/rerun, current attributable hygiene, and uncertainty. If integration is already verified on the same state, verify that state instead of repeating the merge.

Load references for the affected policy, continuity method, validation obligation, or failure. A new invocation alone does not require rebuilding a healthy policy/history map.

## Deep path

Use the complete procedure below for new or missing evidence, unclear source/target identity or scope, conflicting/unfamiliar policy, target movement or environment drift, conflicts/manual edits/generated or dependency changes, missing continuity proof, or a failed invariant. Expand context for material public API/event/schema, persisted data/migration, auth/signature/security, deployment/rollback, or cross-provider interactions. Re-establish affected evidence before claiming integration success.

## Evidence lifecycle

Reuse only durable, inspectable review/testing evidence whose source/tree/delta, inputs, context, and required obligations remain valid. Reconcile rewritten identity explicitly; prose claims and recollection are not proof. Invalidate the affected evidence after material mutation or target-context change, preserve unaffected evidence, and rerun the smallest sufficient checks on the reconciled final state. Mutable refs, index/status, required remote policy/PR state, and mandatory post-integration checks need current observation or execution; cached policy is not proof of current protections.

## Discover

For the deep path, read [GIT_INTEGRATION_STANDARD.md](references/GIT_INTEGRATION_STANDARD.md), [POLICY_DISCOVERY.md](references/POLICY_DISCOVERY.md), and [EVIDENCE_CONTINUITY.md](references/EVIDENCE_CONTINUITY.md). For bounded continuation, load only the guidance needed for an affected decision or unresolved proof.

Establish the exact local state first:

- repository root and current branch;
- source HEAD and tree;
- source branch/ref when one exists;
- target branch/ref and its current HEAD;
- merge base relevant to the reviewed change;
- staged, unstaged, untracked, and unresolved-index state;
- remotes and upstream relationships;
- active worktrees/submodules when relevant;
- existing integration/review/testing evidence and which SHA/tree it names.

Then discover effective policy from repository-owned and remote-owned evidence as applicable:

- repository instructions and contribution/release docs;
- branch protection, rulesets, merge queue requirements, required reviews/checks, or signed-commit rules;
- pull-request configuration and enabled merge methods;
- explicit task/user authorization;
- recent accepted integration behavior when documentation is incomplete.

Local Git preferences such as pull.rebase, merge.ff, or a developer's global configuration are operator defaults, not repository policy by themselves.

Record unknown policy surfaces. If a server-side rule is material but cannot be inspected, return POLICY_BLOCKED rather than inventing it.

## Decide

Use the smallest integration method that is both authorized and consistent with effective repository policy.

Possible methods include:

- fast-forward;
- merge commit;
- rebase followed by fast-forward;
- squash;
- merge queue / provider-managed merge;
- another explicitly supported repository flow.

Do not rank these methods in the abstract.

Before integration, classify evidence continuity:

### DIRECT

The reviewed/tested source commit can remain reachable unchanged in final history, such as a permitted fast-forward or merge-commit flow.

### REWRITTEN_EQUIVALENT

Commit identities may change, such as rebase or squash, but the reviewed change can be proven equivalent in the integrated result without material semantic edits.

### REVALIDATION_REQUIRED

Integration, target movement, conflict resolution, manual edits, generated output changes, or another mutation materially changes what prior evidence covered.

### BLOCKED

Required policy, authorization, source identity, target state, or evidence is unresolved.

Use [EVIDENCE_CONTINUITY.md](references/EVIDENCE_CONTINUITY.md) when evidence is reused across rewritten identities; retain an already-established matching proof instead of replaying unrelated history.

## Implement

Only mutate after policy, source identity, target, and authorization are explicit.

General rules:

1. preserve the exact source reference long enough to prove what was reviewed/tested;
2. refresh target state immediately before integration when the target can move;
3. apply only the permitted integration operation;
4. do not mix unrelated cleanup/refactors into conflict resolution;
5. if conflict resolution changes reviewed content, mark affected evidence stale;
6. avoid destructive history operations unless the repository flow explicitly requires and authorizes them;
7. record the resulting target HEAD immediately after the operation.

When integration is provider-managed, the implementation step may be a remote merge/queue action rather than a local Git command. The same evidence requirements still apply.

## Validate

Load [FINAL_STATE_VERIFICATION.md](references/FINAL_STATE_VERIFICATION.md) for the applicable final-state obligations and [FAILURE_RECOVERY.md](references/FAILURE_RECOVERY.md) when a failure or uncertain recovery requires it. The required final-state invariants apply on both paths.

Validation must prove the actual integrated state, not merely that an integration command exited zero.

Verify, as applicable:

- the intended target ref now resolves to the final integrated HEAD;
- the final tree is recorded;
- source commit ancestry when the method preserves source identity;
- content/delta equivalence when rebase/squash/provider rewriting replaces source commit identities;
- the exact relationship between reviewed delta and integrated delta;
- required remote PR/queue/ruleset state;
- zero unresolved index entries or conflict markers;
- integration-attributable staged/unstaged/untracked residue is absent;
- pre-existing unrelated dirty state is unchanged or explicitly accounted for;
- affected review/testing evidence is still valid, or proportionate checks were rerun against the new final state;
- repository-specific post-integration checks required by policy actually ran.

Useful Git evidence may include exact SHAs/trees, merge-base relationships, ancestry checks, range comparisons, path/content diffs, provider PR metadata, and final target-ref resolution. A patch-id may support equivalence for suitable non-merge patches but is not universal proof for every integration shape.

If the final integrated state differs materially from the state covered by evidence, do not infer PASS. Revalidate proportionally.

## Report

Use [integration-report.template.md](assets/integration-report.template.md) and, when machine-readable handoff is useful, [integration-evidence.template.json](assets/integration-evidence.template.json).

Report:

1. source branch/ref, exact source HEAD/tree, and reviewed base;
2. review/testing evidence with exact identity;
3. target branch/ref and target base before integration;
4. effective integration policy and its sources;
5. authorization boundary crossed, if any;
6. integration method actually used;
7. final target HEAD/tree;
8. source-to-final continuity proof;
9. target movement and conflicts encountered;
10. evidence reused, invalidated, and rerun;
11. integration-attributable hygiene and pre-existing dirty state;
12. remote PR/queue/ruleset verification when applicable;
13. remaining risks/blockers;
14. one result status.

Allowed result statuses:

~~~text
INTEGRATION_READY
INTEGRATED_VERIFIED
EVIDENCE_REVALIDATION_REQUIRED
POLICY_BLOCKED
CONFLICT_BLOCKED
BLOCKED
~~~

INTEGRATION_READY means pre-integration discovery is complete but the integration boundary has not yet been crossed.

Only INTEGRATED_VERIFIED means the reviewed/tested change is demonstrably integrated and reconciled.

## Detailed references

- [Git Integration Standard](references/GIT_INTEGRATION_STANDARD.md)
- [Policy Discovery](references/POLICY_DISCOVERY.md)
- [Evidence Continuity](references/EVIDENCE_CONTINUITY.md)
- [Final State Verification](references/FINAL_STATE_VERIFICATION.md)
- [Failure Recovery](references/FAILURE_RECOVERY.md)
