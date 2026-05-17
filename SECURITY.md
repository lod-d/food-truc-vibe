# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| V1 Beta (current) | ✅ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Send a detailed report to: **loic.deladev@gmail.com**

Include in your report:
- A description of the vulnerability and its potential impact
- Steps to reproduce the issue
- Any proof-of-concept code (if applicable)
- Your suggested fix (optional but appreciated)

You will receive an acknowledgement within **48 hours** and a status update within **7 days**.

## Disclosure Policy

- We ask that you give us reasonable time to address the issue before any public disclosure
- We will credit you in the fix commit (unless you prefer to remain anonymous)
- We will not take legal action against researchers acting in good faith

## Scope

The following are **in scope**:

- SQL injection via API parameters or the registration form
- Cross-site scripting (XSS) in truck name, description, or address fields
- File upload vulnerabilities (photo upload in registration wizard)
- Mass assignment vulnerabilities in Eloquent models
- Authentication bypass (if authentication is added in future versions)

The following are **out of scope** for V1 Beta:

- Rate limiting (not implemented in V1)
- Denial of service attacks
- Social engineering of maintainers
- Issues in third-party services (Nominatim, CartoDB tiles)

## Security Considerations in the Codebase

- All primary keys are UUIDs — sequential ID enumeration is not possible
- Photo uploads are stored via Laravel's `store()` method with public disk — validated as `image`, max 2MB
- All form input goes through `StoreTruckRequest` validation before reaching the model layer
- The Haversine SQL query uses parameterized bindings — not vulnerable to SQL injection
- No user authentication in V1 — no session hijacking surface
