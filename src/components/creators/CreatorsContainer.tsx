import DynamicCreatorsLogo from "./DynamicCreatorsLogo";

export default function CreatorsPageContainer({
  isArabic,
}: {
  isArabic: boolean;
}) {
  return (
    <div className="w-full">
      {/* Nav */}
      <header className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <DynamicCreatorsLogo isArabic={isArabic} />
        </div>
      </header>
    </div>
  );
}
