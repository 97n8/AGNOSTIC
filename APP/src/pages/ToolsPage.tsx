import { EmptyState } from '../components/shared'
import type { RepoCtx } from '../github'
import { ghUrl } from '../helpers'

export default function ToolsPage({ loading, ctx }: { loading: boolean; ctx: RepoCtx }) {
    return (
        <section className="page-tools">
            <div className="page-header">
                <h2>Tools</h2>
                <div className="page-actions">
                    <a className="button" href={ghUrl(ctx, '/actions')} target="_blank" rel="noopener noreferrer">GitHub Actions</a>
                </div>
            </div>
            <EmptyState text="No tools configured — add developer tools and utilities" loading={loading} />
        </section>
    )
}
