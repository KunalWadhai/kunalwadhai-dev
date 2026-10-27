export function GmailIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#34A853" d="M5 13.5A5.5 5.5 0 0 1 10.5 8H13v31h-3a5 5 0 0 1-5-5V13.5Z" />
      <path fill="#4285F4" d="M35 8h2.5a5.5 5.5 0 0 1 5.5 5.5V34a5 5 0 0 1-5 5h-3V8Z" />
      <path fill="#FBBC04" d="M35 14v25h3a5 5 0 0 0 5-5V16l-8-2Z" />
      <path fill="#EA4335" d="M10.5 8A5.5 5.5 0 0 0 5 13.5V16l19 14 19-14v-2.5A5.5 5.5 0 0 0 37.5 8L24 18 10.5 8Z" />
      <path fill="#C5221F" d="M5 16v18a5 5 0 0 0 5 5h3V22L5 16Z" />
    </svg>
  )
}
