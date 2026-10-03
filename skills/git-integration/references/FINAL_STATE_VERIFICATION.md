# Final State Verification

## Principle

Integration proof targets the final repository state, not the command that attempted to create it.

## Final identity

Record:

- target ref;
- target HEAD before integration;
- final target HEAD;
- final target tree;
- source HEAD/tree;
- integration method;
- provider PR/queue identity when applicable.

Resolve the target ref again after integration. Do not assume the local checked-out branch is authoritative for a remote integration.

## Source-to-final proof

Choose proof appropriate to the method.

### Source identity preserved

Verify ancestry from the exact reviewed source HEAD to final target HEAD.

Typical Git evidence:

~~~text
git merge-base --is-ancestor <source-head> <final-head>
~~~

An exit code showing ancestry is evidence, not the whole report.

### Source identity rewritten

Use content/delta evidence instead of original-SHA ancestry.

Depending on the change, inspect:

- aggregate diff from reviewed base to source head;
- aggregate diff introduced into the final target;
- exact changed paths and bytes where practical;
- range comparison for rebased series;
- stable patch identity where appropriate;
- final tree and provider metadata.

Explain why the chosen proof is sufficient for this repository/change.

## Repository state checks

Inspect at least the Git surfaces relevant to the operation.

Useful checks include:

~~~text
git status --porcelain=v2 --branch
git ls-files -u
git diff --check
git rev-parse <target-ref>
git rev-parse <final-head>^{tree}
~~~

Also detect interrupted operations such as merge, rebase, cherry-pick, or revert state when applicable.

Zero unresolved index entries is required.

## Conflict markers

git ls-files -u proves whether the index still has unresolved entries.

Also use repository tests/build/linters or targeted content inspection when conflict-marker-like text could remain in tracked files even after the index is resolved.

Do not blindly reject every literal marker token in fixtures or documentation without context.

## Dirty state

Capture dirty state before integration.

After integration distinguish:

- pre-existing unrelated state;
- expected target movement;
- integration-created residue;
- intentional post-integration changes separately authorized.

INTEGRATED_VERIFIED requires zero unexplained integration-attributable residue.

A pre-existing unrelated dirty file should be reported, not silently deleted.

## Remote state

When integration occurs through a pull request or merge queue, verify provider-side facts such as:

- PR merged state;
- actual base/head/result SHAs;
- queue completion;
- required check/review satisfaction when visible;
- final remote target ref.

Local success cannot substitute for an incomplete provider-managed merge.

## Post-integration validation

Re-run checks when prior evidence became stale.

Select proportionately from repository-owned validation:

- targeted tests;
- unit/integration/contract/E2E suites;
- build/typecheck/lint;
- package/archive checks;
- migration/schema validation;
- repository release/doctor checks.

Record what actually ran and its final-state identity.

## Pass criteria

INTEGRATED_VERIFIED requires all applicable conditions:

1. final target identity is exact;
2. effective policy was respected;
3. source-to-final continuity is proven;
4. stale evidence was reconciled;
5. required final validation passed;
6. unresolved integration state is absent;
7. integration-attributable hygiene is clean;
8. any remaining risk is compatible with the claimed result.
