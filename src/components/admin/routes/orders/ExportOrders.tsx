"use client";

import { memo, useState } from "react";
import DateRange from "@/components/user/used-filters/DateRange";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useAuthContext } from "@/hooks/useAuthContext";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useTranslations } from "next-intl";
import { ExportFormats } from "@/enums/exportFormats.enum";

const ExportOrders = () => {
  const t = useTranslations();
  const { accessToken } = useAuthContext();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [exportingFormat, setExportingFormat] = useState<ExportFormats | null>(
    null
  );

  const disabledExport = !startDate || !endDate || exportingFormat !== null;

  const handleExport = async (format: ExportFormats) => {
    if (disabledExport) return;

    try {
      setExportingFormat(format);

      const response = await fetch(
        `${API_ENDPOINTS.ORDER.Export}?startDate=${startDate}&endDate=${endDate}&format=${format}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders.${format === "excel" ? "xlsx" : "pdf"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export orders");
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="z-50">
      <div className="w-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3">
              {t(
                "routes.dashboard.routes.orders.components.ExportOrders.title"
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-56 p-4 space-y-3 bg-white-50 border rounded-md shadow-md">
            <Label className="text-xs text-gray-600">
              {t(
                "routes.dashboard.routes.orders.components.ExportOrders.selectDates"
              )}
            </Label>

            <DateRange
              setCreatedFrom={setStartDate}
              setCreatedTo={setEndDate}
              onApplyFilter={() => {}}
              initialCreatedFrom={startDate}
              initialCreatedTo={endDate}
            />

            <div className="pt-2 flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => handleExport(ExportFormats.EXCEL)}
                disabled={disabledExport}
              >
                {exportingFormat === ExportFormats.EXCEL
                  ? t(
                      "routes.dashboard.routes.orders.components.ExportOrders.exporting"
                    )
                  : "Excel"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-8"
                onClick={() => handleExport(ExportFormats.PDF)}
                disabled={disabledExport}
              >
                {exportingFormat === ExportFormats.PDF
                  ? t(
                      "routes.dashboard.routes.orders.components.ExportOrders.exporting"
                    )
                  : "PDF"}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default memo(ExportOrders);
