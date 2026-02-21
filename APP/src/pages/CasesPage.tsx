import { EmptyState } from '../components/shared'
import type { Issue, RepoCtx } from '../github'
import { ghUrl } from '../helpers'

export default function CasesPage({ cases, loading, ctx }: { cases: Issue[]; loading: boolean; ctx: RepoCtx }) {
    return (
        <section className="page-cases">
            <div className="page-header">
                <h2>Cases</h2>
                <div className="page-actions">
                    <a className="button primary" href={ghUrl(ctx, '/issues/new?labels=case')} target="_blank" rel="noopener noreferrer">New Case</a>
                </div>
            </div>
            {cases.length === 0
                ? <EmptyState text="No open cases" loading={loading} />
                : <div className="item-list">
                    {cases.map(c => {
                        const status = c.state === 'closed' ? 'closed'
                            : c.labels.some(l => l.name.toLowerCase().includes('resolved')) ? 'resolved'
                            : c.labels.some(l => l.name.toLowerCase().includes('provisioned')) ? 'provisioned'
                            : 'open'
                        return (
                            <a key={c.number} className="item-row case-row" href={c.html_url} target="_blank" rel="noopener noreferrer">
                                <span className={`case-status case-${status}`}>{status}</span>
                                <div className="item-main">
                                    <span>{c.title}</span>
                                    {c.body && <p>{c.body.slice(0, 120)}</p>}
                                </div>
                            </a>
                        )
                    })}
                </div>
            }
        </section>
    )
}
