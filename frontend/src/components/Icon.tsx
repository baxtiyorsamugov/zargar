// Линейные иконки SOFIZAR (24×24, обводка 1.6) — те же, что в утверждаемом прототипе.
const PATHS = {
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21ZM12 7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z",
  phone:
    "M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z",
  search: "M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM16 16l4.5 4.5",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 20.5c1.2-3.8 4.3-5.5 8-5.5s6.8 1.7 8 5.5",
  heart: "M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z",
  bag: "M5 8.5h14l-1.2 11.5H6.2L5 8.5ZM9 8.5V7a3 3 0 0 1 6 0v1.5",
  menu: "M4 7h16M4 12h16M4 17h10",
  arrow: "M5 12h14M13 6l6 6-6 6",
  gem: "M6.5 4h11L21 9l-9 11L3 9l3.5-5ZM3 9h18M9 4l3 16 3-16",
  shield: "M12 3 19 6v5.5c0 4.4-3 7.8-7 9.5-4-1.7-7-5.1-7-9.5V6l7-3ZM8.8 12l2.2 2.2 4.2-4.4",
  truck: "M3 6h11v10H3zM14 9.5h4l3 3.5V16h-7M7 15.7a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM17.5 15.7a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Z",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3.5-5.5-3.5-5 0M12 7c1.5-3.5 5.5-3.5 5 0",
  card: "M5.5 5.5h13a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16V8a2.5 2.5 0 0 1 2.5-2.5ZM3 10h18M7 15h3",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className = "ico" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}
