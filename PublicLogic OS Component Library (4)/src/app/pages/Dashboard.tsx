import { useMsal } from "@azure/msal-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  CalendarClock,
  ExternalLink,
  FileText,
  Inbox,
  Link2,
  NotebookPen,
  ShieldCheck,
  Landmark,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import PageHeader from "../components/PageHeader";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { GRAPH_SCOPES } from "../../auth/msalInstance";
import { requireInteraction } from "../../auth/RequireAuth";
import { getUserCalendarView } from "../lib/graph-api";
import useSharePointClient from "../hooks/useSharePointClient";
import {
  createArchieveRecord,
  getArchieveListUrl,
  listArchieveRecords,
} from "../lib/archieve";
import { getSharePointRuntimeConfig } from "../../auth/publiclogicConfig";
import { getVaultMode } from "../environments/phillipston/prr/vaultMode";
import {
  enqueueLocalArchieveItem,
  loadLocalArchieveQueue,
  LOCAL_ARCHIEVE_QUEUE_EVENT,
  saveLocalArchieveQueue,
} from "../lib/local-archieve-queue";

// ============================================================================
// Types
// ============================================================================
interface ArchieveRecord {
  itemId?: string;
  RecordId?: string;
  Title?: string;
  CreatedAt?: string;
  Created?: string;
  webUrl?: string;
  Status?: string;
  RecordType?: string;
}

interface CalendarEvent {
  id?: string;
  subject?: string;
  webLink?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
}

interface CaptureInput {
  title: string;
  body: string;
  recordType: "CAPTURE";
  status: "INBOX";
  actor: string;
  environment: string;
  module: string;
  sourceUrl: string;
}

// ============================================================================
// Utilities
// ============================================================================
function sortByCreatedDate(a: ArchieveRecord, b: ArchieveRecord): number {
  const ad = new Date(a.CreatedAt || a.Created || 0).getTime();
  const bd = new Date(b.CreatedAt || b.Created || 0).getTime();
  return bd - ad;
}

function getRelativeTime(dateStr: string | undefined): string {
  if (!dateStr) return "Unknown";
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

function getStatusVariant(status: string | undefined) {
  switch (status) {
    case "SAVED":
    case "ARCHIVED":
      return "default";
    case "INBOX":
    case "PENDING":
      return "secondary";
    default:
      return "outline";
  }
}

// ============================================================================
// Dashboard
// ============================================================================
export default function Dashboard() {
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const actor = account?.username || "unknown";
  const qc = useQueryClient();

  const sharepoint = getSharePointRuntimeConfig();
  const vaultMode = getVaultMode();

  const { client: sp, isLoading: isConnecting, error: connectError } = useSharePointClient();

  const [captureText, setCaptureText] = useState("");
  const [localQueue, setLocalQueue] = useState(() => loadLocalArchieveQueue());
  const localQueueCount = localQueue.length;

  useEffect(() => {
    const refresh = () => setLocalQueue(loadLocalArchieveQueue());
    refresh();
    window.addEventListener(LOCAL_ARCHIEVE_QUEUE_EVENT, refresh);
    return () => window.removeEventListener(LOCAL_ARCHIEVE_QUEUE_EVENT, refresh);
  }, []);

  // Auto-sync local queue when SharePoint becomes available
  const syncQueue = useCallback(async () => {
    if (!sp || localQueue.length === 0) return;
    try {
      for (const item of localQueue) {
        await createArchieveRecord(sp as any, item);
      }
      saveLocalArchieveQueue([]);
      setLocalQueue([]);
      await qc.invalidateQueries({ queryKey: ["archieve"] });
      toast.success(`Synced ${localQueue.length} offline items`);
    } catch (e) {
      toast.error("Failed to sync offline queue");
    }
  }, [sp, localQueue, qc]);

  useEffect(() => {
    if (sp && localQueue.length > 0) {
      void syncQueue();
    }
  }, [sp, localQueue.length, syncQueue]);

  const connectGraphIfNeeded = useCallback(async () => {
    if (!account) return;
    try {
      await instance.acquireTokenSilent({
        account,
        scopes: [...GRAPH_SCOPES],
      });
      toast.success("Microsoft 365 connected");
      qc.invalidateQueries({ queryKey: ["calendar"] });
    } catch (e) {
      if (requireInteraction(e)) {
        void instance.acquireTokenRedirect({
          account,
          scopes: [...GRAPH_SCOPES],
        });
        return;
      }
      toast.error("Microsoft 365 connection failed");
    }
  }, [account, instance, qc]);

  const saveCapture = useCallback(async () => {
    const trimmed = captureText.trim();
    if (!trimmed) return;
    const input: CaptureInput = {
      title: trimmed.split("\n")[0].slice(0, 120) || "Capture",
      body: trimmed,
      recordType: "CAPTURE",
      status: "INBOX",
      actor,
      environment: "PUBLICLOGIC",
      module: "DASHBOARD",
      sourceUrl: window.location.href,
    };
    if (!sp) {
      enqueueLocalArchieveItem(input);
      setCaptureText("");
      toast.success("Saved locally (offline)");
      return;
    }
    try {
      await createArchieveRecord(sp as any, input);
      setCaptureText("");
      await qc.invalidateQueries({ queryKey: ["archieve"] });
      toast.success("Recorded");
    } catch (e) {
      toast.error("Failed to record");
    }
  }, [captureText, sp, actor, qc]);

  // Calendar query (today)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const startStr = todayStart.toISOString();
  const endStr = todayEnd.toISOString();

  const {
    data: calendarEvents = [],
    isLoading: calendarLoading,
    error: calendarError,
  } = useQuery<CalendarEvent[]>({
    queryKey: ["calendar", format(new Date(), "yyyy-MM-dd")],
    queryFn: async () => {
      const tokenRes = await instance.acquireTokenSilent({
        scopes: GRAPH_SCOPES,
        account: account!,
      });
      return getUserCalendarView(tokenRes.accessToken, startStr, endStr);
    },
    enabled: !!account,
  });

  // Archieve records query
  const {
    data: archieveRecords = [],
    isLoading: archieveLoading,
  } = useQuery<ArchieveRecord[]>({
    queryKey: ["archieve"],
    queryFn: () => listArchieveRecords(sp!),
    enabled: !!sp,
  });

  const recentRecords = useMemo(() => {
    return [...archieveRecords].sort(sortByCreatedDate).slice(0, 5);
  }, [archieveRecords]);

  return (
    <div>
      <PageHeader
        title="Good morning"
        subtitle="Capture what’s emerging, then move work forward in ARCHIEVE."
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => void connectGraphIfNeeded()}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Connect Microsoft 365
            </Button>
            <Button asChild className="rounded-full">
              <a
                href="https://publiclogic978.sharepoint.com/sites/PL"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open SharePoint
              </a>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Capture Card */}
        <Card className="lg:col-span-7 rounded-3xl p-6">
          <div className="text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
            Capture
          </div>
          <div className="mt-2 text-sm font-semibold text-muted-foreground">
            Capture issues, decisions, observations, or links. Everything is recorded in ARCHIEVE so nothing gets lost.
          </div>
          {localQueueCount > 0 && (
            <div className="mt-4 flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>{localQueueCount} offline item{localQueueCount > 1 ? "s" : ""} queued</span>
              {sp && (
                <Button size="sm" variant="outline" onClick={() => void syncQueue()}>
                  Sync now
                </Button>
              )}
            </div>
          )}
          <Textarea
            className="mt-4 min-h-[180px]"
            placeholder="Capture an issue, decision, observation, or link…"
            value={captureText}
            onChange={(e) => setCaptureText(e.target.value)}
          />
          <div className="mt-4 flex gap-2">
            <Button
              className="rounded-full"
              onClick={() => void saveCapture()}
              disabled={!captureText.trim()}
            >
              <NotebookPen className="mr-2 h-4 w-4" />
              Record
            </Button>
          </div>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-5 grid gap-6">
          {/* Environments / Status */}
          <Card className="rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
              <Landmark className="h-4 w-4" />
              Environments
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold font-mono">24</div>
                <div className="text-sm text-muted-foreground">Connections</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-mono">42<span className="text-xl">TB</span></div>
                <div className="text-sm text-muted-foreground">Storage Load</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-mono">14</div>
                <div className="text-sm text-muted-foreground">Active Nodes</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                {sp ? (
                  <>
                    <div className="h-3 w-3 rounded-full bg-green-600 animate-pulse" />
                    <span className="text-sm font-medium">Archive connected</span>
                  </>
                ) : isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Connecting to archive…</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Archive disconnected</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {calendarEvents || calendarLoading ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Software verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm">Microsoft 365 not connected</span>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Today’s Schedule */}
          <Card className="rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
              <CalendarClock className="h-4 w-4" />
              Today’s schedule
            </div>
            <div className="mt-4 space-y-3">
              {calendarLoading ? (
                <div className="text-sm text-muted-foreground">Loading calendar…</div>
              ) : calendarError ? (
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-amber-600">Calendar not connected</div>
                  <Button size="sm" variant="outline" onClick={() => void connectGraphIfNeeded()}>
                    Connect Microsoft 365
                  </Button>
                </div>
              ) : calendarEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">No events today.</div>
              ) : (
                calendarEvents.map((event) => (
                  <div key={event.id} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-sm">
                        {event.start?.dateTime && format(new Date(event.start.dateTime), "h:mm a")} {" "}
                        {event.subject}
                      </div>
                    </div>
                    {event.webLink && (
                      <a href={event.webLink} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Work – full width */}
      <Card className="mt-6 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-muted-foreground">
            <FileText className="h-4 w-4" />
            Recent Work
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={getArchieveListUrl()} target="_blank" rel="noreferrer">
              View all <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        </div>
        {archieveLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading records…</div>
        ) : recentRecords.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No recent records.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRecords.map((record) => (
                <TableRow key={record.itemId || record.RecordId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {record.Title || "Untitled"}
                      {record.webUrl && (
                        <a href={record.webUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{record.RecordType || "Record"}</TableCell>
                  <TableCell>{getRelativeTime(record.CreatedAt || record.Created)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.Status)}>
                      {record.Status || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
