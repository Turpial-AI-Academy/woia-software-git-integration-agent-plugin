# Failure Recovery

## General rule

Do not patch Git history until something appears green.

Identify the first causal integration problem, preserve evidence, and recover at the correct layer.

## Target moved

If the target HEAD changes after review or preflight:

1. record the old and new target heads;
2. recompute the relevant merge base/context;
3. determine whether policy requires an update/rebase/queue refresh;
4. assess whether prior evidence remains valid;
5. perform only the authorized reconciliation;
6. rerun affected validation if context changed materially;
7. integrate against the actual current target.

Do not hide target movement by reporting the old base.

## Conflict

When a merge/rebase/squash path conflicts:

- record conflicted paths;
- do not reuse old evidence automatically;
- resolve only in scope and only when authorized;
- treat conflict resolution as a mutation;
- compare resolved content against reviewed intent;
- rerun affected review/testing evidence;
- verify zero unresolved index entries before continuing.

Return CONFLICT_BLOCKED when safe resolution requires product/owner input or exceeds authorization.

## Evidence mismatch

If review/test artifacts refer to a different source HEAD than the integration source:

- stop;
- identify which source was actually reviewed/tested;
- do not relabel the evidence;
- either restore the exact covered source or produce new evidence for the intended source.

Return EVIDENCE_REVALIDATION_REQUIRED when new evidence is needed.

## Partial local mutation

If an integration command starts but does not complete:

- detect the active Git operation;
- preserve diagnostic state;
- choose continue or abort based on policy and authorization;
- never start a second integration operation on top of an unknown partial state.

After abort, verify that pre-existing work was restored before retrying.

## Partial remote mutation

A provider-managed operation can leave durable state, for example:

- PR merged but local branch stale;
- queue accepted but not completed;
- target ref updated while cleanup failed;
- branch deleted after successful merge.

Do not repeat a merge blindly.

Re-query remote truth, classify what already happened, then resume only the missing safe steps.

## Force push

Never use force push as an automatic conflict or rebase recovery technique.

If repository policy explicitly requires rewriting an unpublished source branch, obtain authorization and prefer the safest supported force-with-lease style. Record the old and new source identities and invalidate evidence as appropriate.

Never rewrite a published release/tag history under this capability.

## Cleanup failure

If integration succeeds but branch/hygiene cleanup cannot complete:

- keep the successful integration evidence;
- report the cleanup blocker separately;
- do not undo correct integrated history merely to achieve cosmetic cleanliness;
- only delete branches or temporary refs when policy and authorization permit.

The final result cannot be INTEGRATED_VERIFIED if required integration-attributable hygiene remains unresolved.
