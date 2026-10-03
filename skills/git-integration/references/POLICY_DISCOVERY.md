# Policy Discovery

## Purpose

Discover the repository's effective Git integration policy before choosing or executing an integration method.

## Evidence hierarchy

Use the strongest applicable evidence available. Sources can complement each other.

| Surface | Typical evidence |
|---|---|
| Explicit task/owner authorization | requested target, approved integration action, human boundary |
| Server-enforced repository policy | rulesets, protected branches, merge queue, required checks/reviews, allowed merge methods |
| Repository-owned instructions | CONTRIBUTING, AGENTS, release docs, branch strategy, ownership docs |
| Pull-request state | base/head refs, approval state, required checks, mergeability, queue state |
| Established accepted practice | recent merged PRs when written policy is incomplete |
| Local operator defaults | Git config and aliases; context only, not repository policy by themselves |

When sources conflict, do not silently choose the convenient one. Identify the conflict and resolve it before mutation.

## Continuing established policy

An authoritative policy record may be reused when its repository, scope, inputs, and obligations remain unchanged. Inspect affected instructions and current required server-side policy/PR/queue state before integration; remote governance is mutable. Do not rebuild full history solely because a new invocation began. Missing visibility, contradictions, changed requirements, or drift require the affected discovery checklist and can produce POLICY_BLOCKED.

## Discovery checklist

Record:

- repository root and remote identity;
- intended target ref;
- source ref and exact source HEAD;
- whether target branch is protected;
- allowed merge methods;
- linear-history requirement;
- required branch freshness/update;
- required checks/statuses;
- required reviews/approvals;
- merge queue or provider-managed merge requirement;
- signed commit or signature requirements;
- force-push restrictions;
- branch-deletion behavior and authorization;
- repository instructions about conflict resolution;
- any human authorization boundary not expressible in repository settings.

## Local configuration is not enough

Values such as:

~~~text
pull.rebase
merge.ff
rebase.autoStash
push.default
branch.*.rebase
~~~

describe an operator environment. They do not by themselves establish organization or repository policy.

Use them only to predict local command behavior or identify risk.

## Incomplete remote visibility

If server-side state is material but unavailable:

- record which policy surface could not be read;
- do not infer that protection is absent;
- do not claim INTEGRATION_READY;
- return POLICY_BLOCKED unless another authoritative source resolves the requirement.

## Method selection

Once policy is known, choose the smallest authorized method consistent with it.

Examples:

- linear history + no merge commits may imply rebase/fast-forward or squash;
- merge queue requirement means local merge completion is not authoritative;
- required signed commits can invalidate an otherwise content-equivalent rewrite if signatures are mandatory;
- branch-up-to-date requirements can force target refresh and evidence reconsideration.

The capability preserves policy; it does not rewrite policy to fit the source branch.
