"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toggleSlideActive, deleteSlide, reorderSlides } from "./actions";
import { useToast } from "../components/Toast";
import type { HeroSlide } from "./page";

export default function AdminSlidesClient({ slides: initial }: { slides: HeroSlide[] }) {
  const router = useRouter();
  const toast = useToast();
  const [slides, setSlides] = useState(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const dragIndex = useRef<number | null>(null);

  // ── Drag-to-reorder ────────────────────────────────────────────────────
  function onDragStart(e: React.DragEvent, index: number) {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIdx(index);
  }

  function onDragEnd() {
    dragIndex.current = null;
    setDragOverIdx(null);
  }

  async function onDrop(index: number) {
    const from = dragIndex.current;
    setDragOverIdx(null);
    dragIndex.current = null;
    if (from === null || from === index) return;

    const next = [...slides];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setSlides(next);

    setReordering(true);
    try {
      await reorderSlides(next.map((s) => s.id));
      toast.success("Order saved");
      router.refresh();
    } catch {
      toast.error("Failed to save order");
      setSlides(slides);
    } finally {
      setReordering(false);
    }
  }

  // ── Toggle active ───────────────────────────────────────────────────────
  async function handleToggle(slide: HeroSlide) {
    setLoadingId(slide.id);
    try {
      await toggleSlideActive(slide.id, slide.is_active);
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_active: !s.is_active } : s))
      );
      toast.success(slide.is_active ? `"${slide.heading}" hidden` : `"${slide.heading}" visible`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoadingId(null);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────
  async function handleDelete(slide: HeroSlide) {
    setLoadingId(slide.id);
    setConfirmDeleteId(null);
    try {
      await deleteSlide(slide.id);
      setSlides((prev) => prev.filter((s) => s.id !== slide.id));
      toast.success("Slide deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      setLoadingId(null);
    }
  }

  if (slides.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px",
          background: "#FFFFFF",
          borderRadius: 10,
          border: "0.5px solid #E8E6E0",
        }}
      >
        <i
          className="ti ti-photo-off"
          style={{ fontSize: 32, color: "#ccc", display: "block", marginBottom: 12 }}
        />
        <p style={{ color: "#aaa", marginBottom: 16, fontSize: 14 }}>No slides yet.</p>
        <Link
          href="/admin/slides/new"
          style={{
            padding: "8px 18px",
            background: "#0D1E3D",
            color: "#E8D5A3",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Add your first slide
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {reordering && (
        <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", margin: 0 }}>
          Saving order…
        </p>
      )}

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          draggable
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDrop={() => onDrop(index)}
          onDragEnd={onDragEnd}
          style={{
            background: "#FFFFFF",
            border:
              dragOverIdx === index ? "1.5px solid #0D1E3D" : "0.5px solid #E8E6E0",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: loadingId === slide.id ? 0.5 : 1,
            cursor: "grab",
            transition: "border-color 0.1s, opacity 0.15s",
          }}
        >
          {/* Drag handle */}
          <i
            className="ti ti-grip-vertical"
            style={{ fontSize: 18, color: "#ccc", flexShrink: 0 }}
          />

          {/* Background swatch */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              flexShrink: 0,
              overflow: "hidden",
              backgroundColor: slide.bg_color || "#0D1E3D",
              backgroundImage: slide.bg_image_url ? `url('${slide.bg_image_url}')` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "0.5px solid #E8E6E0",
            }}
          />

          {/* Order number */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#ccc",
              minWidth: 18,
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {index + 1}
          </span>

          {/* Text preview */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              {slide.badge && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#E8D5A3",
                    background: "#0D1E3D",
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  {slide.badge}
                </span>
              )}
              {!slide.is_active && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: "#aaa",
                    background: "#F5F3F0",
                    border: "0.5px solid #E8E6E0",
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}
                >
                  Hidden
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a1a",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {slide.heading || "(no heading)"}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#888",
                margin: "2px 0 0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {slide.subheadline}
            </p>
          </div>

          {/* Active toggle */}
          <button
            onClick={() => handleToggle(slide)}
            disabled={loadingId === slide.id}
            title={slide.is_active ? "Click to hide" : "Click to show"}
            style={{
              position: "relative",
              width: 36,
              height: 20,
              borderRadius: 99,
              background: slide.is_active ? "#0D1E3D" : "#E8E6E0",
              border: "none",
              cursor: loadingId === slide.id ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              flexShrink: 0,
              padding: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: slide.is_active ? 18 : 3,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: slide.is_active ? "#E8D5A3" : "#FFFFFF",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                transition: "left 0.2s",
              }}
            />
          </button>

          {/* Actions */}
          {confirmDeleteId === slide.id ? (
            <div
              style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}
            >
              <span style={{ fontSize: 11, color: "#555" }}>Delete?</span>
              <button
                onClick={() => handleDelete(slide)}
                disabled={loadingId === slide.id}
                style={{
                  padding: "4px 10px",
                  background: "#A32D2D",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  padding: "4px 10px",
                  background: "#F5F3F0",
                  color: "#555",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <Link
                href={`/admin/slides/${slide.id}`}
                title="Edit"
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F5F3F0",
                  border: "0.5px solid #E8E6E0",
                  borderRadius: 6,
                  color: "#555",
                  textDecoration: "none",
                }}
              >
                <i className="ti ti-pencil" style={{ fontSize: 14 }} />
              </Link>
              <button
                onClick={() => setConfirmDeleteId(slide.id)}
                disabled={loadingId === slide.id}
                title="Delete"
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FCEBEB",
                  border: "0.5px solid #F09595",
                  borderRadius: 6,
                  color: "#A32D2D",
                  cursor: "pointer",
                }}
              >
                <i className="ti ti-trash" style={{ fontSize: 14 }} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
