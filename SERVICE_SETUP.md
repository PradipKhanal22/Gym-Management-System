# Service Management System - Complete Setup

## ✅ What's Been Implemented

### Backend (Laravel)
1. **Service Model** (`app/Models/Service.php`)
   - Fillable fields: name, description, photo_path

2. **Service Controller** (`app/Http/Controllers/Api/ServiceController.php`)
   - `index()` - GET /api/services - Get all services
   - `store()` - POST /api/services - Create service
   - `show()` - GET /api/services/{id} - Get single service
   - `update()` - PUT /api/services/{id} - Update service
   - `destroy()` - DELETE /api/services/{id} - Delete service

3. **API Routes** (`routes/api.php`)
   - Resource route added for services

### Frontend (React)
1. **API Configuration** (`src/constant/api.js`)
   - Base URL: http://localhost:8000/api
   - All service API functions with proper FormData handling

2. **Admin Pages**
   - `ServiceList.tsx` - View all services with search, edit, delete
   - `AddService.tsx` - Create new service with photo upload
   - `EditService.tsx` - Update existing service

3. **Routes** (`App.tsx`)
   - /admin/services - Service list
   - /admin/services/add - Add service
   - /admin/services/edit/:id - Edit service

## 🚀 How to Run

### Backend Setup
```bash
cd BackendLaravel

# Make sure migrations are run
php artisan migrate

# Create storage link for images
php artisan storage:link

# Start Laravel server
php artisan serve
```

### Frontend Setup
```bash
cd FrontendReact

# Install dependencies if needed
npm install

# Start React dev server
npm run dev
```

## 📝 How It Works

### Adding a Service
1. Go to `/admin/services`
2. Click "Add Service" button
3. Fill in service name and description
4. Upload a photo (optional)
5. Click "Create Service"
6. API sends FormData to Laravel
7. Laravel stores photo in `storage/app/public/services/`
8. Service is saved to database
9. Redirects back to service list

### Editing a Service
1. Click "Edit" on any service card
2. Form pre-fills with existing data
3. Change any field or upload new photo
4. Click "Update Service"
5. Old photo is deleted if new one uploaded
6. Service is updated in database

### Deleting a Service
1. Click "Delete" on any service card
2. Confirm deletion
3. Photo is deleted from storage
4. Service is removed from database

## 🎨 Features

- ✅ Full CRUD operations
- ✅ Image upload with preview
- ✅ Search functionality
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Confirmation dialogs
- ✅ Clean API structure
- ✅ FormData for file uploads
- ✅ Automatic photo cleanup

## 📂 File Structure

```
BackendLaravel/
├── app/
│   ├── Models/Service.php
│   └── Http/Controllers/Api/ServiceController.php
├── routes/api.php
└── storage/app/public/services/ (photo storage)

FrontendReact/
├── src/constant/api.js (API functions)
├── pages/admin/
│   ├── services/
│   │   ├── ServiceList.tsx
│   │   ├── AddService.tsx
│   │   └── EditService.tsx
│   └── Sidebar.tsx
└── App.tsx (routes)
```

## 🔧 API Endpoints

All endpoints return JSON with this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {...} // or array
}
```

### GET /api/services
Returns all services

### POST /api/services
Create new service
- Body: FormData with name, description, photo

### GET /api/services/{id}
Get single service

### PUT /api/services/{id}
Update service (use POST with _method=PUT for FormData)
- Body: FormData with name, description, photo, _method

### DELETE /api/services/{id}
Delete service and its photo

## 🎯 Next Steps

This same pattern can be used for:
- Categories
- Products
- Trainers
- Membership plans
- Orders
- Contact messages

Just copy the service implementation and adjust the fields!
