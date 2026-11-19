# Unresolved Issues Log

Kept deliberately — admits what is NOT solved, so nothing is papered over.
Updated 2026-11-19 (final deploy compile, v24).

| # | Issue | Status | Root cause / what was tried |
|---|---|---|---|
| 1 | First white text block "invisible" on the user's machine (v13–v18 reports) | **Resolved in v19+; user-side cache suspected** | Verse words began ~40 steps after the white page, stagger 0.1s×133 words → block stayed empty for ~13s. Fixed: reveal starts with the white page, stagger 0.05, dwell 900 steps, 1.5s forced-reveal guard. Headless Edge measures 133/133 words visible within ~80 steps. **The user's browser still showed blank after fixes — believed to be stale cache under a non-bumping `?v=` tag; v24 fixes the tag.** |
| 2 | Version tag never bumped (v13 persisted across v14–v23) | **Fixed v24** | My bump step used `.replace()` with the prior tag text; once the tag text stopped matching (kept v13), replacements silently no-oped and the file was still written. This can serve stale cached JS. Lesson: assert the replace happened; tag with unique nonce. |
| 3 | Frame purge near-miss (lost frame_000 during the 77–101 removal) | **Recovered** | First deletion pass ran before validating the copy; deleted originals then crashed on AppleDouble junk. Recovered by regenerating frame_000 from source, later replaced with the pixel-identical original from DEV-PIPELINE backup. Lesson: move-to-temp, swap, verify, then delete. |
| 4 | First text block quality (user: "crap") | **Actioned: first white block removed (v22)** | User judged the opening film + first block weak; per order the t1 white hold was removed; t1 is now pure film (frames 14–45, mid-motion open). Remaining 2 text blocks + quote + finale carry the storytelling. |
| 5 | Reverse scroll ghost text | **Fixed v24** | FadeContent `clear()` is async (0.28s); scrolling up left previous block's words half-visible. Now hard-hidden immediately when the state leaves the window. |
| 6 | `scroll-behavior: smooth` fighting the pin (ScrollTrigger restores it) | **Fixed** | `html:has(body.has-scroll-film){scroll-behavior:auto !important}` + explicit `auto` set. |
| 7 | Edge hardware acceleration | **Not a code issue — user must verify** | If choppiness persists on the user's machine after v24, check Edge → Settings → System → *Use graphics acceleration* ON. Headless Edge measures 60fps/0% long frames. |
| 8 | Mobile pin start offset (-65px header start) | **Known/accepted** | `start: 'top <header height>px'` (protein parity). Verified fine on 390×844. |
| 9 | ffmpeg `-start_number` placed after `-i` silently ignored (verification scripts) | **Worked around** | Use single-frame PIL reads or `-start_number` before `-i`. Recorded to prevent future false sheets. |

## Still open at final compile
- **User confirmation on real hardware** (the only step I cannot run from here): hard reload `Cmd+Shift+R`, scroll the full film, and read `?debug` fps. If anything persists, reproduce with the badge value.

## How this log is meant to be used
Read it before opening the film code. Every entry states what failed, why, and what the mitigation/lesson is.
