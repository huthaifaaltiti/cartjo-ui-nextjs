"use client";

import { memo, forwardRef } from "react";

interface ReceiptHiddenLayoutProps {
  selectedOrder: any;
  t: (key: string) => string;
  rtl?: boolean;
}

//  {/* Hidden receipt area (rendered off-screen so html2canvas can capture it) */}
// Forwarding ref so the parent can pass receiptRef to html2canvas
const ReceiptHiddenLayout = forwardRef<
  HTMLDivElement,
  ReceiptHiddenLayoutProps
>(({ selectedOrder, t, rtl = false }, ref) => {
  if (!selectedOrder) return null;

  return (
    <div
      ref={ref}
      // Must be rendered (not display:none) for html2canvas
      // Off-screen but rendered (html2canvas can't capture display:none)
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: 800,
        padding: 24,
        background: "#ffffff",
        color: "#000000",
        direction: rtl ? "rtl" : "ltr",
      }}
      aria-hidden
    >
      <div style={{ maxWidth: 760 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>
              {t("general.receipt.order.header")}
            </h1>

            <div style={{ marginTop: 6, fontSize: 12 }}>
              <div>
                <strong>
                  {t("general.receipt.order.info.transactionId")}:
                </strong>{" "}
                {selectedOrder.transactionId}
              </div>
              <div>
                <strong>{t("general.others.created")}:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right", fontSize: 12 }}>
            <div>
              <strong>{t("general.receipt.order.info.paymentMethod")}:</strong>{" "}
              {selectedOrder.paymentMethod}
            </div>
            <div>
              <strong>{t("general.receipt.order.info.status")}:</strong>{" "}
              {selectedOrder.paymentStatus}
            </div>
          </div>
        </div>

        <hr />

        {/* Customer */}
        <section style={{ marginTop: 12, marginBottom: 12 }}>
          <h3 style={{ margin: "6px 0" }}>
            {t("general.receipt.order.info.customer")}
          </h3>
          <div style={{ fontSize: 12 }}>
            <div>{selectedOrder.shippingAddress.fullName}</div>
            <div>{selectedOrder.email}</div>
            <div>{selectedOrder.shippingAddress.phone}</div>
          </div>
        </section>

        {/* Shipping */}
        <section style={{ marginTop: 12, marginBottom: 12 }}>
          <h3 style={{ margin: "6px 0" }}>
            {t("general.receipt.order.info.shippingAddress")}
          </h3>
          <div style={{ fontSize: 12 }}>
            <div>
              {selectedOrder.shippingAddress.street},{" "}
              {selectedOrder.shippingAddress.building}
            </div>
            <div>
              {selectedOrder.shippingAddress.town},{" "}
              {selectedOrder.shippingAddress.city}
            </div>
            <div>{selectedOrder.shippingAddress.country}</div>

            {selectedOrder.shippingAddress.additionalInfo && (
              <div style={{ marginTop: 6, fontStyle: "italic" }}>
                {t("general.receipt.order.info.note")}{" "}
                {selectedOrder.shippingAddress.additionalInfo}
              </div>
            )}
          </div>
        </section>

        {/* Items */}
        <section style={{ marginTop: 12 }}>
          <h3 style={{ margin: "6px 0" }}>
            {t("general.receipt.order.items")}
          </h3>

          <div style={{ marginTop: 6 }}>
            {selectedOrder.items.map((item: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 12,
                }}
              >
                <div style={{ maxWidth: 520 }}>
                  <div style={{ fontWeight: 600 }}>
                    {item.name?.en || item.name}
                  </div>

                  {item.productId?.mainImage && (
                    <img
                      src={item.productId.mainImage}
                      alt={item.name?.en || ""}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        marginTop: 6,
                      }}
                    />
                  )}
                </div>

                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div>
                    {item.quantity} × {item.price}{" "}
                    {item.productId?.currency || selectedOrder.currency}
                  </div>

                  <div style={{ fontWeight: 700, marginTop: 6 }}>
                    {(item.quantity * item.price).toFixed(2)}{" "}
                    {selectedOrder.currency}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
            }}
          >
            <div />
            <div style={{ textAlign: "right" }}>
              <strong>{t("general.receipt.order.total")}:</strong>{" "}
              {selectedOrder.amount} {selectedOrder.currency}
            </div>
          </div>
        </section>

        <hr style={{ marginTop: 12 }} />

        {/* Footer */}
        <div style={{ marginTop: 12, fontSize: 11 }}>
          <div>{t("general.receipt.order.thanks")}</div>
        </div>
      </div>
    </div>
  );
});

ReceiptHiddenLayout.displayName = "ReceiptHiddenLayout";

export default memo(ReceiptHiddenLayout);
