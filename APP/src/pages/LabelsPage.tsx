import { EmptyState } from '../components/shared'
import type { Label, RepoCtx } from '../github'
import { textColorForBg, ghUrl } from '../helpers'

export default function LabelsPage({ labels, loading, ctx }: { labels: Label[]; loading: boolean; ctx: RepoCtx }) {
    return (
        <section className="page-labels">
            <div className="page-header">
                <h2>Labels</h2>
                <div className="page-actions">
                    <a className="button primary" href={ghUrl(ctx, '/labels')} target="_blank" rel="noopener noreferrer">Manage Labels</a>
                </div>
            </div>
            {labels.length === 0
                ? <EmptyState text="No labels" loading={loading} />
                : <div className="label-grid">
                    {labels.map(l => (
                        <a key={l.name} className="label-chip large" href={ghUrl(ctx, `/issues?q=label:${encodeURIComponent(l.name)}`)} target="_blank" rel="noopener noreferrer" style={{ background: `#${l.color}`, color: textColorForBg(l.color) }}>{l.name}</a>
                    ))}
                </div>
            }
        </section>
    )
}
