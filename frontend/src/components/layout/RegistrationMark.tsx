/**
 * Registration mark (9×9px "+") for rail/divider intersections
 * Used sparingly per brief Section 6.4
 */

export function RegistrationMark() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="registration-mark"
      aria-hidden="true"
    >
      <path
        d="M4.5 0 L4.5 9 M0 4.5 L9 4.5"
        stroke="var(--line-strong)"
        strokeWidth="1"
      />
    </svg>
  )
}
