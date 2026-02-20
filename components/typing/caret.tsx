export function Caret() {
  return (
    <span
      aria-hidden
      className="bg-primary pointer-events-none absolute inset-y-0 -left-[2px] w-[2px] animate-[caret-blink_1s_steps(1)_infinite] rounded-full"
    />
  );
}
