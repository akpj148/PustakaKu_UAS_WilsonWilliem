import { prisma } from "../lib/prisma-client";

const demoBooks = [
  {
    id: "1001",
    title: "Laut yang Menyimpan Cerita",
    author: "Nara Adiwijaya",
    category: "Fiksi",
    year: 2022,
    stock: 4,
    description:
      "Di sebuah kota pesisir, seorang penjaga mercusuar menemukan catatan-catatan lama yang mengubah cara pandangnya tentang rumah, kehilangan, dan keberanian untuk memulai lagi.",
  },
  {
    id: "1002",
    title: "Kebun Kecil di Ujung Kota",
    author: "Mira Sekar",
    category: "Pengembangan Diri",
    year: 2021,
    stock: 2,
    description:
      "Kisah dan refleksi sederhana tentang membangun kebiasaan baik, merawat hubungan, dan menemukan ruang untuk bertumbuh di tengah kesibukan sehari-hari.",
  },
  {
    id: "1003",
    title: "Atlas Bintang Nusantara",
    author: "Raka Pradipta",
    category: "Sains",
    year: 2024,
    stock: 0,
    description:
      "Pengantar populer untuk mengenal langit malam, rasi bintang, dan cara masyarakat kepulauan memaknai alam semesta dari generasi ke generasi.",
  },
  {
    id: "1004",
    title: "Jejak di Kota Lama",
    author: "Dian Puspita",
    category: "Sejarah",
    year: 2019,
    stock: 6,
    description:
      "Catatan perjalanan menyusuri bangunan, arsip, dan kisah warga yang membentuk wajah sebuah kota dari masa ke masa.",
  },
  {
    id: "1005",
    title: "Ruang untuk Pulang",
    author: "Bima Aksara",
    category: "Fiksi",
    year: 2023,
    stock: 1,
    description:
      "Dua sahabat lama bertemu kembali dan belajar bahwa pulang bukan selalu tentang tempat, tetapi juga tentang orang-orang yang bersedia mendengarkan.",
  },
];

async function main() {
  if ((await prisma.book.count()) > 0) return;

  await prisma.$transaction(async (transaction) => {
    for (const book of demoBooks) {
      const { category: categoryName, ...bookData } = book;
      const category = await transaction.category.upsert({
        where: { name: categoryName },
        create: { name: categoryName },
        update: {},
      });

      await transaction.book.create({
        data: {
          ...bookData,
          categoryId: category.id,
        },
      });
    }
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed database gagal.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
