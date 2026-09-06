import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct, createProduct, updateProduct, uploadFile } from "@/lib/dataApi";
import { CATEGORIES, UNITS } from "@/lib/constants";
import { ArrowLeft, Upload, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "", category: "", unit: "pcs", stock_qty: 0, price: "", cost_price: "", supplier: "", description: "", reorder_level: 10, image_url: "",
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const p = await getProduct(id);
        setForm({
          name: p.name || "", category: p.category || "", unit: p.unit || "pcs", stock_qty: p.stock_qty || 0,
          price: p.price ?? "", cost_price: p.cost_price ?? "", supplier: p.supplier || "",
          description: p.description || "", reorder_level: p.reorder_level ?? 10, image_url: p.image_url || "",
        });
      } catch (e) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await uploadFile({ file });
      handleChange("image_url", file_url);
    } catch (err) {
      setError("Failed to upload image: " + (err.message || "Unknown error"));
    }
  };

  const handleSave = async () => {
    setError("");
    if (!form.name || !form.category || form.price === "" || form.stock_qty === "") {
      setError("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        unit: form.unit,
        stock_qty: Number(form.stock_qty) || 0,
        price: Number(form.price) || 0,
        cost_price: Number(form.cost_price) || 0,
        supplier: form.supplier,
        description: form.description,
        reorder_level: Number(form.reorder_level) || 10,
        image_url: form.image_url,
      };
      if (isEdit) {
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/inventory");
    } catch (e) {
      setError(e.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-7 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate("/inventory")} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{isEdit ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Add details, upload picture, and set stock reorder boundaries.</p>
        </div>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

      {/* Form card */}
      <div className="bg-white rounded-xl border border-border p-7">
        <div className="flex justify-end gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate("/inventory")} className="h-10 px-5 border-border text-foreground font-medium">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="h-10 px-5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Product"}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Product Name <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Purefoods Corned Beef 150g" className="h-10 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Initial Stock Qty <span className="text-red-500">*</span></Label>
            <Input type="number" value={form.stock_qty} onChange={(e) => handleChange("stock_qty", e.target.value)} placeholder="0" className="h-10 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Reorder Level</Label>
            <Input type="number" value={form.reorder_level} onChange={(e) => handleChange("reorder_level", e.target.value)} placeholder="10" className="h-10 border-border" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Category <span className="text-red-500">*</span></Label>
            <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
              <SelectTrigger className="h-10 border-border bg-white"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Unit of Measure <span className="text-red-500">*</span></Label>
            <Select value={form.unit} onValueChange={(v) => handleChange("unit", v)}>
              <SelectTrigger className="h-10 border-border bg-white"><SelectValue placeholder="Select unit" /></SelectTrigger>
              <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Primary Supplier</Label>
            <Input value={form.supplier} onChange={(e) => handleChange("supplier", e.target.value)} placeholder="e.g. San Miguel Corp" className="h-10 border-border" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Selling Price (₱) <span className="text-red-500">*</span></Label>
            <Input type="number" step="0.01" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="0.00" className="h-10 border-border" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">Cost Price (₱) <span className="text-red-500">*</span></Label>
            <Input type="number" step="0.01" value={form.cost_price} onChange={(e) => handleChange("cost_price", e.target.value)} placeholder="0.00" className="h-10 border-border" />
          </div>
        </div>

        <div className="space-y-1.5 mb-6">
          <Label className="text-sm font-medium text-foreground">Product Description</Label>
          <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Write packaging details, size specs, or nutritional highlights..." className="border-border min-h-[90px]" />
        </div>

        {/* Upload */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">Product Photo</Label>
          {form.image_url ? (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-border">
              <img src={form.image_url} alt="Product" className="w-full h-full object-cover" />
              <button onClick={() => handleChange("image_url", "")} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs">×</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-64 h-44 border-2 border-dashed border-[#cbd5e0] rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm font-semibold text-foreground">Click to Upload Image</span>
              <span className="text-xs text-muted-foreground mt-1">PNG, JPG, max 5MB (Preferably square)</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}