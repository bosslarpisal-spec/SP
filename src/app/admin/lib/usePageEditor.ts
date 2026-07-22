"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { saveContentField } from "@/app/admin/content/actions";
import { th } from "@/app/admin/lib/admin-th";

type FieldMeta = Record<string, { section: string; key: string }>;

export function usePageEditor(
  page: string,
  fieldMeta: FieldMeta,
  sectionFields: Record<string, string[]>,
  fieldDefaults: Record<string, string>
) {
  const [loaded, setLoaded] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [initialFields, setInitialFields] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("page_content")
        .select("section, key, value")
        .eq("page", page);
      const rows = data ?? [];
      const computed: Record<string, string> = {};
      for (const [k, meta] of Object.entries(fieldMeta)) {
        const row = rows.find(
          (r: { section: string; key: string; value: string }) =>
            r.section === meta.section && r.key === meta.key
        );
        computed[k] = row?.value ?? fieldDefaults[k] ?? "";
      }
      setFields(computed);
      setInitialFields(computed);
      setLoaded(true);
    })();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  function updateField(fieldKey: string, value: string, section: string) {
    setFields(p => ({ ...p, [fieldKey]: value }));
    setDirty(p => ({ ...p, [section]: true }));
    setSaved(p => ({ ...p, [section]: false }));
  }

  async function saveSection(section: string) {
    const snap = { ...fields };
    setSaving(p => ({ ...p, [section]: true }));
    try {
      for (const k of sectionFields[section]) {
        const { section: s, key } = fieldMeta[k];
        const result = await saveContentField(page, s, key, snap[k] ?? "");
        if (!result.ok) {
          alert(th.saveFail);
          return;
        }
      }
      setDirty(p => ({ ...p, [section]: false }));
      setSaved(p => ({ ...p, [section]: true }));
      setInitialFields(p => {
        const u = { ...p };
        for (const k of sectionFields[section]) u[k] = snap[k] ?? "";
        return u;
      });
      setTimeout(() => setSaved(p => ({ ...p, [section]: false })), 3000);
    } catch (err) {
      console.error(err);
      alert(th.saveFail);
    } finally {
      setSaving(p => ({ ...p, [section]: false }));
    }
  }

  function discardSection(section: string) {
    setFields(p => {
      const u = { ...p };
      for (const k of sectionFields[section]) u[k] = initialFields[k] ?? "";
      return u;
    });
    setDirty(p => ({ ...p, [section]: false }));
    setSaved(p => ({ ...p, [section]: false }));
  }

  return { loaded, fields, setFields, dirty, saving, saved, updateField, saveSection, discardSection };
}
