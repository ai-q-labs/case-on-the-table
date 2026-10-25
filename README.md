# Case on the Table

A seated, hands-only mixed-reality mystery for Meta Quest. An evidence box
appears on your real table. You pick the evidence up with your hands, turn it
over, hold it to the light, bring two pieces together, and when you know who
did it, you put their photo in the box. One case takes about ten minutes.

**Play:** https://ai-q-labs.github.io/case-on-the-table/ — open it in the Meta
Quest Browser and enter mixed reality. Built for the Meta Horizon Start
Developer Competition 2026 (Gaming, New Experience).

## The cases

Each case is three suspects and seven pieces of evidence, and every case uses
all three inspections at least once.

- **Case 01, The Empty Case** (default): a jade hairpin gone from a locked
  display case in a small private museum.
- **Case 02, The Anonymous Letter** — add `?case=02` to the address: a typed
  threat in a choir director's pigeonhole.
- **Case 03, The Salted Sponge** — `?case=03`: the favourite's cake at a village
  show tastes of salt.

## How to play

- **Read** the brief card on top of the pile first.
- **Pick up** any card with a pinch. Everything stays within arm's reach.
- **Turn it over**: some cards have something printed on the back.
- **Hold it up to the light**: a faded thermal receipt shows its print when
  raised to eye level.
- **Bring two cards together**: when they belong together, a red thread
  joins them and says what they mean side by side.
- **Accuse** by putting a suspect's photo in the box. A wrong guess tells you
  why that person is innocent and puts the photo back; the culprit closes the
  case and shows how many clues you found.

Cards whose secret you have found keep a gold edge.

## How it works

Built with [IWSDK](https://iwsdk.dev) (Three.js with an entity component
system) as a WebXR app.

- **Your table.** Scene understanding reports the planes in your room. The box
  goes to the table nearest you, at the edge closest to you, turned to face you.
  It is fitted inside the table's actual outline, so it also sits properly on a
  round table (`src/table-fit.ts`). Without a detected table it waits at desk
  height in front of you.
- **Hands only.** Cards are `OneHandGrabbable`. The inspections are read from
  how you hold a card: its back facing your eyes, its height against your eyes,
  its distance to its partner (`src/inspection-system.ts`). What you found is
  stored on each card as ECS state.
- **Accusation.** Letting go of a photo inside the tray accuses that person
  (`src/accusation-system.ts`).
- **No downloads for the game itself.** The box and cards are built in code,
  and every card's printing is drawn at runtime on a canvas (`src/card-art.ts`).
- **One file per case** (`src/cases/`). `npm run check:cases` checks every
  case against the slots the scene provides: all three inspections present,
  linked cards that do not start side by side, exactly one culprit, and text
  that fits the tags.

```sh
npm install
npm run dev      # IWSDK dev server with the IWER headset emulator
npm run build    # production build in dist/ (docs/ in this repository)
```

## Status

Cases 01–03 of a planned seven. Developed and tested in IWER, the IWSDK browser
emulator (Meta Quest 3 profile, a furnished room with a round table); not yet
tested on a headset.

## Privacy

No accounts, no analytics, no cookies. Everything loads from this site,
including the hand and controller models (the input layer normally fetches
them from a public CDN; `src/local-input-profiles.ts` points it here), so
playing sends nothing to a third party.

## Credits

Made by Ai-Q Labs, with Claude Code (AI-assisted development and writing).
All people, places and events in the case are fictional.

Code: MIT (see `LICENSE`). Bundled third-party software: see
`THIRD_PARTY_NOTICES.md`.
