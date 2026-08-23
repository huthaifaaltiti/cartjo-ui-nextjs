"use client";

import { memo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from "@/components/shared/Modal";
import CreateCreatorsVideoForm from "./CreateCreatorsVideoForm";
import CreatorsVideoCard from "./CreatorsVideoCard";
import InfiniteScrollList, {
  GRID_TYPE,
  LAYOUT_TYPE,
} from "../../../shared/InfiniteScrollList";
import { useCreatorsVideosQuery } from "@/hooks/react-query/useCreatorsVideoQuery";
import { CREATORS_VIDEOS_KEY } from "@/hooks/react-query/query-options/creatorsVideo";
import PageLoader from "@/components/shared/PageLoader";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/enums/permission.enum";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const CreatorsVideosPageContainer = () => {
  const t = useTranslations(
    "routes.dashboard.routes.creators.routes.videos.components.CreatorsVideosPageContainer",
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { canRead, canCreate } = usePermission({
    canRead: Permission.CREATORS_VIDEOS_READ,
    canCreate: Permission.CREATORS_VIDEOS_CREATE,
  });

  const debouncedSearch = useDebounce<string>({
    value: searchQuery,
    delay: debouncingTime,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCreatorsVideosQuery(
    debouncedSearch,
    CreatorsVideoType.HERO.toLocaleUpperCase(),
  );

  const videos = data?.pages.flatMap((page) => page.data) ?? [];

  const showLoader = isLoading;
  const showError = isError;
  const showNoData = videos.length === 0 && !showLoader;
  const showData = videos.length > 0 && !showLoader;

  // Protect section - if no read permission, render restricted access alert
  if (!canRead) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center border border-dashed rounded-xl p-8 bg-red-50/10 border-red-200">
        <p className="text-red-600 text-sm font-semibold">Access Denied</p>
        <p className="text-neutral-500 text-xs mt-1">
          You do not have permission to view creators videos.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {t("title")}
          </h1>
          <p className="text-xs text-gray-505 mt-1">{t("desc")}</p>
        </div>
      </div>

      <div className="w-full flex items-center gap-5">
        {/* Filter / Search section */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t("components.SearchBar.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 bg-white-50 text-xs placeholder:text-xs"
            disabled={!canRead}
          />
        </div>

        <div>
          {canCreate && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white-50 rounded px-4 py-2"
            >
              <Plus className="h-4 w-4" />
              {t("createVideo.label")}
            </Button>
          )}
        </div>
      </div>

      {/* List content states */}
      {showLoader ? (
        <PageLoader />
      ) : showError ? (
        <div className="w-full min-h-[40vh] flex items-center justify-center">
          <ErrorMessage
            message={error?.message || t("errors.failedLoadData")}
          />
        </div>
      ) : showNoData ? (
        <div className="w-full min-h-[45vh] flex flex-col items-center justify-center border border-dashed rounded-xl p-8 bg-neutral-50/50">
          <p className="text-gray-500 text-sm font-medium">
            {t("empty.title")}
          </p>
          <p className="text-gray-400 text-xs mt-1">{t("empty.desc")}</p>
        </div>
      ) : showData ? (
        <InfiniteScrollList
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          error={error}
          list={videos}
          fetchNextPage={fetchNextPage}
          ListItemCard={CreatorsVideoCard}
          layout={LAYOUT_TYPE.GRID}
          gridType={GRID_TYPE.WIDE}
          cardProps={{
            queryKey: CREATORS_VIDEOS_KEY,
          }}
        />
      ) : null}

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <CreateCreatorsVideoForm
            onSuccess={() => setIsAddModalOpen(false)}
            queryKey={CREATORS_VIDEOS_KEY}
          />
        </Modal>
      )}
    </div>
  );
};

export default memo(CreatorsVideosPageContainer);
