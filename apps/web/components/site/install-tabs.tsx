"use client";

import { useRef, useSyncExternalStore } from "react";
import { CopyButton } from "./copy-button";

// Verified against ~/praesidium/wrkq/README.md, install.sh and go.mod.
const TABS = [
  {
    id: "brew",
    command: "brew tap lherron/wrkq && brew install wrkq",
    note: null,
  },
  {
    id: "curl",
    command:
      "curl -fsSL https://raw.githubusercontent.com/lherron/wrkq/main/install.sh | bash",
    note: null,
  },
  {
    id: "go",
    command: "git clone https://github.com/lherron/wrkq && cd wrkq && just install",
    note: "Requires a Go 1.25 or newer toolchain.",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STORAGE_KEY = "wrkq:install-tab";
const DEFAULT_TAB: TabId = "brew";

function isTabId(value: string | null): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

/**
 * The selected tab is remembered across visits, so it lives outside React:
 * localStorage when it is available, a module-level mirror when it is not.
 */
const listeners = new Set<() => void>();
let selected: TabId | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): TabId {
  if (selected === null) {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      selected = isTabId(stored) ? stored : DEFAULT_TAB;
    } catch {
      selected = DEFAULT_TAB;
    }
  }
  return selected;
}

function getServerSnapshot(): TabId {
  return DEFAULT_TAB;
}

function selectTab(id: TabId) {
  selected = id;
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Nothing to remember; the tab still switches.
  }
  listeners.forEach((listener) => listener());
}

export function InstallTabs({ size = "section" }: { size?: "hero" | "section" }) {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tabRefs = useRef(new Map<TabId, HTMLButtonElement>());

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: 1,
      ArrowUp: -1,
    };
    let next: TabId | null = null;
    if (event.key in keys) {
      const index = TABS.findIndex((tab) => tab.id === active);
      next = TABS[(index + keys[event.key] + TABS.length) % TABS.length].id;
    } else if (event.key === "Home") {
      next = TABS[0].id;
    } else if (event.key === "End") {
      next = TABS[TABS.length - 1].id;
    }
    if (!next) return;
    event.preventDefault();
    selectTab(next);
    tabRefs.current.get(next)?.focus();
  };

  const current = TABS.find((tab) => tab.id === active) ?? TABS[0];

  return (
    <div className={size === "hero" ? "max-w-xl" : "max-w-3xl"}>
      <div
        role="tablist"
        aria-label="Install wrkq"
        onKeyDown={onKeyDown}
        className="flex items-end gap-0 border-b border-rule"
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                if (node) tabRefs.current.set(tab.id, node);
                else tabRefs.current.delete(tab.id);
              }}
              type="button"
              role="tab"
              id={`install-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`install-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              className={[
                "-mb-px border-b px-4 py-2 font-mono text-xs transition-colors duration-[120ms]",
                selected
                  ? "border-signal text-paper"
                  : "border-transparent text-paper-faint hover:text-paper-muted",
              ].join(" ")}
            >
              {tab.id}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`install-panel-${current.id}`}
        aria-labelledby={`install-tab-${current.id}`}
        tabIndex={0}
        className="border border-t-0 border-rule bg-ink-2"
      >
        <div className="flex items-center gap-4 px-4 py-3">
          <pre className="terminal-body m-0 min-w-0 flex-1 overflow-x-auto">
            <code className="whitespace-pre">
              <span className="text-paper-faint select-none">$ </span>
              <span className="text-paper">{current.command}</span>
            </code>
          </pre>
          <CopyButton value={current.command} />
        </div>
      </div>

      {current.note && (
        <p className="mt-3 font-mono text-2xs text-paper-faint">{current.note}</p>
      )}
    </div>
  );
}
