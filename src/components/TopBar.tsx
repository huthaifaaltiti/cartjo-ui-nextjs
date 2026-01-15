import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import LanguageSelector from "./LanguageSelector";
import HomeLink from "./HomeLink";
import TopBarDeliveryMessage from "./TopBarDeliveryMessage";

const TopBar: React.FC = () => {
  return (
    <div className="w-full py-3 border-b border-grey-50/15">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between">
          <div className="w-auto flex items-center gap-3">
            <HomeLink />
            <TopBarDeliveryMessage />
          </div>
          <LanguageSelector />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default TopBar;
