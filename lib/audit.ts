import "server-only";
import { db } from "./db";

/**
 * The audit trail.
 *
 * Scoped to actions a person might later need accounting for: who published a
 * change, who moved a lead, who opened a client's RFP, who signed in. It is not
 * an event log of everything the application does — with one owner and two
 * colleagues, a firehose is just a thing nobody reads.
 *
 * Writing an audit row must never break the action it is recording. A failure
 * here is logged and swallowed: losing the note that a status changed is bad,
 * failing the status change itself is worse.
 */

export type AuditAction =
  | "sign_in"
  | "sign_out"
  | "content_save"
  | "content_publish"
  | "media_upload"
  | "media_delete"
  | "enquiry_status"
  | "enquiry_note"
  | "enquiry_assign"
  | "document_access"
  | "user_create"
  | "settings_save";

export function recordAudit(
  actor: { id?: number; email?: string } | null,
  action: AuditAction,
  entity = "",
  entityId: string | number = "",
  metadata?: Record<string, unknown>,
): void {
  try {
    db()
      .prepare(
        `INSERT INTO audit_logs (actor_id, actor_email, action, entity, entity_id, metadata)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        actor?.id ?? null,
        actor?.email ?? "",
        action,
        entity,
        String(entityId),
        metadata ? JSON.stringify(metadata) : "",
      );
  } catch (error) {
    console.error(`[audit] could not record ${action}`, error);
  }
}

export interface AuditRow {
  id: number;
  actor_email: string;
  action: AuditAction;
  entity: string;
  entity_id: string;
  metadata: string;
  created_at: string;
}

export function recentAudit(limit = 50): AuditRow[] {
  return db()
    .prepare(`SELECT * FROM audit_logs ORDER BY created_at DESC, id DESC LIMIT ?`)
    .all(limit) as unknown as AuditRow[];
}
