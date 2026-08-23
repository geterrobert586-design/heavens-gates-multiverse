const STORAGE_PREFIX = "heavens_gates_multiverse";

const localUser = {
  id: "local-admin-robert",
  full_name: "Robert Leon Geter II",
  email: "local-admin@heavensgates.app",
  role: "admin",
};

const trilogyBooks = [
  {
    id: "hg-book-001",
    title: "The Known Beginning",
    subtitle: "Book One of the Heavens Gates Chronicles",
    book_number: 1,
    synopsis:
      "The opening gate of the Heavens Gates Chronicles. The foundation of the saga, the characters, the world, and the first movement of the empire.",
    themes: ["origin", "street wisdom", "awakening", "legacy"],
    is_published: true,
    ebook_price: 9.99,
    ebook_format: "PDF",
    ebook_file_url: "/documents/heavens-gates-book-one-the-known-beginning.pdf",
    cover_image_url: "/images/heavens-gates-book-one-cover.png",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
  {
    id: "hg-book-002",
    title: "The Heavens Rising",
    subtitle: "Book Two of the Heavens Gates Chronicles",
    book_number: 2,
    synopsis:
      "The second movement of the Heavens Gates Chronicles. The story rises, the empire expands, and the deeper forces behind the world begin to reveal themselves.",
    themes: ["rising", "empire", "conflict", "revelation"],
    is_published: true,
    ebook_price: 9.99,
    ebook_format: "PDF",
    ebook_file_url: "/documents/heavens-gates-book-two-the-heavens-rising.pdf",
    cover_image_url: "/images/heavens-gates-book-two-cover.png",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
  {
    id: "hg-book-003",
    title: "Blood Frequency",
    subtitle: "Book Three of the Heavens Gates Chronicles",
    book_number: 3,
    synopsis:
      "The third movement of the Heavens Gates Chronicles. Bloodline, frequency, inheritance, and power collide as the saga moves deeper into its hidden architecture.",
    themes: ["bloodline", "frequency", "power", "inheritance"],
    is_published: true,
    ebook_price: 9.99,
    ebook_format: "PDF",
    ebook_file_url: "/documents/heavens-gates-book-three-blood-frequency.pdf",
    cover_image_url: "/images/heavens-gates-book-three-cover.png",
    created_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
];

function storageKey(entityName) {
  return `${STORAGE_PREFIX}:${entityName}`;
}

function readRecords(entityName) {
  if (entityName === "Book") {
    seedBooksIfMissing();
  }

  try {
    return JSON.parse(localStorage.getItem(storageKey(entityName)) || "[]");
  } catch {
    return [];
  }
}

function writeRecords(entityName, records) {
  localStorage.setItem(storageKey(entityName), JSON.stringify(records));
  return records;
}

function seedBooksIfMissing() {
  const key = storageKey("Book");
  const current = localStorage.getItem(key);

  if (!current || current === "[]" || current === "null") {
    localStorage.setItem(key, JSON.stringify(trilogyBooks));
  }
}

function sortRecords(records, sortBy) {
  if (!sortBy) return records;

  const descending = sortBy.startsWith("-");
  const field = descending ? sortBy.slice(1) : sortBy;

  return [...records].sort((a, b) => {
    const av = a[field] ?? "";
    const bv = b[field] ?? "";

    if (av < bv) return descending ? 1 : -1;
    if (av > bv) return descending ? -1 : 1;
    return 0;
  });
}

function createEntity(entityName) {
  return {
    async list(sortBy) {
      const records = readRecords(entityName);
      return sortRecords(records, sortBy);
    },

    async filter(filters = {}, sortBy) {
      const records = readRecords(entityName).filter((record) => {
        return Object.entries(filters).every(([key, value]) => {
          return record[key] === value;
        });
      });

      return sortRecords(records, sortBy);
    },

    async get(id) {
      return readRecords(entityName).find((record) => record.id === id) || null;
    },

    async create(data) {
      const records = readRecords(entityName);
      const newRecord = {
        id: data.id || `${entityName.toLowerCase()}-${Date.now()}`,
        ...data,
        created_date: data.created_date || new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };

      writeRecords(entityName, [...records, newRecord]);
      return newRecord;
    },

    async update(id, data) {
      const records = readRecords(entityName);
      const updated = records.map((record) =>
        record.id === id
          ? { ...record, ...data, updated_date: new Date().toISOString() }
          : record
      );

      writeRecords(entityName, updated);
      return updated.find((record) => record.id === id) || null;
    },

    async delete(id) {
      const records = readRecords(entityName).filter((record) => record.id !== id);
      writeRecords(entityName, records);
      return { success: true };
    },
  };
}

const entityNames = [
  "Book",
  "BookPurchase",
  "CatalogItem",
  "AudienceTier",
  "Chapter",
  "Character",
  "FanTheory",
  "HD369Doctrine",
  "LoreEntry",
  "Location",
  "Beat",
  "BeatLicense",
  "AcademyCourse",
  "AcademyLesson",
  "AcademyWorksheet",
  "AcademyProgress",
  "PromoVideo",
  "ReaderNote",
  "Track",
  "TimelineEvent",
];

const entities = Object.fromEntries(
  entityNames.map((name) => [name, createEntity(name)])
);

export const base44 = {
  auth: {
    async me() {
      return localUser;
    },

    async logout() {
      return { success: true };
    },

    redirectToLogin() {
      console.log("[localAuth] Login redirect blocked. Local standalone mode active.");
    },
  },

  entities,

  integrations: {
    Core: {
      async UploadFile({ file }) {
        return {
          file_url: URL.createObjectURL(file),
        };
      },
    },
  },

  functions: {
    async invoke(functionName, payload = {}) {
      console.log(`[localFunction] ${functionName}`, payload);

      return {
        data: {
          success: true,
          url: "#",
          checkout_url: "#",
          message: "Local standalone placeholder response.",
        },
      };
    },
  },

  agents: {
    async run(agentName, payload = {}) {
      console.log(`[localAgent] ${agentName}`, payload);

      return {
        data: {
          success: true,
          message: "Local agent placeholder response.",
        },
      };
    },
  },
};

seedBooksIfMissing();

export default base44;