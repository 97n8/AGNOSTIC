import { EmptyState } from '../components/shared'
import type { RepoCtx } from '../github'
import { ghUrl } from '../helpers'

export default function ListsPage({ loading, ctx }: { loading: boolean; ctx: RepoCtx }) {
    return (
        <section className="page-lists">
            <div className="page-header">
                <h2>Lists</h2>
                <div className="page-actions">
                    <a className="button primary" href={ghUrl(ctx, '/issues?q=is:open')} target="_blank" rel="noopener noreferrer">Browse Issues</a>
                </div>
            </div>
            <EmptyState text="No lists yet — create a list to organize issues, tasks, or items" loading={loading} />
        </section>
    )
}
