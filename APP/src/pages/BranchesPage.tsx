import { EmptyState } from '../components/shared'
import type { Branch, Repo, RepoCtx } from '../github'
import { ghUrl } from '../helpers'

export default function BranchesPage({ branches, loading, repo, ctx }: { branches: Branch[]; loading: boolean; repo: Repo | null; ctx: RepoCtx }) {
    return (
        <section className="page-branches">
            <div className="page-header">
                <h2>Branches</h2>
                <div className="page-actions">
                    <a className="button" href={ghUrl(ctx, '/branches')} target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
            </div>
            {branches.length === 0
                ? <EmptyState text="No branches" loading={loading} />
                : <div className="item-list">
                    {branches.map(b => (
                        <a key={b.name} className="item-row" href={ghUrl(ctx, `/tree/${b.name}`)} target="_blank" rel="noopener noreferrer">
                            <span className="branch-name">{b.name}</span>
                            <div className="item-tags">
                                {b.protected && <span className="tag protected">protected</span>}
                                {b.name === repo?.default_branch && <span className="tag default-tag">default</span>}
                            </div>
                            <span className="item-sha">{b.commit.sha.slice(0, 7)}</span>
                        </a>
                    ))}
                </div>
            }
        </section>
    )
}
