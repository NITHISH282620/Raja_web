import "server-only";
import { query, execute } from "./db/neon";

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

export async function recordAudit(
  actor: { id?: string; email?: string } | null,
  action: AuditAction,
  entity = "",
  entityId: string | number = "",
  metadata?: Record<string, unknown>,
): Promise<void> {
  try {
    await execute(
      `INSERT INTO audit_logs (id, actor_user_id, actor_email, action, entity_type, entity_id, metadata)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6::jsonb)`,
      [actor?.id ?? null, actor?.email ?? "", action, entity, String(entityId),
       JSON.stringify(metadata ?? {})],
    );
  } catch (error) {
    console.error(`[audit] could not record ${action}`, error);
  }
}

export interface AuditRow {
  id: string;
  actor_email: string;
  action: AuditAction;
  entity: string;
  entity_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function recentAudit(limit = 50): Promise<AuditRow[]> {
  return (await query<AuditRow>(
    `SELECT id, actor_email, action, entity_type AS entity, entity_id, metadata, created_at
       FROM audit_logs ORDER BY created_at DESC LIMIT $1`,
    [limit],
  )) as AuditRow[];
}
