import { useEffect, useState } from 'react'

type Contribution = {
  date: string
  count: number
  level: number
}

const username = 'padillajet'

export default function GitHubContributions() {
  const [days, setDays] = useState<Contribution[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)

    async function loadContributions() {
      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error('Contribution request failed')
        const data = await response.json()
        if (!Array.isArray(data.contributions) || data.contributions.length === 0) {
          throw new Error('Contribution data is unavailable')
        }
        const contributions: Contribution[] = data.contributions
        if (!contributions.every(day =>
          /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
          Number.isFinite(Date.parse(day.date)) &&
          Number.isInteger(day.count) && day.count >= 0 &&
          Number.isInteger(day.level) && day.level >= 0 && day.level <= 4,
        )) throw new Error('Invalid contribution data')
        setDays([...contributions].sort((a, b) => a.date.localeCompare(b.date)))
      } catch {
        if (!disposed) setFailed(true)
      } finally {
        window.clearTimeout(timeout)
      }
    }

    let disposed = false
    void loadContributions()
    return () => {
      disposed = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [])

  const total = days?.reduce((sum, day) => sum + day.count, 0) ?? 0
  const firstWeekday = days ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0

  return (
    <section className="content-section github-contributions" aria-label="GitHub contributions">
      <h2 className="content-section-title">Github</h2>
      {days ? (
        <>
          <div className="contribution-scroll" tabIndex={0} aria-label="Daily GitHub contributions, scroll horizontally to view the full year">
            <div className="contribution-calendar">
              {Array.from({ length: firstWeekday }, (_, index) => (
                <span key={`padding-${index}`} aria-hidden="true" />
              ))}
              {days.map(day => (
                <span className="contribution-cell" key={day.date} title={`${day.count} contributions on ${day.date}`}>
                  <span className={`contribution-dot contribution-level-${day.level}`} />
                </span>
              ))}
            </div>
          </div>
          <a className="contribution-summary" href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
            {total.toLocaleString('en-US')} contributions in the last year
          </a>
        </>
      ) : (
        <p className="contribution-status" role="status">
          {failed ? <>Contributions are unavailable. <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">View GitHub profile</a></> : 'Loading GitHub contributions…'}
        </p>
      )}
    </section>
  )
}
