"use client";

import { createContext, useContext, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useReveal } from "@/components/motion/useReveal";
import type { RevealKind } from "@/lib/motion/reveal";

type TabsState = { idPrefix: string; value: string; select: (value: string) => void };

const TabsContext = createContext<TabsState | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabList and TabPanel must be used inside <Tabs>.");
  return ctx;
}

/** Ids follow `${idPrefix}-tab-${value}` for tabs and `${idPrefix}-${value}` for panels. */
export function Tabs({ idPrefix, defaultValue, children }: { idPrefix: string; defaultValue: string; children: ReactNode }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ idPrefix, value, select: setValue }}>{children}</TabsContext.Provider>;
}

type TabListProps = {
  label: string;
  tabs: { value: string; label: string }[];
  reveal?: RevealKind;
};

/** Click or Left/Right arrow keys switch panels. */
export function TabList({ label, tabs, reveal }: TabListProps) {
  const { idPrefix, value, select } = useTabs();
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, reveal);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step || !ref.current) return;
    const buttons = Array.from(ref.current.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const i = buttons.indexOf(event.target as HTMLButtonElement);
    if (i < 0) return;
    event.preventDefault();
    const next = (i + step + tabs.length) % tabs.length;
    select(tabs[next].value);
    buttons[next].focus();
  };

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      data-reveal={reveal}
      onKeyDown={onKeyDown}
      className="inline-flex border border-border-muted on-dark:border-border-on-dark"
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.value}`}
            aria-controls={`${idPrefix}-${tab.value}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(tab.value)}
            className="px-6 py-[.9rem] text-body font-medium whitespace-nowrap transition-colors duration-150 ease-entrance hover:bg-surface-soft aria-selected:bg-foreground aria-selected:text-background max-md:px-[.9rem] max-md:py-[.8rem] on-dark:hover:bg-surface-dark-raised on-dark:aria-selected:bg-accent on-dark:aria-selected:text-foreground"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ value, className, children }: { value: string; className?: string; children: ReactNode }) {
  const { idPrefix, value: current } = useTabs();
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-${value}`}
      aria-labelledby={`${idPrefix}-tab-${value}`}
      hidden={value !== current}
      className={className}
    >
      {children}
    </div>
  );
}
