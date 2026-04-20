"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]           = useState<User | null>(null);
  const [loading, setLoading]     = useState(true);
  const [name, setName]           = useState("");
  const [avatar, setAvatar]       = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);
  const [pwSaved, setPwSaved]     = useState(false);
  const [pwError, setPwError]     = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      setName(data.user.user_metadata?.full_name ?? "");
      setAvatar(localStorage.getItem("sp_avatar") || data.user.user_metadata?.avatar_url || null);
      setLoading(false);
    });
  }, [router]);

  if (loading || !user) return null;

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const b64 = reader.result as string;
      setAvatar(b64);
      localStorage.setItem("sp_avatar", b64);
    };
    reader.readAsDataURL(file);
  }

  async function saveName() {
    await supabase.auth.updateUser({ data: { full_name: name } });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  async function savePassword() {
    setPwError("");
    if (newPw.length < 6) return setPwError("Password must be at least 6 characters.");
    if (newPw !== confirmPw) return setPwError("Passwords do not match.");
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) return setPwError(error.message);
    setNewPw(""); setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/home");
  }

  const initials = (name || user.email || "?")[0].toUpperCase();

  return (
    <div className="section-sm">
      <div className="container max-w-2xl">
        <div className="mb-6">
          <Link href="/home" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-8" style={{ fontFamily: "Georgia,serif" }}>
          My Profile
        </h1>

        <div className="space-y-6">
          {/* Profile Image */}
          <div className="card-flat">
            <h2 className="text-base font-semibold text-primary mb-4">Profile Image</h2>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold text-white">{initials}</span>
                }
              </div>
              <div>
                <button onClick={() => fileRef.current?.click()} className="btn-outline btn-sm">
                  Change Photo
                </button>
                <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP — max 2 MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="card-flat">
            <h2 className="text-base font-semibold text-primary mb-4">Username</h2>
            <div className="flex gap-3">
              <input className="form-input" value={name}
                onChange={e => setName(e.target.value)} placeholder="Your name" />
              <button onClick={saveName} className="btn-primary whitespace-nowrap">
                {nameSaved ? "Saved ✓" : "Save"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">{user.email}</p>
          </div>

          {/* Change Password */}
          <div className="card-flat">
            <h2 className="text-base font-semibold text-primary mb-4">Change Password</h2>
            <div className="space-y-3">
              <div>
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="••••••••"
                  value={newPw} onChange={e => setNewPw(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="••••••••"
                  value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
              </div>
              {pwError && <p className="form-error">{pwError}</p>}
              {pwSaved && <p className="text-xs text-green-600 font-medium">Password updated successfully.</p>}
              <button onClick={savePassword} className="btn-primary">Update Password</button>
            </div>
          </div>

          {/* Sign out */}
          <div className="flex justify-end pt-2">
            <button onClick={handleSignOut} className="btn-danger btn-sm">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
