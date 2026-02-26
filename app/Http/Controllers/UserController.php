<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Hanya Admin yang dapat mengakses halaman ini.');
        }

        $query = User::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('nip', 'like', "%{$request->search}%")
                    ->orWhere('job_title', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('users/index', [
            'users'   => $query->latest()->get(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|string|email|max:255|unique:users',
            'nip'       => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:100',
            'phone'     => 'nullable|string|max:20',
            'password'  => ['required', 'confirmed', Rules\Password::defaults()],
            'role'      => 'required|in:admin,user',
        ]);

        User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'nip'       => $data['nip'],
            'job_title' => $data['job_title'],
            'phone'     => $data['phone'],
            'password'  => Hash::make($data['password']),
            'role'      => $data['role'],
        ]);

        return redirect()->back()->with('success', 'User baru berhasil didaftarkan.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            // PENTING: unique:users,email,'.$user->id mengizinkan email yang sama milik user ini
            'email'     => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'nip'       => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:100',
            'phone'     => 'nullable|string|max:20',
            'role'      => 'required|in:admin,user',
        ]);

        if ($request->filled('password')) {
            $request->validate([
                'password' => ['confirmed', Rules\Password::defaults()],
            ]);
            $user->password = Hash::make($request->password);
        }

        $user->update([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'nip'       => $validated['nip'],
            'job_title' => $validated['job_title'],
            'phone'     => $validated['phone'],
            'role'      => $validated['role'],
        ]);

        return redirect()->back()->with('success', 'Akun berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        if (Auth::id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun sendiri.');
        }

        $user->delete();
        return redirect()->back()->with('success', 'Akun berhasil dihapus.');
    }
}
