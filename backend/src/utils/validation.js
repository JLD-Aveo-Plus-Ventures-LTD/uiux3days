function validateLeadPayload(body) {
  const errors = [];
  if (!body.full_name) errors.push('Full name is required');
  if (!body.email) errors.push('Email is required');
  if (!body.phone) errors.push('Phone number is required');
  if (!body.service_type) errors.push('Service type is required');
  return { valid: errors.length === 0, errors };
}

module.exports = { validateLeadPayload };
