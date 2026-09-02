export function serializeRequest(row) {
  return {
    id: row.id,
    ticket: row.ticket,
    type: row.type,
    summary: row.summary,
    name: row.name,
    dob: row.dob,
    phone: row.phone,
    email: row.email,
    status: row.status,
    fee: row.fee,
    serviceLabel: row.service_label,
    paymentMethod: row.payment_method,
    details: JSON.parse(row.details || "{}"),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
