"""
Writes one event's dossier: sources.md (human) + manifest.json (machine).

Both files are generated from a single dict so the prose report and the
structured record can never drift apart. Import and call `write(data)`.

Usage:
    import sys; sys.path.insert(0, "_tools")
    from dossier import write
    write({...})
"""
import json
import os

RANK_LABEL = {
    "A": "A — official first-party",
    "B": "B — official institutional / government",
    "C": "C — reputable media",
    "D": "D — official social channel",
    "E": "E — secondary / other",
    "F": "F — unverified / ambiguous",
}


def _rows(items, fields):
    """Render a list of dicts as markdown bullets."""
    if not items:
        return "_None found._\n"
    out = []
    for it in items:
        head = it.get("url") or it.get("name") or "—"
        if it.get("url"):
            head = f"- **{it.get('label', it['url'])}**\n  <{it['url']}>"
        else:
            head = f"- **{head}**"
        out.append(head)
        for f in fields:
            if it.get(f):
                out.append(f"  - {f}: {it[f]}")
        out.append("")
    return "\n".join(out)


def write(d):
    folder = d["folder"]
    os.makedirs(folder, exist_ok=True)

    md = f"""# {d['event']}

## Identity
- **Organization:** {d['organization']}
- **Event:** {d['event']}
- **Year:** {d.get('year') or '_not stated in source record_'}
- **Location:** {d.get('location') or '_unresolved_'}
- **Identity confidence:** {d['identityConfidence']}
{('- **Ambiguity note:** ' + d['ambiguity']) if d.get('ambiguity') else ''}

## Official Sources
{_rows(d.get('officialSources', []), ['rank', 'provides'])}
## Best Photography Sources
{_rows(d.get('photoSources', []), ['rank', 'type', 'contains', 'quality'])}
## Logo Sources
{_rows(d.get('logoSources', []), ['rank', 'provides'])}
## Social Sources
{_rows(d.get('socialSources', []), ['rank', 'provides'])}
## Media Sources
{_rows(d.get('mediaSources', []), ['rank', 'provides', 'credit'])}
## Event Evidence
_Does this prove the event happened?_

{_rows(d.get('eventEvidence', []), ['rank', 'provides'])}
## Raja Execution Evidence
_Does this prove Raja Enterprises built it? Third-party event photography never counts._

{d.get('rajaExecutionEvidenceNote', '**None found.** No public source examined names Raja Enterprises or shows Raja branding.')}

{_rows(d.get('rajaExecutionEvidence', []), ['rank', 'provides'])}
## Rights
{_rows(d.get('rights', []), ['owner', 'credit', 'classification', 'contact'])}
## What We Need From Raja
{chr(10).join('- ' + n for n in d.get('needFromRaja', [])) or '- _to be determined_'}

## Assessment
{d.get('assessment', '')}

## Research Status
**{d['status'].upper()}** · priority **{d['priority'].upper()}**
"""

    with open(f"{folder}/sources.md", "w") as f:
        f.write(md.replace("\n\n\n", "\n\n"))

    manifest = {
        "id": d["id"],
        "organization": d["organization"],
        "event": d["event"],
        "year": d.get("year", ""),
        "location": d.get("location", ""),
        "identityConfidence": d["identityConfidence"],
        "eventEvidence": d.get("eventEvidence", []),
        "rajaExecutionEvidence": d.get("rajaExecutionEvidence", []),
        "officialSources": d.get("officialSources", []),
        "photoSources": d.get("photoSources", []),
        "logoSources": d.get("logoSources", []),
        "socialSources": d.get("socialSources", []),
        "mediaSources": d.get("mediaSources", []),
        "rights": d.get("rights", []),
        "needFromRaja": d.get("needFromRaja", []),
        "priority": d["priority"],
        "status": d["status"],
    }
    with open(f"{folder}/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
        f.write("\n")

    print(f"{d['id']:<44} {d['status']:<10} {d['priority']}")
