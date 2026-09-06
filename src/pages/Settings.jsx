const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

import { Store, User, Sliders, Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { isDemoMode, setDemoDisplayName } from "@/lib/dataApi";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STORE_KEY = "charing_store_settings";

export default function Settings() {
  const { user, checkUserAuth } = useAuth();
  const { toast } = useToast();
  const [store, setStore] = useState({ name: "Charing's Grocery", address: "142 Rizal Avenue, Manila", tin: "102-452-921-000", vatRate: "12", currency: "PHP" });
  const [profile, setProfile] = useState({ display_name: "", role: "Active Cashier" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      try { setStore(JSON.parse(saved)); } catch {}
    }
    if (user) {
      setProfile((p) => ({ ...p, display_name: user.display_name || user.full_name || (user.email ? user.email.split("@")[0].replace(/[._]/g, " ") : "") }));
    }
  }, [user]);

  const handleStoreSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      setSaving(false);
      setSaved(true);
      toast({ title: "Settings saved", description: "Store settings updated successfully." });
      setTimeout(() => setSaved(false), 2000);
    }, 500);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      if (profile.display_name) {
        if (isDemoMode()) {
          setDemoDisplayName(profile.display_name);
        } else if (user) {
          await db.auth.updateMe({ display_name: profile.display_name });
        }
        await checkUserAuth();
      }
      toast({ title: "Profile saved", description: "Your cashier profile has been updated." });
    } catch (e) {
      toast({ title: "Error", description: e.message || "Failed to update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-7 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store profile, cashier account, and system preferences.</p>
      </div>

      {/* Store Profile */}
      <SectionCard icon={Store} title="Store Profile" desc="Information printed on receipts and invoices.">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5 col-span-2">
            <Label className="text-sm font-medium">Store Name</Label>
            <Input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} className="h-10 border-border" />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label className="text-sm font-medium">Store Address</Label>
            <Input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} className="h-10 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">VAT TIN</Label>
            <Input value={store.tin} onChange={(e) => setStore({ ...store, tin: e.target.value })} className="h-10 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">VAT Rate (%)</Label>
            <Input type="number" value={store.vatRate} onChange={(e) => setStore({ ...store, vatRate: e.target.value })} className="h-10 border-border" />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button onClick={handleStoreSave} disabled={saving} className="h-10 px-5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Saved" : "Save Changes"}
          </Button>
        </div>
      </SectionCard>

      {/* Cashier Profile */}
      <SectionCard icon={User} title="Cashier Profile" desc="Your account details shown across the app.">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Display Name</Label>
            <Input value={profile.display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value })} className="h-10 border-border capitalize" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Role</Label>
            <Input value={profile.role} disabled className="h-10 border-border bg-muted" />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label className="text-sm font-medium">Email</Label>
            <Input value={user?.email || ""} disabled className="h-10 border-border bg-muted" />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button onClick={handleProfileSave} disabled={saving} className="h-10 px-5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold">
            <Save className="w-4 h-4 mr-2" /> Update Profile
          </Button>
        </div>
      </SectionCard>

      {/* Preferences */}
      <SectionCard icon={Sliders} title="System Preferences" desc="Display and formatting options.">
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Currency</Label>
            <Select value={store.currency} onValueChange={(v) => setStore({ ...store, currency: v })}>
              <SelectTrigger className="h-10 border-border bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Default Payment Method</Label>
            <Select defaultValue="Cash">
              <SelectTrigger className="h-10 border-border bg-white"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="GCash">GCash</SelectItem>
                <SelectItem value="Maya">Maya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <Button onClick={handleStoreSave} disabled={saving} className="h-10 px-5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold">
            <Save className="w-4 h-4 mr-2" /> Save Preferences
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ icon: Icon, title, desc, children }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6 mb-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}