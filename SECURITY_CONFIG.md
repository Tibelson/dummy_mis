# Security Configuration Guide

This document explains the different security configurations available in the MIS Web Backend application.

## Available Security Configurations

### 1. Default Configuration (No Profile)
- **File**: `SecurityConfig.java`
- **Profile**: `!dev` (active when dev profile is NOT active)
- **Security Level**: **BYPASSED** - All requests are permitted
- **JWT Filter**: Enabled but bypassed
- **Use Case**: Development and testing

### 2. Development Configuration
- **File**: `DevelopmentSecurityConfig.java`
- **Profile**: `dev`
- **Security Level**: **BYPASSED** - All requests are permitted
- **JWT Filter**: Disabled
- **Use Case**: Pure development without any security overhead

### 3. No Security Configuration
- **File**: `NoSecurityConfig.java`
- **Profile**: `nosecurity`
- **Security Level**: **COMPLETELY DISABLED**
- **JWT Filter**: Disabled
- **Use Case**: Maximum development flexibility

### 4. Production Configuration
- **File**: `ProductionSecurityConfig.java`
- **Profile**: `prod`
- **Security Level**: **FULL SECURITY** - Proper authentication and authorization
- **JWT Filter**: Enabled and required
- **Use Case**: Production deployment

## How to Use Different Configurations

### Option 1: Using Application Properties

Add one of these lines to `application.properties`:

```properties
# For development (no JWT filter)
spring.profiles.active=dev

# For completely disabled security
spring.profiles.active=nosecurity

# For production security
spring.profiles.active=prod

# For default (bypassed security)
# (no profile specified or comment out the line above)
```

### Option 2: Using Command Line

```bash
# Development mode
./mvnw spring-boot:run -Dspring.profiles.active=dev

# No security mode
./mvnw spring-boot:run -Dspring.profiles.active=nosecurity

# Production mode
./mvnw spring-boot:run -Dspring.profiles.active=prod

# Default mode (bypassed security)
./mvnw spring-boot:run
```

### Option 3: Using Environment Variable

```bash
# Set environment variable
export SPRING_PROFILES_ACTIVE=dev

# Run application
./mvnw spring-boot:run
```

## Security Levels Explained

### 🔓 **BYPASSED SECURITY** (Default & Dev)
- All API endpoints are accessible without authentication
- JWT tokens are not required
- Useful for:
  - Frontend development
  - API testing
  - Quick prototyping

### 🚫 **NO SECURITY** (nosecurity profile)
- Spring Security is completely disabled
- No authentication or authorization checks
- Maximum performance for development
- Useful for:
  - Performance testing
  - Debugging
  - Local development

### 🔒 **FULL SECURITY** (prod profile)
- Proper JWT authentication required
- Role-based authorization enforced
- Admin endpoints require ADMIN role
- Student endpoints require STUDENT or ADMIN role
- Useful for:
  - Production deployment
  - Security testing
  - Real-world usage

## Testing Different Configurations

### Test with Default (Bypassed Security)
```bash
./mvnw spring-boot:run
```
Then test any endpoint:
```bash
curl http://localhost:8080/api/courses
```

### Test with Development Profile
```bash
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### Test with No Security
```bash
./mvnw spring-boot:run -Dspring.profiles.active=nosecurity
```

### Test with Production Security
```bash
./mvnw spring-boot:run -Dspring.profiles.active=prod
```
Then you need to authenticate:
```bash
# First login to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use the token in subsequent requests
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8080/api/courses
```

## Switching Between Configurations

To easily switch between configurations, you can:

1. **Edit application.properties**:
   ```properties
   # Comment/uncomment the appropriate line
   # spring.profiles.active=dev
   # spring.profiles.active=nosecurity
   # spring.profiles.active=prod
   ```

2. **Use command line arguments**:
   ```bash
   # For development
   ./mvnw spring-boot:run -Dspring.profiles.active=dev
   
   # For production
   ./mvnw spring-boot:run -Dspring.profiles.active=prod
   ```

3. **Set environment variable**:
   ```bash
   export SPRING_PROFILES_ACTIVE=dev
   ./mvnw spring-boot:run
   ```

## Recommended Usage

- **Development**: Use `dev` profile for frontend development
- **Testing**: Use `nosecurity` profile for API testing
- **Production**: Use `prod` profile for deployment
- **Default**: Use no profile for general development

## Security Considerations

⚠️ **Important**: 
- Never use `dev` or `nosecurity` profiles in production
- Always use `prod` profile for production deployments
- The default configuration (bypassed security) is for development only
- JWT tokens are still generated in bypassed mode but not validated 