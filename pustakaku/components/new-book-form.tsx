"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useBookStore } from "./book-store";

type FormValues = {
  title: string;
  author: string;
  category: string;
  year: string;
  stock: string;
  description: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  title: "",
  author: "",
  category: "",
  year: "",
  stock: "1",
  description: "",
};

export default function NewBookForm() {
  const router = useRouter();
  const { addBook } = useBookStore();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};
    if (!values.title.trim()) nextErrors.title = "Judul buku wajib diisi.";
    if (!values.author.trim()) nextErrors.author = "Nama penulis wajib diisi.";
    if (!values.category.trim()) nextErrors.category = "Kategori wajib diisi.";

    const year = Number(values.year);
    if (!values.year) {
      nextErrors.year = "Tahun terbit wajib diisi.";
    } else if (!Number.isInteger(year)) {
      nextErrors.year = "Tahun terbit harus berupa bilangan bulat.";
    }

    const stock = Number(values.stock);
    if (values.stock === "") {
      nextErrors.stock = "Jumlah stok wajib diisi (gunakan 0 jika habis).";
    } else if (!Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = "Stok harus berupa bilangan bulat minimal 0.";
    }
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      document
        .getElementById(Object.keys(validationErrors)[0])
        ?.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const book = await addBook({
        title: values.title.trim(),
        author: values.author.trim(),
        category: values.category.trim(),
        year: Number(values.year),
        stock: Number(values.stock),
        description: values.description.trim(),
      });
      setValues(initialValues);
      setErrors({});
      setSubmitError("");
      setSubmitting(false);
      router.push(`/buku/${book.id}`);
    } catch (error) {
      console.error("Buku baru tidak dapat ditambahkan.", error);
      setSubmitError(
        error instanceof Error ? error.message : "Buku belum dapat disimpan.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="new-book-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/buku">Daftar Buku</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Tambah buku</span>
      </nav>
      <div className="form-page-heading">
        <div className="section-kicker"><span /> CATATAN BARU</div>
        <h1 className="page-title">Tambah Buku Baru</h1>
        <p className="page-description">
          Lengkapi informasi buku untuk menambahkannya ke koleksimu.
        </p>
      </div>

      <form className="book-form" onSubmit={handleSubmit} noValidate>
        <div className="form-section-heading">
          <span className="form-section-icon" aria-hidden="true">✦</span>
          <div>
            <h2>Informasi buku</h2>
            <p>Isi detail buku yang ingin kamu simpan.</p>
          </div>
          <span className="required-note"><i>*</i> Wajib diisi</span>
        </div>

        {submitError && (
          <div className="form-alert" role="alert">{submitError}</div>
        )}

        <div className="form-grid">
          <div className={`form-field form-field-wide${errors.title ? " field-error" : ""}`}>
            <label htmlFor="title">Judul buku <span>*</span></label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Contoh: Senja di Peron Tua"
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              autoComplete="off"
              required
            />
            {errors.title && <p className="field-error-text" id="title-error">{errors.title}</p>}
          </div>

          <div className={`form-field${errors.author ? " field-error" : ""}`}>
            <label htmlFor="author">Penulis <span>*</span></label>
            <input
              id="author"
              name="author"
              type="text"
              placeholder="Nama penulis"
              value={values.author}
              onChange={(event) => updateField("author", event.target.value)}
              aria-invalid={Boolean(errors.author)}
              aria-describedby={errors.author ? "author-error" : undefined}
              autoComplete="off"
              required
            />
            {errors.author && <p className="field-error-text" id="author-error">{errors.author}</p>}
          </div>

          <div className={`form-field${errors.category ? " field-error" : ""}`}>
            <label htmlFor="category">Kategori <span>*</span></label>
            <input
              id="category"
              name="category"
              type="text"
              list="book-categories"
              placeholder="Pilih atau tulis kategori"
              value={values.category}
              onChange={(event) => updateField("category", event.target.value)}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? "category-error" : "category-hint"}
              required
            />
            <datalist id="book-categories">
              <option value="Fiksi" />
              <option value="Sains" />
              <option value="Sejarah" />
              <option value="Pengembangan Diri" />
              <option value="Pendidikan" />
              <option value="Biografi" />
            </datalist>
            {errors.category ? (
              <p className="field-error-text" id="category-error">{errors.category}</p>
            ) : (
              <p className="field-hint" id="category-hint">Pilih saran atau ketik kategori sendiri.</p>
            )}
          </div>

          <div className={`form-field${errors.year ? " field-error" : ""}`}>
            <label htmlFor="year">Tahun terbit <span>*</span></label>
            <div className="input-with-suffix">
              <input
                id="year"
                name="year"
                type="number"
                inputMode="numeric"
                placeholder="Contoh: 2025"
                value={values.year}
                onChange={(event) => updateField("year", event.target.value)}
                aria-invalid={Boolean(errors.year)}
                aria-describedby={errors.year ? "year-error" : "year-hint"}
                required
              />
              <span>Tahun</span>
            </div>
            {errors.year ? (
              <p className="field-error-text" id="year-error">{errors.year}</p>
            ) : (
              <p className="field-hint" id="year-hint">Tahun terbit berupa bilangan bulat tanpa batas minimum atau maksimum.</p>
            )}
          </div>

          <div className={`form-field${errors.stock ? " field-error" : ""}`}>
            <label htmlFor="stock">Jumlah stok <span>*</span></label>
            <div className="input-with-suffix">
              <input
                id="stock"
                name="stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="0"
                value={values.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                aria-invalid={Boolean(errors.stock)}
                aria-describedby={errors.stock ? "stock-error" : "stock-hint"}
                required
              />
              <span>Eksemplar</span>
            </div>
            {errors.stock ? (
              <p className="field-error-text" id="stock-error">{errors.stock}</p>
            ) : (
              <p className="field-hint" id="stock-hint">Gunakan 0 jika buku sedang habis.</p>
            )}
          </div>

          <div className="form-field form-field-wide">
            <label htmlFor="description">Deskripsi <small>(opsional)</small></label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Ceritakan secara singkat tentang buku ini…"
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
            />
            <p className="field-hint">Deskripsi membantu mengingat isi atau daya tarik buku.</p>
          </div>
        </div>

        <div className="form-actions">
          <Link className="button button-secondary" href="/buku">Batal</Link>
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting && <span className="button-spinner" aria-hidden="true" />}
            {submitting ? "Menyimpan…" : "Simpan Buku"}
            {!submitting && <span aria-hidden="true">↗</span>}
          </button>
        </div>
      </form>
      <p className="form-footnote">
        <span aria-hidden="true">♧</span>
        Informasi buku disimpan di database SQLite aplikasi.
      </p>
    </div>
  );
}
