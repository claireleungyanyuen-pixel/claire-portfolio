"use client";

import Reveal from "./reveal";

export default function SectionHeading({
  index,
  labelEn,
  labelZh,
}: {
  index: string;
  labelEn: string;
  labelZh: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 flex items-center gap-4">
        <span className="sim-tag">{index} · {labelEn}</span>
        <span className="font-rounded text-2xl font-extrabold text-[color:var(--color-ink)] sm:text-3xl">
          {labelZh}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-[color:color-mix(in_oklch,var(--color-violet)_35%,transparent)] to-transparent" />
      </div>
    </Reveal>
  );
}
