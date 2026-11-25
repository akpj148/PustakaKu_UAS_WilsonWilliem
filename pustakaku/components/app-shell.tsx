"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { BookStoreProvider, useBookStore } from "./book-store";

const navigation = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/buku", label: "Daftar Buku", icon: "books" },
  { href: "/buku/baru", label: "Tambah Buku", icon: "plus" },
] as const;

function NavIcon({ name }: { name: (typeof navigation)[number]["icon"] }) {
  if (name === "home") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m3.5 10 8.5-7 8.5 7v10a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1V10Z" />
        <path d="M9 21v-7h6v7" />
      </svg>
    );
  }
  if (name === "books") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M4 5.5v16M8 7h8M8 11h7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate: () => void;
}) {
  return (
    <nav id="primary-navigation" className="side-nav" aria-label="Navigasi utama">
      {navigation.map((item) => {
        const active =
          pathname !== null &&
          (item.href === "/"
            ? pathname === "/"
            : item.href === "/buku"
              ? pathname === "/buku" || pathname.startsWith("/buku/")
              : pathname === item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link${active ? " nav-link-active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
            {active && <span className="nav-indicator" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}

function ActiveNavigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  return <NavigationLinks pathname={pathname} onNavigate={onNavigate} />;
}

function ShellContent({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const { storageError } = useBookStore();

  useEffect(() => {
    if (!drawerOpen) return;
    sidebarRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === "Tab") {
        const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === sidebarRef.current) {
          event.preventDefault();
          last.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [drawerOpen]);

  return (
    <div className="app-frame">
      {drawerOpen && (
        <button
          className="drawer-backdrop"
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        tabIndex={-1}
        className={`sidebar${drawerOpen ? " sidebar-open" : ""}`}
      >
        <Link className="brand" href="/" aria-label="PustakaKu, ke beranda">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M5 7.5A3.5 3.5 0 0 1 8.5 4H27v21H8.5A3.5 3.5 0 0 0 5 28.5v-21Z" />
              <path d="M5 7.5v21M11 10h10M11 15h10" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>PustakaKu</strong>
            <small>Ruang baca digital</small>
          </span>
        </Link>

        <div className="sidebar-label">MENU UTAMA</div>
        <Suspense
          fallback={
            <NavigationLinks
              pathname={null}
              onNavigate={() => setDrawerOpen(false)}
            />
          }
        >
          <ActiveNavigation onNavigate={() => setDrawerOpen(false)} />
        </Suspense>

        <div className="sidebar-note">
          <span className="note-icon" aria-hidden="true">✦</span>
          <p>Temukan ruang untuk cerita-cerita baru.</p>
        </div>
        <div className="sidebar-footer">
          <span className="footer-dot" aria-hidden="true" />
          <span>Perpustakaan pribadimu</span>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-title">
            <button
              ref={menuButtonRef}
              className="menu-toggle"
              type="button"
              aria-label={drawerOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={drawerOpen}
              aria-controls="primary-navigation"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <span className="eyebrow">Ruang baca digital</span>
          </div>
          <Link className="topbar-link" href="/buku">
            <span className="topbar-link-dot" aria-hidden="true" />
            Koleksi buku
          </Link>
        </header>
        {storageError && !noticeDismissed && (
          <div className="storage-notice" role="status">
            <span>{storageError}</span>
            <button
              type="button"
              aria-label="Tutup pemberitahuan"
              onClick={() => setNoticeDismissed(true)}
            >
              Tutup
            </button>
          </div>
        )}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <BookStoreProvider>
      <ShellContent>{children}</ShellContent>
    </BookStoreProvider>
  );
}
