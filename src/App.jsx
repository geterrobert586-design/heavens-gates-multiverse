import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import ChronicleLayout from './components/layout/ChronicleLayout';
import Home from './pages/chronicle/Home';
import Chronicle from './pages/chronicle/Chronicle';
import Characters from './pages/chronicle/Characters';
import Bloodlines from './pages/chronicle/Bloodlines';
import Empire from './pages/chronicle/Empire';
import Timeline from './pages/chronicle/Timeline';
import Locations from './pages/chronicle/Locations';
import Soundtrack from './pages/chronicle/Soundtrack';
import HiddenLore from './pages/chronicle/HiddenLore';
import ReaderNotes from './pages/chronicle/ReaderNotes';
import Community from './pages/chronicle/Community';
import BarryChat from './pages/chronicle/BarryChat';
import Audiobook from './pages/chronicle/Audiobook';
import OwnershipAcademy from './pages/chronicle/OwnershipAcademy';
import HD369Doctrine from './pages/chronicle/HD369Doctrine';
import PromoVideos from './pages/chronicle/PromoVideos';
import BeatStore from './pages/chronicle/BeatStore';
import BeatLicenseSuccess from './pages/chronicle/BeatLicenseSuccess';
import MyLicenses from './pages/chronicle/MyLicenses';
import Ebooks from './pages/chronicle/Ebooks';
import EbookSuccess from './pages/chronicle/EbookSuccess';
import ManageEbooks from './pages/admin/ManageEbooks';
import InteractiveHome from './interactive/InteractiveHome';
import EpisodeZero from './interactive/EpisodeZero';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-crimson to-primary/60 flex items-center justify-center">
            <span className="font-heading font-black text-foreground text-sm">HG</span>
          </div>
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-heading text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Loading the Archive...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route element={<ChronicleLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/chronicle" element={<Chronicle />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/bloodlines" element={<Bloodlines />} />
        <Route path="/empire" element={<Empire />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/soundtrack" element={<Soundtrack />} />
        <Route path="/lore" element={<HiddenLore />} />
        <Route path="/notes" element={<ReaderNotes />} />
        <Route path="/community" element={<Community />} />
        <Route path="/barry" element={<BarryChat />} />
        <Route path="/audiobook" element={<Audiobook />} />
        <Route path="/academy" element={<OwnershipAcademy />} />
        <Route path="/hd369" element={<HD369Doctrine />} />
        <Route path="/promos" element={<PromoVideos />} />
        <Route path="/beats" element={<BeatStore />} />
        <Route path="/beats/success" element={<BeatLicenseSuccess />} />
        <Route path="/my-licenses" element={<MyLicenses />} />
        <Route path="/books" element={<Ebooks />} />
        <Route path="/books/success" element={<EbookSuccess />} />
        <Route path="/admin/ebooks" element={<ManageEbooks />} />
        <Route path="/interactive" element={<InteractiveHome />} />
      </Route>
      <Route path="/interactive/episode-zero" element={<EpisodeZero />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;