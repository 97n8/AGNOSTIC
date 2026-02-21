import { EmptyState } from '../components/shared'
import type { Issue } from '../github'
import type { RepoCtx } from '../github'
import { relativeTime, textColorForBg, ghUrl } from '../helpers'

export default function IssuesPage({ issues, loading, filter, onFilterChange, ctx }: {
    issues: Issue[]; loading: boolean; filter: 'open' | 'closed' | 'all';
    onFilterChange: (f: 'open' | 'closed' | 'all') => void; ctx: RepoCtx
}) {
    return (
        <section className="page-issues">
            <div className="page-header">
                <h2>Issues</h2>
                <div className="page-actions">
                    <div className="filter-tabs">
                        <button type="button" className={`button${filter === 'open' ? ' active' : ''}`} onClick={() => onFilterChange('open')}>open</button>
                        <button type="button" className={`button${filter === 'closed' ? ' active' : ''}`} onClick={() => onFilterChange('closed')}>closed</button>
                        <button type="button" className={`button${filter === 'all' ? ' active' : ''}`} onClick={() => onFilterChange('all')}>all</button>
                    </div>
                    <a className="button primary" href={ghUrl(ctx, '/issues/new')} target="_blank" rel="noopener noreferrer">New Issue</a>
                </div>
            </div>
            {issues.length === 0
                ? <EmptyState text="No open issues" loading={loading} />
                : <div className="item-list">
                    {issues.map(i => (
                        <a key={i.number} className="item-row" href={i.html_url} target="_blank" rel="noopener noreferrer">
                            <div className="item-main">
                                <div className="item-title-row">
                                    <span className="item-number">#{i.number}</span>
                                    <span>{i.title}</span>
                                    <span className={`tag ${i.state}`}>{i.state}</span>
                                </div>
                                <div>
                                    {i.labels.map(l => <span key={l.name} className="tag" style={{ background: `#${l.color}`, color: textColorForBg(l.color) }}>{l.name}</span>)}
                                    <span>{relativeTime(i.created_at)}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            }
        </section>
    )
}
