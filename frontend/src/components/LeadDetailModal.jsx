const statuses = ['new', 'contacted', 'qualified', 'not_interested', 'converted'];
const appointmentStatuses = [
  'unbooked',
  'booked',
  'confirmed',
  'completed',
  'cancelled',
];

function LeadDetailModal({
  lead,
  onClose,
  onStatusChange,
  onAppointmentStatusChange,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginTop: 0 }}>Lead Detail</h3>
          <button onClick={onClose} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            Close
          </button>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div>
            <strong>Name:</strong> {lead.full_name}
          </div>
          <div>
            <strong>Email:</strong> {lead.email}
          </div>
          <div>
            <strong>Phone:</strong> {lead.phone || '—'}
          </div>
          <div>
            <strong>Service:</strong> {lead.service_type}
          </div>
          <div>
            <strong>Budget:</strong> {lead.budget_range || '—'}
          </div>
          <div>
            <strong>Timeframe:</strong> {lead.timeframe || '—'}
          </div>
          <div>
            <strong>Source:</strong> {lead.source || '—'}
          </div>
          <div>
            <strong>Status:</strong> {lead.status}
          </div>
          <div>
            <strong>Appointment time:</strong>{' '}
            {lead.appointment_time
              ? new Date(lead.appointment_time).toLocaleString()
              : '—'}
          </div>
          <div>
            <strong>Appointment status:</strong> {lead.appointment_status || 'unbooked'}
          </div>
          <div>
            <strong>Client timezone:</strong> {lead.client_timezone || '—'}
          </div>
          <div>
            <strong>Project description:</strong>
            <p>{lead.project_description || '—'}</p>
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <label>Update status</label>
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value)}
            style={{ width: '100%', marginTop: '6px' }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {onAppointmentStatusChange && (
          <div style={{ marginTop: '12px' }}>
            <label>Update appointment status</label>
            <select
              value={lead.appointment_status || 'unbooked'}
              onChange={(e) => onAppointmentStatusChange(lead.id, e.target.value)}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {appointmentStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeadDetailModal;
