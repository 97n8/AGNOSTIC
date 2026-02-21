import { MetricCard } from '../components/shared'
import type { Repo, RepoCtx } from '../github'
import { NA, ghUrl } from '../helpers'

export default function DashboardPage({ repo, openIssueCount, openPRCount, ctx }: {
    repo: Repo | null; openIssueCount: number; openPRCount: number; ctx: RepoCtx
}) {
    return (
        <section className="page-dashboard">
            <div className="page-header">
                <h2>{ctx.owner}/{ctx.repo}</h2>
                <div className="page-actions">
                    <a className="button" href={ghUrl(ctx)} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a>
                </div>
            </div>
            <div className="stats-row">
                <MetricCard label="Open Issues" value={repo ? openIssueCount : NA} />
                <MetricCard label="Open PRs" value={repo ? openPRCount : NA} />
                <MetricCard label="Stars" value={repo?.stargazers_count ?? NA} />
                <MetricCard label="Forks" value={repo?.forks_count ?? NA} />
            </div>
            {repo && (
                <div className="surface">
                    <p className="meta-label">Description</p>
                    <p className="meta-value">{repo.description || 'No description'}</p>
                    <p className="meta-label" style={{ marginTop: '1rem' }}>Visibility</p>
                    <p className="meta-value">{repo.private ? 'Private' : 'Public'} · {repo.language ?? 'Unknown language'}</p>
                </div>
            )}
        </section>
    )
}
