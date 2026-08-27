import CreatorsHero from "./CreatorsHero";
import DynamicCreatorsLogo from "./DynamicCreatorsLogo";
import CreatorsNavActions from "./CreatorsNavActions";
import CreatorsInfoSection from "./CreatorsInfoSection";

export default function CreatorsPageContainer({
  isArabic,
}: {
  isArabic: boolean;
}) {
  return (
    <div className="w-full">
      {/* Nav */}
      <header className="w-full">
        <div className="mx-auto flex items-center justify-between px-6 py-5">
          <DynamicCreatorsLogo isArabic={isArabic} />
          <CreatorsNavActions />
        </div>
      </header>

      <CreatorsHero />
      <CreatorsInfoSection />
    </div>
  );
}
