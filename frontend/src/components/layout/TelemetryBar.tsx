import { SITE } from '../../content/site'
import { useClock } from '../../hooks/useClock'

export function TelemetryBar() {
  const { local, utc, iso } = useClock()

  return (
    <div className="telemetry" aria-label="Live location and time">
      <div className="telemetry__inner">
        <span className="telemetry__dot" aria-hidden="true" />
        <span className="telemetry__item">
          <em>LOC</em> {SITE.region}
        </span>
        <span className="telemetry__sep" aria-hidden="true">
          /
        </span>
        <span className="telemetry__item">
          <em>{SITE.timezoneLabel}</em> {local}
        </span>
        <span className="telemetry__sep" aria-hidden="true">
          /
        </span>
        <span className="telemetry__item">
          <em>UTC</em> {utc}
        </span>
        <span className="telemetry__iso" title={iso}>
          {iso}
        </span>
      </div>
    </div>
  )
}
