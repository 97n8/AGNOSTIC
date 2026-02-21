import { EmptyState } from '../components/shared'
import type { RepoCtx } from '../github'
import { ghUrl } from '../helpers'

export default function ProjectsPage({ loading, ctx }: { loading: boolean; ctx: RepoCtx }) {
    return (
        <section className="page-projects">
            <div className="page-header">
                <h2>Projects</h2>
                <div className="page-actions">
                    <a className="button primary" href={ghUrl(ctx, '/projects')} target="_blank" rel="noopener noreferrer">Open Projects</a>
                </div>
            </div>
            <EmptyState text="No projects — use projects to track and coordinate work across the repo" loading={loading} />
        </section>
    )
}
