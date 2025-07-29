import MainHeader from "@/components/MainHeader";
import TopBar from "@/components/TopBar";
import { HomeContextProvider } from "@/contexts/HomeContext";

export default function Home() {
  return (
    <HomeContextProvider>
      <TopBar />
      <MainHeader />
    </HomeContextProvider>
  );
}
