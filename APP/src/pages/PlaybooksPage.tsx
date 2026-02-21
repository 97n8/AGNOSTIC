import { EmptyState } from '../components/shared'
import type { RepoCtx } from '../github'
import { ghUrl } from '../helpers'

export default function PlaybooksPage({ loading, ctx }: { loading: boolean; ctx: RepoCtx }) {
    return (
        <section className="page-playbooks">
            <div className="page-header">
                <h2>Playbooks</h2>
                <div className="page-actions">
                    <a className="button" href={ghUrl(ctx, '/wiki')} target="_blank" rel="noopener noreferrer">Open Wiki</a>
                </div>
            </div>
            <EmptyState text="No playbooks — create playbooks for standard operating procedures and runbooks" loading={loading} />
        </section>
    )
}
