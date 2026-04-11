<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;



class AuthController extends Controller
{
    public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Email introuvable'], 404);
    }

    $token = Str::random(60);

    DB::table('password_resets')->insert([
        'email' => $request->email,
        'token' => $token,
        'created_at' => now()
    ]);

    $link = "http://localhost:3000/reset-password/$token";

    return response()->json([
        'message' => 'Lien généré',
        'link' => $link
    ]);
}
    
}
