# Git Integration Standard

## 1. Goal

Git integration is complete only when the exact reviewed/tested source change is demonstrably represented in the intended target state according to effective repository policy.

~~~text
REVIEWED / TESTED SOURCE
        +
EFFECTIVE GIT POLICY
        +
AUTHORIZED INTEGRATION
        +
SOURCE-TO-FINAL PROOF
        +
RECONCILED EVIDENCE
        +
CLEAN ATTRIBUTABLE STATE
        =
INTEGRATED_VERIFIED
~~~

A successful merge command alone is insufficient.

## 2. Evidence identity

Always distinguish:

- commit identity — exact Git commit SHA;
- tree identity — exact repository tree at a commit;
- reviewed delta identity — the change relative to the relevant reviewed base;
- evidence identity — which commit/tree/delta a review, test, build, or approval actually covered;
- final integration identity — target ref, final HEAD, final tree, and provider-side state.

Do not say "tests passed" without recording which source state they passed on.

## 3. Policy before preference

Repository policy wins over author preference.

Effective policy may permit or require fast-forward, merge commit, rebase, squash, merge queue, signed commits, review count, checks, linear history, branch freshness, or provider-managed integration.

Do not choose a method because it is fashionable, because another Turpial repository uses it, or because a local Git config prefers it.

## 4. Strategy neutrality

This capability does not globally rank integration strategies.

A method is acceptable when:

1. it is allowed by effective repository policy;
2. it is authorized for the task;
3. the reviewed source can be reconciled to the resulting final state;
4. required evidence remains valid or is rerun;
5. final-state and hygiene checks pass.

## 5. Identity-preserving and identity-rewriting flows

### Identity-preserving

Fast-forward and many merge-commit flows keep the reviewed source commit reachable.

Ancestry can be strong evidence:

~~~text
source HEAD is ancestor of final target HEAD
~~~

Still verify the intended target ref and final state.

### Identity-rewriting

Rebase, squash, and some provider-managed flows can replace source commit identities.

A missing original source SHA from final history is not automatically a failure. Instead prove that the integrated delta corresponds to the reviewed source delta and identify any material differences.

Do not claim equivalence merely because filenames or commit messages look similar.

## 6. Mutation invalidates evidence proportionally

Evidence can survive a pure identity rewrite when content and relevant context are demonstrably equivalent.

Evidence must be reconsidered when integration introduces:

- conflict resolution;
- manual edits;
- generated output changes;
- dependency resolution changes;
- target changes that materially affect behavior;
- merge-result behavior not represented in the reviewed source;
- any other semantic difference.

Rerun the smallest sufficient affected review/testing checks. Do not force an unrelated full suite, and do not reuse stale proof.

## 7. Target movement

The target can change between review and integration.

Record the target base used for decision-making and refresh it immediately before mutation when appropriate.

If the target moved:

- determine whether the source still integrates without semantic change;
- identify new interactions or conflicts;
- update/rebase only when policy permits;
- revalidate evidence affected by the changed context;
- record the final actual target base/result.

"Branch was green yesterday" is not proof of today's integrated state.

## 8. Attributable hygiene

The integration capability owns residue caused by integration, not unrelated repository cleanup.

Check for:

- unresolved index entries;
- conflict markers;
- interrupted merge/rebase/cherry-pick state;
- integration-created temporary or backup files;
- unintended staged/unstaged changes;
- integration-created untracked files;
- obsolete integration branch only when cleanup is authorized.

Record pre-existing dirty state before mutation and preserve it unless separately authorized.

## 9. Authorization boundaries

Never silently:

- force-push;
- bypass branch protection or rulesets;
- delete another contributor's branch;
- rewrite published tags/history;
- approve your own required review when policy forbids it;
- merge without required human authorization;
- change repository merge policy merely to make integration succeed.

Return BLOCKED or the more specific blocking status instead.

## 10. Passing state

Only INTEGRATED_VERIFIED is a completed successful integration.

It requires evidence that:

- the target is the intended target;
- policy was respected;
- source-to-final continuity is proven;
- material evidence invalidation was reconciled;
- integration-attributable hygiene is clean;
- remaining risks do not contradict the claimed gate.
