# Heavens Gates Chronicles - Tier System

## Current Tier Structure (Updated)

### 📖 Reader (FREE)
**Price:** $0/month  
**Tier Level:** 0

**Benefits:**
- Book 1: The Known Beginning
- Character Vault access
- Timeline & Locations
- Community fan theories (view only)
- Basic lore entries

---

### ⭐ Supporter ($7/month)
**Price:** $7/month  
**Tier Level:** 1  
**Color:** Gold (#D4A849)

**Benefits:**
- All published books (as you release them)
- Full audiobook access
- Reader notes feature
- Vote on fan theories
- Early access to new chapters
- Hidden lore entries

**Access To:**
- ✅ /chronicle (all books)
- ✅ /audiobook (full access)
- ✅ /notes (create notes)
- ✅ /community (vote on theories)
- ✅ /lore (hidden entries)

---

### 👑 Inner Circle ($17/month)
**Price:** $17/month  
**Tier Level:** 2  
**Color:** Crimson (#8B1A1A)

**Benefits:**
- Everything in Supporter
- Ownership Academy courses
- HD 3,6,9 Doctrine full access
- Barry Parker AI chat
- Exclusive lore & behind-the-scenes
- Story direction polls & Q&A
- Promo videos & teasers

**Access To:**
- ✅ Everything in Supporter, PLUS:
- ✅ /academy (Ownership Academy)
- ✅ /hd369 (HD 3,6,9 Doctrine)
- ✅ /barry (Barry Parker AI chat)
- ✅ /promos (Promo videos)

---

## Content Gating Status

### ✅ Currently Gated (Inner Circle Only):
- **Ownership Academy** (`/academy`) - LockedOverlay added
- **Barry Parker Chat** (`/barry`) - LockedOverlay added

### 🔓 Currently Open (All Users):
- Home (`/`)
- Chronicle (`/chronicle`)
- Characters (`/characters`)
- Bloodlines (`/bloodlines`)
- Empire (`/empire`)
- Timeline (`/timeline`)
- Locations (`/locations`)
- Soundtrack (`/soundtrack`)
- Community (`/community`)
- Reader Notes (`/notes`)

### ⚠️ Should Be Gated (Not Yet Implemented):
- **Audiobook** (`/audiobook`) - Should be Supporter+
- **Hidden Lore** (`/lore`) - Should be Supporter+
- **Promo Videos** (`/promos`) - Should be Inner Circle (already admin-only for editing)

---

## How to Gate Content

### Example: Lock a Page Behind Supporter Tier

```jsx
import LockedOverlay from "../../components/shared/LockedOverlay";
import { useUserTier } from "../../hooks/useUserTier";

export default function YourPage() {
  const { userTier } = useUserTier();

  return (
    <LockedOverlay
      requiredTier={{ tierLevel: 1, name: "Supporter", feature: "audiobook access" }}
      userTier={userTier}
    >
      {/* Your page content here */}
    </LockedOverlay>
  );
}
```

### Tier Levels Reference:
- `tierLevel: 0` = Reader (Free)
- `tierLevel: 1` = Supporter ($7)
- `tierLevel: 2` = Inner Circle ($17)

---

## Next Steps

1. **Add User Tier Field** - Add `subscription_tier` field to User entity to track subscriptions
2. **Implement Payment** - Integrate Stripe/Base44 Payments for tier subscriptions
3. **Gate Audiobook** - Add LockedOverlay to `/audiobook` (Supporter tier)
4. **Gate Hidden Lore** - Add LockedOverlay to `/lore` (Supporter tier)
5. **Update Navigation** - Add tier badges to nav items showing access requirements
6. **Create Tiers Page** - Public-facing page showing the 3 tiers with signup buttons

---

## For Future: Artist Collaboration Features

When you're ready to add artist collaboration tools, consider:

**Option A: Separate Section**
- Add "Creator Hub" as a completely separate area
- Different pricing structure for artists
- Doesn't confuse current reader audience

**Option B: Hybrid Tiers**
- Keep current 3 tiers for readers
- Add 2 additional tiers for creators:
  - **Creator** ($29/month) - Upload music, sell beats, analytics
  - **Label** ($99/month) - Multi-artist management, white-label

**Recommendation:** Start with Option A. Launch the reader experience first, then add creator features as "Phase 2" without changing the existing tier structure for readers.