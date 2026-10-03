# Evidence Continuity

## Purpose

Determine whether review/testing evidence attached to a source state still proves the final integrated state.

## Minimum evidence record

Before integration, capture:

~~~text
source_ref
source_head
source_tree
reviewed_base
reviewed_delta_scope
review_evidence[]
test_evidence[]
target_ref
target_head_observed
~~~

Each review/test item should identify the SHA/tree/delta it actually covered when that information exists.

## Continuity classes

### DIRECT

Use when the reviewed source commit remains reachable unchanged in final target history and no material integration mutation occurred.

Typical proof:

- exact source SHA recorded;
- final target ref resolves expected HEAD;
- ancestry shows source SHA reachable from final target;
- no conflict/manual mutation invalidated evidence;
- required final checks pass.

### REWRITTEN_EQUIVALENT

Use when source commit identity changes but the integrated change is demonstrably equivalent.

Possible evidence includes:

- reviewed source delta versus final integrated delta;
- exact path/content comparison;
- stable patch identity for suitable non-merge changes;
- range comparison for rebased commit series;
- final tree relationships;
- provider metadata showing the authorized rewrite method.

No single technique is universal. Use the representation appropriate to the integration shape.

A patch-id is supporting evidence for suitable patches, not proof for every merge, rename, binary, generated, or context-sensitive change.

### REVALIDATION_REQUIRED

Use whenever the final result differs materially from what existing evidence covered.

Triggers include:

- conflict resolution changed content;
- manual fixup during rebase/squash;
- target movement introduced behavioral interaction;
- regenerated files changed;
- lock/dependency resolution changed;
- tests/build behavior depends on the new target context;
- the final integrated delta cannot be shown equivalent to the reviewed delta.

Mark affected evidence stale and rerun proportionately against the reconciled state.

## Reviewed delta

The reviewed source is not always a single commit.

For a feature branch, identify the relevant base and aggregate source delta rather than assuming only source_head^..source_head matters.

Record enough information to reconstruct what reviewers/testers actually saw.

## Rebase

A clean rebase rewrites commit identities.

Do not fail merely because old SHAs disappeared.

Verify:

- the intended commit series/change survived;
- no conflict/manual edit materially changed the reviewed delta;
- target movement did not invalidate contextual evidence;
- the resulting rebased state passes required final checks.

If conflicts were resolved, assume revalidation is required unless evidence proves the resolution was non-material to all affected checks.

## Squash

A squash intentionally collapses multiple source commits.

Verify the aggregate reviewed delta against the squash result. Commit-by-commit ancestry cannot prove equivalence because the original commits are absent by design.

## Merge commit

When source SHA is preserved, ancestry is strong continuity evidence, but the merge result can still introduce interaction with target changes.

If the merge required conflict resolution or the combined tree changes behavior not exercised by prior tests, rerun affected checks.

## Fast-forward

Fast-forward normally preserves source identity and is the simplest continuity case.

Still verify:

- the correct target ref moved;
- it moved to the expected integrated state;
- no unrelated local residue remains;
- remote policy was satisfied.

## Provider-managed integration

A Git host may synthesize merge/squash commits.

Record provider-side PR/queue result, final target SHA, and the method used. Then apply the same identity-preserving versus identity-rewriting proof rules.

## Evidence reuse decision

For every prior evidence item classify:

~~~text
REUSED
STALE
RERUN_PASS
RERUN_FAIL
UNAVAILABLE
~~~

Explain why.

Reuse requires durable, inspectable evidence and proof that the covered inputs, context, and obligations remain valid. An unchanged tree can support reuse, but does not prove remote policy, target interactions, signature requirements, or external runtime inputs stayed unchanged. Preserve unrelated valid evidence and revalidate only materially invalidated surfaces plus mandatory final-state/post-integration invariants. Record fresh execution separately from reused execution; assumptions and recollection are not evidence.

Never silently carry evidence across a materially different final state.
