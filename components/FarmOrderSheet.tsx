import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10 },
  title: { fontSize: 16, marginBottom: 8 },
  batch: { fontSize: 12, marginBottom: 16, color: "#374151" },
  areaSection: { marginBottom: 16 },
  areaHeading: { fontSize: 12, fontWeight: "bold", marginBottom: 6 },
  table: { flexDirection: "row", flexWrap: "wrap", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  row: { flexDirection: "row", borderTopWidth: 1, borderColor: "#e5e7eb" },
  cell: { padding: 4, flex: 1 },
  cellNarrow: { padding: 4, width: 50 },
  cellWide: { padding: 4, width: 80 },
  footer: { marginTop: 16, fontSize: 9, color: "#6b7280" },
});

export interface OrderRow {
  customer_name: string;
  phone: string;
  kilos: number;
  total_price: number;
  payment_status: string;
}

interface FarmOrderSheetProps {
  deliveryBatch: string;
  groups: { area: string; orders: OrderRow[] }[];
}

export function FarmOrderSheet({ deliveryBatch, groups }: FarmOrderSheetProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Teco&apos;s Farms — Order sheet</Text>
        <Text style={styles.batch}>Delivery batch: {deliveryBatch}</Text>
        {groups.map(({ area, orders }) => (
          <View key={area} style={styles.areaSection}>
            <Text style={styles.areaHeading}>{area}</Text>
            <View style={styles.table}>
              <View style={styles.row}>
                <Text style={[styles.cell, { fontWeight: "bold" }]}>Name</Text>
                <Text style={[styles.cellWide, { fontWeight: "bold" }]}>Phone</Text>
                <Text style={[styles.cellNarrow, { fontWeight: "bold" }]}>Kg</Text>
                <Text style={[styles.cellNarrow, { fontWeight: "bold" }]}>Total</Text>
                <Text style={[styles.cellNarrow, { fontWeight: "bold" }]}>Pay</Text>
              </View>
              {orders.map((o, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.cell}>{o.customer_name}</Text>
                  <Text style={styles.cellWide}>{o.phone}</Text>
                  <Text style={styles.cellNarrow}>{o.kilos}</Text>
                  <Text style={styles.cellNarrow}>{o.total_price.toLocaleString()}</Text>
                  <Text style={styles.cellNarrow}>{o.payment_status}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.footer}>
              Subtotal {area}: {orders.reduce((s, o) => s + o.total_price, 0).toLocaleString()} TZS
            </Text>
          </View>
        ))}
        <Text style={[styles.footer, { marginTop: 24 }]}>
          Grand total:{" "}
          {groups
            .reduce((s, g) => s + g.orders.reduce((a, o) => a + o.total_price, 0), 0)
            .toLocaleString()}{" "}
          TZS
        </Text>
      </Page>
    </Document>
  );
}
