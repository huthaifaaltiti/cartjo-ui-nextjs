"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Link } from "@react-pdf/renderer";
import { Order } from "@/types/order.type";
import { OrderItem, OrderItemVariant } from "@/types/orderItem.type";
import { extractVariantDetails } from "@/utils/productVariant.utils";
import { formatDateWithHourAndMin } from "@/utils/formatDate";
import { currencyLabeler } from "@/utils/labelers";
import { Currency } from "@/enums/currency.enum";
import assets from "@public/assets/assets.json";

Font.register({
  family: "AppFont",
  fonts: [
    { src: "/fonts/ar/tajawal/Tajawal-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/ar/tajawal/Tajawal-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/ar/tajawal/Tajawal-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/ar/tajawal/Tajawal-Bold.ttf", fontWeight: "bold" },
    { src: "/fonts/en/NotoSans/NotoSans-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/en/NotoSans/NotoSans-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/en/NotoSans/NotoSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/en/NotoSans/NotoSans-Bold.ttf", fontWeight: "bold" },
  ],
});

function AutoText({
  style,
  children,
}: {
  style?: object | object[];
  children?: string | null;
}) {
  const str = children ?? "";
  const baseStyles = Array.isArray(style) ? style : style ? [style] : [];
  return <Text style={[...baseStyles, { fontFamily: "AppFont" }]}>{str}</Text>;
}

function AmountText({
  amount,
  currency,
  isArabic,
  style,
}: {
  amount: string;
  currency: Currency;
  isArabic: boolean;
  style?: object | object[];
}) {
  const merged: Record<string, string> = Object.assign(
    {},
    ...(Array.isArray(style) ? style : style ? [style] : []),
  );
  const label = currencyLabeler(currency, isArabic);

  if (!isArabic) {
    return (
      <Text style={[merged, { fontFamily: "AppFont" }]}>
        {amount} {label}
      </Text>
    );
  }

  const {
    width,
    minWidth,
    maxWidth,
    flex,
    textAlign,
    fontSize,
    fontSizeAmount,
    fontSizeLabel,
    ...typography
  } = merged;

  return (
    <View
      style={{
        width: width as number | string | undefined,
        minWidth: minWidth as number | string | undefined,
        maxWidth: maxWidth as number | string | undefined,
        flex: flex,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Text
        style={[
          typography,
          {
            fontFamily: "AppFont",
            marginRight: 3,
            fontSize: fontSizeLabel || Number(fontSize) - 2,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          typography,
          {
            fontFamily: "AppFont",
            fontSize: fontSizeAmount || Number(fontSize),
          },
        ]}
      >
        {amount}
      </Text>
    </View>
  );
}

function PDFVariant({
  variant,
  tg,
  isArabic,
}: {
  variant: OrderItemVariant;
  tg: (key: string, values?: Record<string, string | number>) => string;
  isArabic?: boolean;
}) {
  if (!variant) return null;
  const { sellingType, size, colors } = extractVariantDetails(variant);

  if (colors.length > 0 && !size && !sellingType) {
    return (
      <View
        style={{
          flexDirection: isArabic ? "row-reverse" : "row",
          flexWrap: "wrap",
          marginTop: 2,
          gap: 2,
        }}
      >
        {colors.map((color) => (
          <View
            key={color}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: color,
              borderWidth: 1,
              borderColor: "#D1D5DB",
            }}
          />
        ))}
      </View>
    );
  }

  const translatedSellingType = sellingType
    ? tg(`attributes.sellingType.${sellingType.toLowerCase()}`)
    : null;
  const parts = [
    translatedSellingType
      ? `${tg("attributes.labels.type")}: ${translatedSellingType}`
      : null,
    size ? `${tg("attributes.labels.size")}: ${size}` : null,
  ].filter(Boolean);

  return (
    <View style={{ marginTop: 2 }}>
      <Text
        style={{
          fontSize: 8,
          color: "#374151",
          textAlign: isArabic ? "right" : "left",
        }}
      >
        {parts.join(" · ")}
      </Text>
      {colors.length > 0 && (
        <View
          style={{
            flexDirection: isArabic ? "row-reverse" : "row",
            gap: 2,
            marginTop: 1,
          }}
        >
          <Text style={{ fontSize: 8, color: "#374151" }}>
            {isArabic
              ? ` :${tg("attributes.labels.colors")}`
              : `${tg("attributes.labels.colors")}: `}
          </Text>
          {colors.map((c) => (
            <View
              key={c}
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: c,
                borderWidth: 1,
                borderColor: "#D1D5DB",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

interface ReceiptPDFProps {
  selectedOrder: Order;
  isArabic?: boolean;
  imageMap?: Record<string, string>;
  t: (key: string, values?: Record<string, string | number>) => string;
  tg: (key: string, values?: Record<string, string | number>) => string;
}

const C = {
  brand: "#5B21B6",
  brandLight: "#EDE9FE",
  brandDark: "#3B0764",
  accent: "#7C3AED",
  gold: "#D97706",
  gray900: "#111827",
  gray700: "#374151",
  gray500: "#6B7280",
  gray300: "#D1D5DB",
  gray100: "#F3F4F6",
  white: "#FFFFFF",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 52,
    paddingHorizontal: 0,
    fontSize: 9,
    fontFamily: "AppFont",
    color: C.gray900,
    backgroundColor: C.white,
  },
  headerBand: {
    backgroundColor: C.brandDark,
    paddingHorizontal: 36,
    paddingTop: 26,
    paddingBottom: 20,
    alignItems: "center",
  },
  logoArea: { alignItems: "center", gap: 10 },
  logoImage: { width: 42, height: 42 },
  logoText: {
    fontSize: 16,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  logoSub: {
    fontSize: 7,
    fontFamily: "AppFont",
    color: "#C4B5FD",
    marginTop: 5,
  },
  headerRight: {},
  transactionId: {
    fontSize: 10,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  headerDate: {
    fontSize: 7.5,
    fontFamily: "AppFont",
    color: "#A78BFA",
    marginTop: 3,
  },
  accentStripe: { height: 4, backgroundColor: C.accent },
  goldStripe: { height: 2, backgroundColor: C.gold },
  statusBar: {
    backgroundColor: C.brandLight,
    paddingHorizontal: 36,
    paddingVertical: 9,
    gap: 10,
    alignItems: "center",
  },
  statusChip: {
    alignItems: "center",
    gap: 6,
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    border: `1 solid ${C.gray300}`,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: {
    fontSize: 6.5,
    fontFamily: "AppFont",
    color: C.gray500,
  },
  statusText: {
    fontSize: 7.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.gray700,
  },
  body: { paddingHorizontal: 36, paddingTop: 18 },
  infoGrid: { gap: 10, marginBottom: 18 },
  infoCard: {
    flex: 1,
    border: `1 solid ${C.gray300}`,
    borderRadius: 5,
    minHeight: 100,
  },
  infoCardHeader: {
    backgroundColor: C.gray900,
    paddingHorizontal: 9,
    paddingVertical: 5,
    alignItems: "center",
    gap: 5,
  },
  infoCardDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.accent,
  },
  infoCardTitle: {
    fontSize: 6.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  infoCardBody: {
    padding: 9,
    gap: 3,
    display: "flex",
    flexDirection: "column",
  },
  infoLineBold: {
    fontSize: 8.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.gray900,
    lineHeight: 1.6,
  },
  infoLine: {
    fontSize: 8,
    fontFamily: "AppFont",
    color: C.gray700,
    lineHeight: 1.4,
    flexWrap: "wrap",
  },
  infoLineMuted: {
    fontSize: 7,
    fontFamily: "AppFont",
    color: C.gray500,
    lineHeight: 1.5,
  },
  tableWrapper: {
    border: `1 solid ${C.gray300}`,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 14,
  },
  tableHeader: {
    backgroundColor: C.gray900,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: "center",
  },
  thProduct: {
    flex: 1,
    fontSize: 6.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  thQty: {
    width: 28,
    fontSize: 6.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
    textAlign: "center",
  },
  thPrice: {
    width: 62,
    fontSize: 6.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  thTotal: {
    width: 68,
    fontSize: 6.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  tableRow: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    borderTop: `1 solid ${C.gray100}`,
  },
  rowEven: { backgroundColor: "#FAFAFA" },
  rowOdd: { backgroundColor: C.white },
  productCell: { flex: 1, alignItems: "center" },
  productThumb: {
    width: 30,
    height: 30,
    borderRadius: 4,
    border: `1 solid ${C.gray300}`,
    backgroundColor: C.gray100,
  },
  productThumbPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 4,
    border: `1 solid ${C.gray300}`,
    backgroundColor: C.gray100,
    justifyContent: "center",
    alignItems: "center",
  },
  productName: {
    fontSize: 8,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.gray900,
    marginBottom: 1,
  },
  productSkuLabel: {
    fontSize: 6.5,
    fontFamily: "AppFont",
    color: C.gray500,
    fontWeight: "bold",
  },
  productSkuCode: { fontSize: 6.5, fontFamily: "AppFont", color: C.gray500 },
  tdQty: {
    width: 28,
    textAlign: "center",
    fontSize: 8.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.brand,
  },
  tdPrice: {
    width: 62,
    fontSize: 8,
    fontSizeAmount: 8,
    fontSizeLabel: 6,
    fontFamily: "AppFont",
    color: C.gray700,
  },
  tdTotal: {
    width: 68,
    fontSize: 8.5,
    fontSizeAmount: 8.5,
    fontSizeLabel: 6.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.gray900,
  },
  totalsWrapper: { marginBottom: 18 },
  totalsBox: {
    width: 210,
    border: `1 solid ${C.gray300}`,
    borderRadius: 5,
    overflow: "hidden",
  },
  totalsRow: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottom: `1 solid ${C.gray100}`,
  },
  totalsLabel: { fontSize: 8, fontFamily: "AppFont", color: C.gray500 },
  totalsValue: {
    fontSize: 8,
    fontSizeAmount: 8,
    fontSizeLabel: 6,
    fontFamily: "AppFont",
    color: C.gray700,
  },
  totalsFinalRow: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.brandDark,
  },
  totalsFinalLabel: {
    fontSize: 8,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: "#C4B5FD",
  },
  totalsFinalValue: {
    fontSize: 13,
    fontSizeAmount: 13,
    fontSizeLabel: 8,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: C.white,
  },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  footerGold: { height: 1.5, backgroundColor: C.gold },
  footerStripe: { height: 3.5, backgroundColor: C.accent },
  footerBody: {
    backgroundColor: C.brandDark,
    paddingHorizontal: 36,
    paddingVertical: 11,
    alignItems: "center",
  },
  footerThanks: {
    fontSize: 7.5,
    fontFamily: "AppFont",
    fontWeight: "bold",
    color: "#C4B5FD",
  },
  footerPage: { fontSize: 7, fontFamily: "AppFont", color: "#C4B5FD" },
  footerSite: {
    fontSize: 7.5,
    fontFamily: "AppFont",
    color: "#C4B5FD",
    textDecoration: "none",
  },
});

function statusColor(status: string): string {
  const s = status?.toUpperCase();
  if (["PAID", "DELIVERED", "COMPLETED"].includes(s)) return C.success;
  if (s === "PENDING") return C.warning;
  if (["FAILED", "CANCELLED"].includes(s)) return C.danger;
  return C.gray500;
}

const BASE_ITEMS_PER_PAGE = 9;
const MIDDLE_ITEMS_PER_PAGE = BASE_ITEMS_PER_PAGE + 1;

export default function ReceiptPDF({
  selectedOrder,
  isArabic = false,
  imageMap = {},
  t,
  tg,
}: ReceiptPDFProps) {
  const addr = selectedOrder.shippingAddress;
  const dir = isArabic ? "rtl" : "ltr";
  const rowDir = isArabic ? "row-reverse" : "row";
  const textAlign = isArabic ? "right" : "left";
  const textAlignEnd = isArabic ? "left" : "right";

  const chunks: OrderItem[][] = [];
  let i = 0;

  while (i < selectedOrder.items.length) {
    const remaining = selectedOrder.items.length - i;

    // First page
    if (chunks.length === 0) {
      const size = BASE_ITEMS_PER_PAGE;
      chunks.push(selectedOrder.items.slice(i, i + size));
      i += size;
      continue;
    }

    // If this slice would leave a "last page"
    const nextRemaining = remaining - MIDDLE_ITEMS_PER_PAGE;

    // Last page
    if (nextRemaining <= BASE_ITEMS_PER_PAGE) {
      chunks.push(selectedOrder.items.slice(i));
      break;
    }

    // Middle pages
    const size = MIDDLE_ITEMS_PER_PAGE;
    chunks.push(selectedOrder.items.slice(i, i + size));
    i += size;
  }

  const totalPages = chunks.length;

  return (
    <Document>
      {chunks.map((chunk, pageIdx) => {
        const isFirst = pageIdx === 0;
        const isLast = pageIdx === totalPages - 1;
        return (
          <Page
            key={pageIdx}
            size="A4"
            style={[styles.page, { direction: dir }]}
          >
            {/* Header */}
            <View
              fixed
              style={[
                styles.headerBand,
                { flexDirection: rowDir, justifyContent: "space-between" },
              ]}
            >
              <View style={[styles.logoArea, { flexDirection: rowDir }]}>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: isArabic ? "flex-end" : "flex-start",
                  }}
                >
                  <View
                    style={{
                      flexDirection: isArabic ? "row-reverse" : "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={assets.image.png.logo_shape_white}
                      style={{
                        width: 22,
                        height: 22,
                        marginRight: isArabic ? 0 : 6,
                        marginLeft: isArabic ? 6 : 0,
                      }}
                    />

                    <Text
                      style={[
                        styles.logoText,
                        {
                          textAlign,
                          lineHeight: 1, // important for vertical centering
                        },
                      ]}
                    >
                      {t("brand")}
                    </Text>
                  </View>
                  <Text style={[styles.logoSub, { textAlign }]}>
                    {t("orderReceipt")}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.headerRight,
                  { alignItems: isArabic ? "flex-start" : "flex-end" },
                ]}
              >
                <Text style={[styles.transactionId, { textAlign }]}>
                  {selectedOrder.transactionId}
                </Text>
                <Text
                  style={[
                    styles.headerDate,
                    { textAlign: isArabic ? "left" : "right" },
                  ]}
                >
                  {formatDateWithHourAndMin(
                    selectedOrder.createdAt.toString(),
                    isArabic,
                  )}
                </Text>
              </View>
            </View>

            <View fixed style={styles.accentStripe} />
            <View fixed style={styles.goldStripe} />

            {/* Status chips */}
            {isFirst && (
              <View
                style={[
                  styles.statusBar,
                  {
                    flexDirection: rowDir,
                  },
                ]}
              >
                {[
                  {
                    label: t("payment"),
                    value: tg(
                      `status.${selectedOrder.paymentStatus.toLowerCase()}`,
                    ),
                    dot: statusColor(selectedOrder.paymentStatus),
                  },
                  {
                    label: t("delivery"),
                    value: tg(
                      `status.${selectedOrder.deliveryStatus.toLowerCase()}`,
                    ),
                    dot: statusColor(selectedOrder.deliveryStatus),
                  },
                  {
                    label: tg("receipt.order.info.paymentMethod"),
                    value: tg(
                      `paymentMethod.${selectedOrder.paymentMethod?.toLowerCase()}`,
                    ),
                    dot: C.gray500,
                  },
                ].map((chip) => (
                  <View
                    key={chip.label}
                    style={[styles.statusChip, { flexDirection: rowDir }]}
                  >
                    <View
                      style={[styles.statusDot, { backgroundColor: chip.dot }]}
                    />
                    <View
                      style={{
                        alignItems: isArabic ? "flex-end" : "flex-start",
                      }}
                    >
                      <Text style={[styles.statusLabel, { textAlign }]}>
                        {chip.label}
                      </Text>
                      <Text style={[styles.statusText, { textAlign }]}>
                        {chip.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.body}>
              {/* Info cards */}
              {isFirst && (
                <View style={[styles.infoGrid, { flexDirection: rowDir }]}>
                  {/* Customer */}
                  <View style={styles.infoCard}>
                    <View
                      style={[styles.infoCardHeader, { flexDirection: rowDir }]}
                    >
                      <View style={styles.infoCardDot} />
                      <Text style={[styles.infoCardTitle, { textAlign }]}>
                        {t("customer")}
                      </Text>
                    </View>
                    <View style={styles.infoCardBody}>
                      <AutoText style={[styles.infoLineBold, { textAlign }]}>
                        {addr.fullName}
                      </AutoText>
                      <Text style={[styles.infoLine, { textAlign }]}>
                        {selectedOrder.email}
                      </Text>
                      <Text style={[styles.infoLine, { textAlign }]}>
                        {addr.phone}
                      </Text>
                    </View>
                  </View>

                  {/* Shipping */}
                  <View style={styles.infoCard}>
                    <View
                      style={[styles.infoCardHeader, { flexDirection: rowDir }]}
                    >
                      <View style={styles.infoCardDot} />
                      <Text style={[styles.infoCardTitle, { textAlign }]}>
                        {t("shippingAddress")}
                      </Text>
                    </View>
                    <View style={styles.infoCardBody}>
                      <AutoText style={[styles.infoLineBold, { textAlign }]}>
                        {addr.street}
                      </AutoText>
                      <AutoText style={[styles.infoLine, { textAlign }]}>
                        {addr.building}
                      </AutoText>
                      <AutoText style={[styles.infoLine, { textAlign }]}>
                        {[addr.town, addr.city].filter(Boolean).join(" - ")}
                      </AutoText>
                      <AutoText style={[styles.infoLine, { textAlign }]}>
                        {[addr.town, addr.city].filter(Boolean).join(", ")}
                      </AutoText>
                      <Text style={[styles.infoLine, { textAlign }]}>
                        {addr.country}
                      </Text>
                      {addr.additionalInfo && (
                        <AutoText
                          style={[styles.infoLineMuted, { textAlign }]}
                        >{`Note: ${addr.additionalInfo}`}</AutoText>
                      )}
                    </View>
                  </View>

                  {/* Order meta */}
                  <View style={styles.infoCard}>
                    <View
                      style={[styles.infoCardHeader, { flexDirection: rowDir }]}
                    >
                      <View style={styles.infoCardDot} />
                      <Text style={[styles.infoCardTitle, { textAlign }]}>
                        {t("orderInfo")}
                      </Text>
                    </View>
                    <View style={styles.infoCardBody}>
                      {selectedOrder.merchantReference && (
                        <>
                          <Text style={[styles.infoLineMuted, { textAlign }]}>
                            {t("reference")}
                          </Text>
                          <Text
                            style={[
                              styles.infoLineBold,
                              { marginBottom: 5, textAlign },
                            ]}
                          >
                            {selectedOrder.transactionId}
                          </Text>
                        </>
                      )}
                      <Text style={[styles.infoLineMuted, { textAlign }]}>
                        {t("totalItems")}
                      </Text>
                      <Text style={[styles.infoLineBold, { textAlign }]}>
                        {selectedOrder.items.reduce(
                          (s: number, i: OrderItem) => s + i.quantity,
                          0,
                        )}{" "}
                        {t("items")}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Items table */}
              <View style={styles.tableWrapper}>
                <View style={[styles.tableHeader, { flexDirection: rowDir }]}>
                  <Text style={[styles.thProduct, { textAlign }]}>
                    {t("product")}
                  </Text>
                  <Text style={[styles.thQty, { textAlign: "center" }]}>
                    {t("quantity")}
                  </Text>
                  <Text style={[styles.thPrice, { textAlign: textAlignEnd }]}>
                    {t("unitPrice")}
                  </Text>
                  <Text style={[styles.thTotal, { textAlign: textAlignEnd }]}>
                    {t("total")}
                  </Text>
                </View>

                {chunk.map((item: OrderItem, idx: number) => {
                  const originalUrl =
                    item?.variant?.mainImage?.url || item?.mainImage?.url || "";
                  const resolvedImage = originalUrl
                    ? imageMap[originalUrl]
                    : "";
                  const name =
                    (isArabic ? item.name?.ar : item.name?.en) ??
                    item.name?.en ??
                    "NA";
                  return (
                    <View
                      key={item.variantId || idx}
                      style={[
                        styles.tableRow,
                        idx % 2 === 0 ? styles.rowEven : styles.rowOdd,
                        { flexDirection: rowDir },
                      ]}
                    >
                      <View
                        style={[styles.productCell, { flexDirection: rowDir }]}
                      >
                        {resolvedImage ? (
                          <Image
                            src={resolvedImage}
                            style={[
                              styles.productThumb,
                              isArabic
                                ? { marginLeft: 7, marginRight: 0 }
                                : { marginRight: 7, marginLeft: 0 },
                            ]}
                          />
                        ) : (
                          <View
                            style={[
                              styles.productThumbPlaceholder,
                              isArabic
                                ? { marginLeft: 7, marginRight: 0 }
                                : { marginRight: 7, marginLeft: 0 },
                            ]}
                          >
                            <Text
                              style={{
                                fontSize: 6,
                                color: C.gray500,
                                fontFamily: "AppFont",
                              }}
                            >
                              —
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isArabic ? "flex-end" : "flex-start",
                          }}
                        >
                          <AutoText style={[styles.productName, { textAlign }]}>
                            {name}
                          </AutoText>
                          {item.variant?.sku && (
                            <View
                              style={{
                                textAlign,
                                marginTop: 1,
                                display: "flex",
                                flexDirection: isArabic ? "row-reverse" : "row",
                                alignItems: isArabic
                                  ? "flex-start"
                                  : "flex-end",
                                gap: 1,
                              }}
                            >
                              <Text style={styles.productSkuLabel}>
                                {isArabic ? `:${t("sku")}` : `${t("sku")}:`}
                              </Text>

                              <Text style={styles.productSkuCode}>
                                {item.variant.sku}
                              </Text>
                            </View>
                          )}
                        </View>
                        {item.variant && (
                          <PDFVariant
                            variant={item.variant}
                            tg={tg}
                            isArabic={isArabic}
                          />
                        )}
                      </View>
                      <Text style={[styles.tdQty, { textAlign: "center" }]}>
                        {item.quantity}
                      </Text>
                      <AmountText
                        amount={item.price.toFixed(2)}
                        currency={selectedOrder.currency}
                        isArabic={isArabic}
                        style={[styles.tdPrice, { textAlign: textAlignEnd }]}
                      />
                      <AmountText
                        amount={(item.quantity * item.price).toFixed(2)}
                        currency={selectedOrder.currency}
                        isArabic={isArabic}
                        style={[styles.tdTotal, { textAlign: textAlignEnd }]}
                      />
                    </View>
                  );
                })}
              </View>

              {/* Totals */}
              {isLast && (
                <View
                  style={[
                    styles.totalsWrapper,
                    {
                      flexDirection: rowDir,
                      justifyContent: isArabic ? "flex-start" : "flex-end",
                    },
                  ]}
                >
                  <View style={styles.totalsBox}>
                    <View style={[styles.totalsRow, { flexDirection: rowDir }]}>
                      <Text style={styles.totalsLabel}>{t("subtotal")}</Text>
                      <AmountText
                        amount={selectedOrder.amount.toFixed(2)}
                        currency={selectedOrder.currency}
                        isArabic={isArabic}
                        style={styles.totalsValue}
                      />
                    </View>
                    <View style={[styles.totalsRow, { flexDirection: rowDir }]}>
                      <Text style={styles.totalsLabel}>
                        {t("deliveryCost")}
                      </Text>
                      <AmountText
                        amount={selectedOrder.deliveryCost.toFixed(2)}
                        currency={selectedOrder.currency}
                        isArabic={isArabic}
                        style={styles.totalsValue}
                      />
                    </View>
                    <View
                      style={[styles.totalsFinalRow, { flexDirection: rowDir }]}
                    >
                      <Text style={styles.totalsFinalLabel}>
                        {t("totalDue")}
                      </Text>
                      <AmountText
                        amount={(
                          selectedOrder.amount + selectedOrder.deliveryCost
                        ).toFixed(2)}
                        currency={selectedOrder.currency}
                        isArabic={isArabic}
                        style={styles.totalsFinalValue}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
              <View style={styles.footerGold} />
              <View style={styles.footerStripe} />
              <View
                style={[
                  styles.footerBody,
                  { flexDirection: rowDir, justifyContent: "space-between" },
                ]}
              >
                <Text style={styles.footerThanks}>{t("thankYou")}</Text>
                <Text style={styles.footerPage}>
                  {t("pageOf", { current: pageIdx + 1, total: totalPages })}
                </Text>
                <Link src="https://www.cartjo.com/" style={styles.footerSite}>
                  {t("site")}
                </Link>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
