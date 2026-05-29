# Security Policy

## Security Measures Implemented

### Authentication & Authorization
- ✅ **JWT-based authentication** with secure token generation
- ✅ **bcrypt password hashing** with 10 salt rounds
- ✅ **Role-based access control** (MEMBER, RACE_OFFICER, ADMIN)
- ✅ **Token expiration**: Access tokens (15min), Refresh tokens (7 days)
- ✅ **Mandatory JWT_SECRET**: Application fails to start without proper configuration

### API Security
- ✅ **CORS configuration** with origin restrictions
- ✅ **Input validation** via Prisma schema constraints
- ✅ **Authentication middleware** protecting sensitive endpoints
- ✅ **Error handling** without exposing sensitive information in production

### Data Protection
- ✅ **Password hashing** - Passwords never stored in plain text
- ✅ **Environment variables** for sensitive configuration
- ✅ **Database connection** secured via environment variables
- ✅ **.gitignore** prevents committing sensitive files (.env, node_modules)

## Critical Security Requirements

### Before Deployment

1. **JWT Secret** (CRITICAL)
   - Generate a strong, random JWT secret (minimum 32 characters)
   - Use a cryptographically secure random generator
   - Example: `openssl rand -base64 32`
   - Set in production environment variables
   - **NEVER** commit JWT_SECRET to version control

2. **Database Credentials**
   - Use strong, unique passwords for database users
   - Restrict database access to application servers only
   - Use SSL/TLS for database connections in production

3. **Environment Variables**
   - Set `NODE_ENV=production` in production
   - Configure proper `CORS_ORIGIN` for your domain
   - Use secure values for all secrets

4. **HTTPS**
   - Always use HTTPS in production
   - Configure SSL/TLS certificates
   - Redirect HTTP to HTTPS

## Security Best Practices

### For Development
- ✅ Use `.env.example` as template
- ✅ Never commit `.env` files
- ✅ Use different secrets for dev/staging/production
- ✅ Keep dependencies updated

### For Production
- 🔒 Use environment-specific secrets
- 🔒 Enable rate limiting
- 🔒 Implement request logging
- 🔒 Set up monitoring and alerts
- 🔒 Regular security audits
- 🔒 Keep all dependencies updated

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainer directly rather than using the issue tracker.

## Security Checklist for Deployment

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Configure production database with strong credentials
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable security headers (helmet.js)
- [ ] Set up logging and monitoring
- [ ] Regular dependency updates
- [ ] Database backups configured
- [ ] Implement IP whitelisting (if applicable)

## Known Security Considerations

### Current Implementation
- ✅ JWT tokens stored in localStorage (consider httpOnly cookies for production)
- ✅ No rate limiting implemented (add for production)
- ✅ No request logging (add for production)
- ✅ Basic CORS configuration (enhance for production)

### Recommended Enhancements for Production
1. **Rate Limiting**: Implement express-rate-limit
2. **Security Headers**: Add helmet.js middleware
3. **Request Logging**: Add morgan or winston
4. **Input Sanitization**: Add express-validator
5. **CSRF Protection**: Implement CSRF tokens
6. **Session Management**: Consider Redis for session storage
7. **API Versioning**: Already implemented (v1)

## Security Updates

### 2026-05-29
- 🔒 **CRITICAL FIX**: Removed hardcoded JWT secret fallback
- ✅ Application now fails to start without JWT_SECRET configured
- ✅ Added security documentation

---

**Last Updated:** 2026-05-29  
**Security Contact:** See repository maintainer