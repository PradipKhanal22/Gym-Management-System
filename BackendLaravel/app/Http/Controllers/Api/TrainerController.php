<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TrainerController extends Controller
{
    /**
     * Display a listing of all trainers.
     */
    public function index()
    {
        $trainers = Trainer::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Trainers retrieved successfully',
            'data' => $trainers
        ], 200);
    }

    /**
     * Store a newly created trainer.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('trainers', 'public');
        }

        $trainer = Trainer::create([
            'name' => $request->name,
            'specialty' => $request->specialty,
            'description' => $request->description,
            'photo_path' => $photoPath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trainer created successfully',
            'data' => $trainer
        ], 201);
    }

    /**
     * Display the specified trainer.
     */
    public function show(string $id)
    {
        $trainer = Trainer::findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Trainer retrieved successfully',
            'data' => $trainer
        ], 200);
    }

    /**
     * Update the specified trainer.
     */
    public function update(Request $request, string $id)
    {
        $trainer = Trainer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'specialty' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $photoPath = $trainer->photo_path;
        if ($request->hasFile('photo')) {
            if ($photoPath && Storage::disk('public')->exists($photoPath)) {
                Storage::disk('public')->delete($photoPath);
            }
            $photoPath = $request->file('photo')->store('trainers', 'public');
        }

        $trainer->update([
            'name' => $request->name,
            'specialty' => $request->specialty,
            'description' => $request->description,
            'photo_path' => $photoPath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Trainer updated successfully',
            'data' => $trainer
        ], 200);
    }

    /**
     * Remove the specified trainer.
     */
    public function destroy(string $id)
    {
        $trainer = Trainer::findOrFail($id);

        if ($trainer->photo_path && Storage::disk('public')->exists($trainer->photo_path)) {
            Storage::disk('public')->delete($trainer->photo_path);
        }

        $trainer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Trainer deleted successfully'
        ], 200);
    }
}
