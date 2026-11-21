"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/site";

type Group = {
  id: string;
  name: string;
  primary: boolean;
};

export default function ServiceExplorer({
  groups,
  lang,
  children,
}: {
  groups: Group[];
  lang: Lang;
  children: ReactNode;
}) {
  const [active, setActive] = useState(groups[0]?.id || "");
  const panel = useRef<HTMLDivElement>(null),
    index = useRef<HTMLDivElement>(null);
  const hi = lang === "hi";

  useEffect(() => {
    const content = panel.current;
    if (!content) return;
    const sections = Array.from(
      content.querySelectorAll<HTMLElement>("[data-service-category]"),
    );
    let frame = 0;
    function update() {
      frame = 0;
      const boundary = scrollOffset() + 12;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= boundary) current = section;
        else break;
      }
      if (current) setActive(current.dataset.serviceCategory!);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function measure() {
      content!.parentElement?.style.setProperty(
        "--service-header-offset",
        `${document.querySelector("header.nav")?.getBoundingClientRect().height || 88}px`,
      );
      schedule();
    }
    function restoreHash() {
      let id = window.location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (target && content!.contains(target)) scrollToTarget(target);
      schedule();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(measure);
    const header = document.querySelector("header.nav");
    if (header) observer.observe(header);
    window.addEventListener("resize", measure);
    window.addEventListener("hashchange", restoreHash);
    measure();
    restoreHash();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("hashchange", restoreHash);
    };
  }, []);

  useEffect(() => {
    const list = index.current,
      link = list?.querySelector<HTMLElement>(`[data-index-id="${active}"]`);
    if (!list || !link) return;
    const bounds = list.getBoundingClientRect(),
      item = link.getBoundingClientRect();
    if (item.top < bounds.top + 12)
      list.scrollTop += item.top - bounds.top - 12;
    else if (item.bottom > bounds.bottom - 12)
      list.scrollTop += item.bottom - bounds.bottom + 12;
  }, [active]);

  function select(id: string) {
    const target = document.getElementById(id);
    if (!target || !panel.current) return;
    setActive(id);
    history.pushState(null, "", `#${id}`);
    scrollToTarget(target);
  }

  return (
    <div className="container service-explorer">
      <aside
        className="service-index"
        aria-label={hi ? "सेवाओं की सूची" : "Service directory"}
      >
        <div className="service-index-heading">
          <strong>{hi ? "सेवाओं की श्रेणियाँ" : "Service categories"}</strong>
          <span>{groups.length}</span>
        </div>
        <div className="service-index-scroll" ref={index}>
          <nav
            className="service-category-nav"
            aria-label={hi ? "सेवाओं की श्रेणी चुनें" : "Choose a service category"}
          >
            <ul>
              {groups.map((group, i) => (
                <li key={group.id}>
                  {(i === 0 || group.primary !== groups[i - 1].primary) && (
                    <span className="service-category-label">
                      {group.primary
                        ? hi
                          ? "मुख्य सेवाएँ"
                          : "Core services"
                        : hi
                          ? "अतिरिक्त सेवाएँ"
                          : "Additional services"}
                    </span>
                  )}
                  <a
                    href={`#${group.id}`}
                    data-index-id={group.id}
                    aria-current={active === group.id ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      select(group.id);
                    }}
                  >
                    {group.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      <div className="service-mobile-picker">
        <label htmlFor="service-jump">
          {hi ? "श्रेणी चुनें" : "Jump to a category"}
        </label>
        <select
          id="service-jump"
          value={active}
          onChange={(event) => select(event.target.value)}
        >
          {[true, false].map((primary) => (
            <optgroup
              label={
                primary
                  ? hi
                    ? "मुख्य सेवाएँ"
                    : "Core services"
                  : hi
                    ? "अतिरिक्त सेवाएँ"
                    : "Additional services"
              }
              key={String(primary)}
            >
              {groups
                .filter((group) => group.primary === primary)
                .map((group) => (
                  <option value={group.id} key={group.id}>
                    {group.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div
        className="service-scroll-panel"
        ref={panel}
        role="region"
        aria-label={hi ? "सेवाओं की जानकारी" : "Service details"}
      >
        {children}
      </div>
    </div>
  );
}

function scrollOffset() {
  const header =
    document.querySelector("header.nav")?.getBoundingClientRect().height || 88;
  const picker = window.matchMedia("(max-width:899px)").matches
    ? document.querySelector(".service-mobile-picker")?.getBoundingClientRect()
        .height || 0
    : 0;
  return header + picker + 24;
}
function scrollToTarget(target: HTMLElement) {
  window.scrollTo({
    top: window.scrollY + target.getBoundingClientRect().top - scrollOffset(),
    behavior: "instant",
  });
}
