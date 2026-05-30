#!/usr/bin/env python3
"""
check-links.py — verify every wikilink in the staged player site resolves.

Walks `player-site/content/` (or whatever is passed as the first argument)
and confirms every `[[link]]` target points to a file (or folder) that
actually exists in the staged content. Quartz/Obsidian wikilinks resolve
by basename (case-insensitive), with an optional `|alias` and an optional
`#anchor`.

Exits non-zero on any unresolved link so it can be used as a publish gate.

Usage:
    python3 player-site/scripts/check-links.py [content_dir]
    # defaults to player-site/content

Excluded link patterns:
    - External URLs ([Foundry](https://...)) — those are markdown links, not wikilinks
    - Image embeds (![[...]]) for files that exist anywhere in the content dir
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


WIKILINK_RE = re.compile(
    r'(?P<embed>!)?\[\[(?P<target>[^\]\|#]+?)(?:#(?P<anchor>[^\]\|]*))?(?:\|(?P<alias>[^\]]*))?\]\]'
)


def collect_link_targets(root: Path) -> dict[str, set[str]]:
    """Build {basename_lower: {paths_that_define_it}} for fast lookup."""
    index: dict[str, set[str]] = {}
    for p in root.rglob("*"):
        if not p.is_file():
            continue
        rel = str(p.relative_to(root))
        # Match by stem (Obsidian behavior for .md) and by full filename (for PDFs/images)
        index.setdefault(p.stem.lower(), set()).add(rel)
        index.setdefault(p.name.lower(), set()).add(rel)
    # Also index directory names (Obsidian wikilinks can target a folder index)
    for p in root.rglob("*"):
        if p.is_dir():
            index.setdefault(p.name.lower(), set()).add(str(p.relative_to(root)))
    return index


def normalize_target(raw: str) -> tuple[str, str]:
    """Return (lookup_key, display) for a wikilink target.

    Strips Markdown-table escape backslashes and surrounding whitespace.
    For folder-style paths (e.g. '00 - Compendium/compendium/classes'),
    returns just the last path segment as the lookup key.
    """
    cleaned = raw.strip().rstrip("\\").strip()
    last_segment = cleaned.rsplit("/", 1)[-1]
    return last_segment.lower(), cleaned


def main(argv: list[str]) -> int:
    here = Path(__file__).resolve().parent
    project_root = here.parent  # player-site/
    default_content = project_root / "content"

    content_dir = Path(argv[1]).resolve() if len(argv) > 1 else default_content
    if not content_dir.is_dir():
        print(f"ERROR: content directory not found: {content_dir}", file=sys.stderr)
        return 2

    index = collect_link_targets(content_dir)

    broken: list[tuple[Path, int, str, str]] = []  # (file, lineno, target, link_text)
    total_links = 0
    total_files_with_links = 0

    fence_re = re.compile(r"^(\s*)(```|~~~)")

    for md in sorted(content_dir.rglob("*.md")):
        text = md.read_text(encoding="utf-8", errors="replace")
        file_had_link = False
        in_fence = False
        fence_marker = None
        for lineno, line in enumerate(text.splitlines(), 1):
            m = fence_re.match(line)
            if m:
                marker = m.group(2)
                if not in_fence:
                    in_fence = True
                    fence_marker = marker
                elif marker == fence_marker:
                    in_fence = False
                    fence_marker = None
                continue  # don't scan the fence line itself
            if in_fence:
                continue  # don't scan inside fenced code blocks
            for match in WIKILINK_RE.finditer(line):
                file_had_link = True
                total_links += 1
                target = match.group("target")
                key, display = normalize_target(target)
                if key in index:
                    continue
                # Try a final fallback: match by the full normalized path
                if display.lower() in index:
                    continue
                broken.append((md.relative_to(content_dir), lineno, display, match.group(0)))
        if file_had_link:
            total_files_with_links += 1

    print(f"check-links.py — content: {content_dir}")
    print(f"  Files scanned (with wikilinks): {total_files_with_links}")
    print(f"  Wikilinks found:                {total_links}")
    print(f"  Broken (unresolved):            {len(broken)}")

    if broken:
        print()
        print("Broken wikilinks:")
        # Group by file for readability
        last_file = None
        for f, lineno, target, raw in broken:
            if f != last_file:
                print(f"\n  {f}")
                last_file = f
            print(f"    line {lineno}: [[{target}]]   ({raw})")
        print()
        print("Each line above is a wikilink that resolves to nothing in the staged content.")
        print("Either add the missing note, fix the link, or rewrite the reference inline.")
        return 1

    print("\nAll wikilinks resolve. Site is safe to publish.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
