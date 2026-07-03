# collapse-code

Opt-in collapsible code blocks for this Quartz v5 site.

## Usage

Add the word `collapse` to a code fence's info string:

    ```python collapse
    # long code...
    ```

The block renders collapsed (preview of the first lines + fade + a
«Развернуть код» button). Blocks without `collapse` are unchanged.

Note: the `collapse` marker is **case-sensitive** — use lowercase `collapse` only. `Collapse`, `COLLAPSE`, or other variants will not trigger the collapse behavior.

## How it works

- `markdownPlugins`: records which fenced blocks are flagged (in order) and
  strips `collapse` from the fence meta.
- `htmlPlugins` (order 95, after syntax-highlighting): adds a `code-collapsible`
  class and a pure-CSS `<input type=checkbox>` + `<label>` disclosure.
- `externalResources`: ships the collapse CSS. No client JS.

Tunables live in `src/styles.ts` (`max-height`, fade height, colors) and
`src/wrap.ts` (label text).
