# System Configuration API - Admin Dashboard Guide

## 🎯 Overview

All API keys and settings can now be managed from your **Admin Dashboard**! No more editing `.env` files or restarting servers.

## 🚀 Features

✅ **Manage All Integrations** - Stripe, PayPal, OpenAI, SMTP, Cloudinary, etc.  
✅ **Secure Storage** - API keys stored encrypted in MongoDB  
✅ **Real-time Updates** - Changes take effect immediately  
✅ **Masked Secrets** - API keys partially hidden in UI for security  
✅ **Test Connections** - Validate API keys before saving  
✅ **Categorized** - Organized by Payment, AI, Email, Storage, etc.  
✅ **Role-Based** - Only SUPER_ADMIN can access

---

## 📡 API Endpoints

### Base URL: `/api/system-config`

All endpoints require `SUPER_ADMIN` role authentication.

### 1. GET /system-config - Get All Configurations

### 2. GET /system-config/grouped - Get Grouped by Category

### 3. GET /system-config/:key - Get Single Config

### 4. PUT /system-config/:key - Update Config

### 5. PUT /system-config/bulk/update - Bulk Update

### 6. POST /system-config/:key/test - Test Connection

### 7. POST /system-config - Create New Config

### 8. DELETE /system-config/:key - Delete Config

---

## 📦 Pre-configured Settings

### Payment (6 settings)

- Stripe Secret Key
- Stripe Publishable Key
- Stripe Webhook Secret
- PayPal Client ID
- PayPal Client Secret
- PayPal Mode

### AI (1 setting)

- OpenAI API Key

### Email (6 settings)

- SMTP Host
- SMTP Port
- SMTP Username
- SMTP Password
- From Email
- From Name

### Storage (3 settings)

- Cloudinary Cloud Name
- Cloudinary API Key
- Cloudinary API Secret

**Total: 16 pre-configured settings ready to use!**

---

## ✨ Summary

Your admin dashboard can now manage ALL external integrations without touching code! 🎉
