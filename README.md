# behavioural-design

UX research & design skills for behavioural design, distributed as a Claude Code
plugin marketplace.

## Plugins

### `ooux`
OOUX skills for turning scenarios into information architecture.

- **`ooux-extract`** — builds an object model (a mental model) from scenarios or
  raw input by running the ORCA process (Objects → Relationships → CTAs →
  Attributes). Extractor only; it does not review or audit an existing product.

## Install

In any Claude Code session (or via the `claude` CLI):

```
/plugin marketplace add provokatherine/behavioural-design
/plugin install ooux@behavioural-design
```

Then invoke the skill explicitly with `/ooux:ooux-extract`, or just describe an
OOUX/object-mapping task and it auto-triggers.

## Use without installing

The skills also live in `.claude/skills/`, so they load automatically as
**project skills** whenever you work in this repository (including Claude Code on
the web / cowork). The marketplace plugin points at that same directory, so
there is a single source of truth.

## Develop

Validate the marketplace and plugin before pushing:

```
claude plugin validate .
claude plugin validate ./   # plugin (skills under .claude/skills)
```
