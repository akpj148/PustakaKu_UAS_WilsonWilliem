"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  stock: number;
  description: string;
};

type NewBook = Omit<Book, "id">;

type BookStoreValue = {
  books: Book[];
  ready: boolean;
  dataError: string | null;
  refreshBooks: () => void;
  addBook: (book: NewBook) => Promise<Book>;
};

type StoreSnapshot = {
  books: Book[];
  ready: boolean;
  dataError: string | null;
};

const serverSnapshot: StoreSnapshot = {
  books: [],
  ready: false,
  dataError: null,
};

let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

export function isBook(value: unknown): value is Book {
  if (typeof value !== "object" || value === null) return false;
  const book = value as Record<string, unknown>;

  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.category === "string" &&
    typeof book.year === "number" &&
    typeof book.stock === "number" &&
    typeof book.description === "string"
  );
}

function isBookList(value: unknown): value is Book[] {
  return Array.isArray(value) && value.every(isBook);
}

function getErrorMessage(value: unknown, fallback: string) {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return fallback;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function publish(nextSnapshot: StoreSnapshot) {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

const BookStoreContext = createContext<BookStoreValue | null>(null);

export function BookStoreProvider({ children }: { children: ReactNode }) {
  const currentSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const loadBooks = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/buku", {
        cache: "no-store",
        signal,
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(payload, "Koleksi buku gagal dimuat."));
      }
      if (!isBookList(payload)) {
        throw new Error("Format data koleksi dari server tidak valid.");
      }

      publish({ books: payload, ready: true, dataError: null });
    } catch (error) {
      if (signal?.aborted) return;
      console.error("Koleksi buku gagal dimuat dari API.", error);
      publish({
        books: [],
        ready: true,
        dataError:
          error instanceof Error
            ? error.message
            : "Koleksi buku gagal dimuat dari server.",
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadBooks(controller.signal);
    return () => controller.abort();
  }, [loadBooks]);

  const refreshBooks = useCallback(() => {
    publish({ ...snapshot, ready: false, dataError: null });
    void loadBooks();
  }, [loadBooks]);

  const addBook = useCallback(async (newBook: NewBook) => {
    const response = await fetch("/api/buku", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });
    const payload: unknown = await response.json();

    if (!response.ok) {
      throw new Error(getErrorMessage(payload, "Buku gagal disimpan."));
    }
    if (!isBook(payload)) {
      throw new Error("Server mengembalikan format buku yang tidak valid.");
    }

    publish({
      books: [payload, ...snapshot.books],
      ready: true,
      dataError: null,
    });
    return payload;
  }, []);

  const value = useMemo(
    () => ({
      books: currentSnapshot.books,
      ready: currentSnapshot.ready,
      dataError: currentSnapshot.dataError,
      refreshBooks,
      addBook,
    }),
    [currentSnapshot, refreshBooks, addBook],
  );

  return (
    <BookStoreContext.Provider value={value}>
      {children}
    </BookStoreContext.Provider>
  );
}

export function useBookStore() {
  const store = useContext(BookStoreContext);
  if (!store) {
    throw new Error("useBookStore harus digunakan di dalam BookStoreProvider.");
  }
  return store;
}
