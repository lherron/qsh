"use client";

import { useEffect, useState } from "react";
import { LedgerCard } from "./card";
import { LAST, OUTPUT_ROWS, SCRIPT, TIMING } from "./script";

/**
 * The ledger replay (DESIGN.md § 5): a shell strip where five real wrkq
 * commands are typed, over the `wrkq cat --pretty` card they mutate.
 *
 * The whole thing is one cancellable timeout chain — no animation library.
 * The first paint is step 1 already typed and its card already present, so the
 * hero is complete before hydration; the client picks up at step 2. Until the
 * scheduler owns the line it stays plain text, which keeps the server payload
 * and the hydration cost off the critical path.
 *
 * Nothing in here ever moves. Every command line is laid out at its full
 * length on every frame (the untyped tail is `visibility: hidden`), all five
 * share one grid cell so the strip is as tall as the tallest of them, the
 * output row is always reserved, and the block cursor is a background on the
 * next character rather than a box that travels along the line. Typing a
 * character therefore changes colour and nothing else — zero layout shift.
 */

type Frame = {
  /** Index of the command in the shell strip. */
  cmd: number;
  /** How many of its characters have been typed. */
  typed: number;
  /** Index of the step the card reflects (lags `cmd` while typing). */
  card: number;
  /** Whether that command's output has printed. */
  printed: boolean;
};

const FIRST: Frame = {
  cmd: 0,
  typed: SCRIPT[0].command.length,
  card: 0,
  printed: true,
};

const FINAL: Frame = {
  cmd: LAST,
  typed: SCRIPT[LAST].command.length,
  card: LAST,
  printed: true,
};

/* The cursor hides the character it sits on and blinks its own ground, which
   is what a terminal block cursor does. */
const CARET_CSS = `
@keyframes ledger-caret {
  0%, 50% { background: var(--signal) }
  50.01%, 100% { background: transparent }
}
.ledger-caret {
  color: transparent;
  background: var(--signal);
  animation: ledger-caret ${TIMING.cursorBlink}ms steps(1, end) infinite;
}
@media (prefers-reduced-motion: reduce) { .ledger-caret { animation: none } }
`;

export function LedgerReplay() {
  const [frame, setFrame] = useState<Frame>(FIRST);
  const [shellVisible, setShellVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [run, setRun] = useState(0);

  // The server cannot know the motion preference, so the first paint is always
  // step 1 and this corrects it on mount. No timers ever start when frozen.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const frozen = reduced;

  useEffect(() => {
    if (frozen) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    const play = async () => {
      setStarted(true);
      setFrame(FIRST);
      setShellVisible(true);

      for (;;) {
        for (let i = 1; i < SCRIPT.length; i++) {
          const step = SCRIPT[i];

          // Type. The card still shows the previous step until the command returns.
          setFrame((prev) => ({ ...prev, cmd: i, typed: 0, printed: false }));
          for (let n = 1; n <= step.command.length; n++) {
            const jitter = TIMING.typeMin + Math.random() * (TIMING.typeMax - TIMING.typeMin);
            await sleep(jitter);
            if (cancelled) return;
            setFrame((prev) => ({ ...prev, typed: n }));
          }

          await sleep(TIMING.afterEnter);
          if (cancelled) return;

          setFrame({ cmd: i, typed: step.command.length, card: i, printed: true });
          await sleep(i === LAST ? TIMING.loopHold : TIMING.hold);
          if (cancelled) return;
        }

        // Fade the shell only; the card snaps back to step 1 underneath it.
        setShellVisible(false);
        await sleep(TIMING.fade);
        if (cancelled) return;
        setFrame(FIRST);
        setShellVisible(true);
        await sleep(TIMING.restart);
        if (cancelled) return;
      }
    };

    void play();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [frozen, run]);

  const shown = frozen ? FINAL : frame;
  const step = SCRIPT[shown.cmd];
  const output = shown.printed ? step.output : [];

  return (
    <div className="relative flex max-h-[34rem] min-w-0 flex-col border border-rule bg-ink-2 lg:max-h-none">
      <style>{CARET_CSS}</style>

      {/* Shell strip: a recessed pane on the page ground, inside the card. */}
      <div
        className="terminal-body min-w-0 shrink-0 border-b border-rule bg-ink px-4 py-3 transition-opacity"
        style={{
          opacity: shellVisible ? 1 : 0,
          transitionDuration: `${TIMING.fade}ms`,
        }}
      >
        {/* All five commands share one grid cell, so the strip is as tall as
            the tallest and the current one sits on the prompt line at the
            bottom of it — terminal scrollback, not a floating line. */}
        <div className="grid grid-cols-1 items-end">
          {SCRIPT.map((candidate, index) => {
            const current = index === shown.cmd;
            const typing = current && !frozen && started;
            return (
              <p
                key={candidate.command}
                className="col-start-1 row-start-1 break-words"
                style={{ visibility: current ? "visible" : "hidden" }}
                aria-hidden={current ? undefined : "true"}
              >
                <span className="text-paper-faint select-none">$ </span>
                {/* While this line is being typed the glyphs carry state, so
                    assistive tech gets the command once, up front, instead. */}
                {typing && <span className="sr-only">{candidate.command}</span>}
                {/* One span per character, on every line, typed or not. Each
                    glyph sits at a position it never leaves, so typing changes
                    colour and nothing else. The structure has to be identical
                    on the hidden lines too: they size the shared grid row, and
                    a run of one-character boxes does not wrap where the same
                    text in a single box would. */}
                {[...candidate.command].map((glyph, at) => (
                  <span
                    key={at}
                    aria-hidden={typing ? "true" : undefined}
                    className={
                      !typing || at < shown.typed
                        ? "text-paper"
                        : at === shown.typed
                          ? "ledger-caret"
                          : "invisible"
                    }
                  >
                    {glyph}
                  </span>
                ))}
                {/* The cell the cursor rests in once the command is typed. */}
                <span
                  aria-hidden="true"
                  className={
                    typing && shown.typed >= candidate.command.length
                      ? "ledger-caret"
                      : "invisible"
                  }
                >
                  &nbsp;
                </span>
              </p>
            );
          })}
        </div>

        {/* Output rows are always reserved. NDJSON does not wrap in a terminal
            either; § 9 allows a terminal its own horizontal scroll. */}
        {Array.from({ length: OUTPUT_ROWS }, (_, row) => (
          <p
            key={row}
            className="overflow-x-auto whitespace-pre text-paper-muted"
          >
            {output[row] ?? " "}
          </p>
        ))}
      </div>

      {/* The card. Scrolls inside itself only when the mobile cap bites. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-9">
        <LedgerCard step={SCRIPT[shown.card]} />
      </div>

      {!frozen && (
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="absolute right-3 bottom-2 font-mono text-2xs text-paper-faint transition-colors duration-[120ms] hover:text-signal"
        >
          Replay
        </button>
      )}
    </div>
  );
}
