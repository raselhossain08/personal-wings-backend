import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Sanitize request body
    if (request.body) {
      request.body = this.sanitizeObject(request.body);
    }

    // Sanitize query parameters
    if (request.query) {
      request.query = this.sanitizeObject(request.query);
    }

    // Sanitize URL parameters
    if (request.params) {
      request.params = this.sanitizeObject(request.params);
    }

    // Sanitize response data
    return next.handle().pipe(
      map(data => this.sanitizeResponse(data)),
    );
  }

  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove inline event handlers
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/data:text\/html/gi, '') // Remove data:text/html
      .trim();
  }

  private sanitizeResponse(data: any): any {
    // Remove sensitive fields from response
    if (data && typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.map(item => this.removeSensitiveFields(item));
      }
      return this.removeSensitiveFields(data);
    }
    return data;
  }

  private removeSensitiveFields(obj: any): any {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const sensitiveFields = [
      'password',
      'passwordHash',
      'salt',
      'securityToken',
      'resetToken',
      'verificationToken',
      '__v',
    ];

    const cleaned: any = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      // Skip sensitive fields
      if (sensitiveFields.includes(key)) {
        continue;
      }

      // Recursively clean nested objects
      if (value && typeof value === 'object') {
        cleaned[key] = this.removeSensitiveFields(value);
      } else {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }
}
