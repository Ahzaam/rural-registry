import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from '@react-pdf/renderer';
import { AidEvent, Distribution, MonthlyContribution, Family } from '../../types/types';
import { QRCode } from 'react-qrcode-logo';

Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf' },
    { src: 'https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UN_r8OUuhs.ttf', fontWeight: 'bold' },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Open Sans'
  },
  headerContainer: {
    marginBottom: 30,
    borderBottom: '1px solid #000',
    paddingBottom: 10
  },
  orgName: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  eventName: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold'
  },
  headerDetails: {
    marginTop: 10,
    fontSize: 10
  },
  headerDetail: {
    marginBottom: 4
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottom: '1px solid #000',
    paddingBottom: 3
  },
  table: {
    width: '100%'
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
    backgroundColor: '#f4f4f4'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingVertical: 4
  },
  column: {
    flex: 1,
    paddingRight: 8,
    fontSize: 9
  },
  columnHeader: {
    fontSize: 9,
    fontWeight: 'bold'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5
  },
  summaryLabel: {
    width: 120,
    fontSize: 9
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: 'bold'
  },
  qrCode: {
    display: 'none'
  }
});

// Base64 encoded SVG logo
const logoBase64 = 'data:image/svg+xml;base64,' + btoa(`<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" fill="none"/>
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c6a55c" />
      <stop offset="50%" stop-color="#f9d77f" />
      <stop offset="100%" stop-color="#c6a55c" />
    </linearGradient>
  </defs>
  <path d="M350 250c0 55.23-44.77 100-100 100-55.23 0-100-44.77-100-100s44.77-100 100-100c30 0 56.79 13.43 75 34.58" 
        stroke="url(#goldGradient)" 
        stroke-width="24" 
        fill="none" 
        stroke-linecap="round"/>
  <line x1="295" y1="250" x2="350" y2="250" 
        stroke="url(#goldGradient)" 
        stroke-width="24" 
        stroke-linecap="round"/>
</svg>`);

interface Props {
  event: AidEvent;
  records: (Distribution | MonthlyContribution)[];
  families: Family[];
  contributionMetrics?: {
    totalExpected: number;
    totalCollected: number;
    pending: number;
    excused: number;
    paid: number;
  };
  itemsSummary?: {
    name: string;
    quantity: number;
    unit?: string;
    distributed: number;
    remaining: number;
  }[];
}

export const EventSummaryPDF: React.FC<Props> = ({ event, records, families, contributionMetrics, itemsSummary }) => {
  const getFamilyName = (familyId: string) => {
    const family = families.find(f => f.id === familyId);
    return family ? `${family.headOfFamily.firstName} ${family.headOfFamily.lastName}` : 'Unknown';
  };

  return (
    <PDFViewer style={{ width: '100%', height: '80vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.orgName}>MASJIDUL-MINHAJ</Text>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.headerDetails}>
              <Text style={styles.headerDetail}>Date: {new Date(event.date).toLocaleDateString()}</Text>
              <Text style={styles.headerDetail}>Type: {event.type === 'collection' ? 'Collection Event' : 'Distribution Event'}</Text>
              <Text style={styles.headerDetail}>Event ID: {event.id}</Text>
              <Text style={styles.headerDetail}>Report Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</Text>
            </View>
          </View>

          {event.type === 'collection' && contributionMetrics && (
            <>
              <Text style={styles.sectionTitle}>Collection Summary</Text>
              <View style={{ marginBottom: 20 }}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount per Family:</Text>
                  <Text style={styles.summaryValue}>Rs. {event.targetAmount || 0}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Expected:</Text>
                  <Text style={styles.summaryValue}>Rs. {contributionMetrics.totalExpected}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Collected:</Text>
                  <Text style={styles.summaryValue}>Rs. {contributionMetrics.totalCollected}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Paid Families:</Text>
                  <Text style={styles.summaryValue}>{contributionMetrics.paid}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Excused Families:</Text>
                  <Text style={styles.summaryValue}>{contributionMetrics.excused}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Payment Records</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={[styles.column, { flex: 2 }]}>
                    <Text style={styles.columnHeader}>Family</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>ID</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>Status</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={[styles.columnHeader, { textAlign: 'right' }]}>Amount</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>Paid Time</Text>
                  </View>
                </View>

                {records.map((record, index) => {
                  const family = families.find(f => f.id === record.familyId);
                  const paidTime = record.updatedAt ? new Date(record.updatedAt.seconds * 1000).toLocaleTimeString() : '-';
                  return (
                    <View style={styles.tableRow} key={index}>
                      <View style={[styles.column, { flex: 2 }]}>
                        <Text style={styles.cell}>{getFamilyName(record.familyId)}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={styles.cell}>{family?.homeId || '-'}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={styles.cell}>{record.status}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={[styles.cell, { textAlign: 'right' }]}>Rs. {(record as MonthlyContribution).amount || 0}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={styles.cell}>{paidTime}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {event.type === 'distribution' && itemsSummary && (
            <>
              <Text style={styles.sectionTitle}>Distribution Summary</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={[styles.column, { flex: 2 }]}> 
                    <Text style={styles.columnHeader}>Item</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>Total Quantity</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>Distributed</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>Remaining</Text>
                  </View>
                </View>

                {itemsSummary.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <View style={[styles.column, { flex: 2 }]}>
                      <Text style={styles.cell}>{item.name}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.quantity} {item.unit}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.distributed} {item.unit}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.cell}>{item.remaining} {item.unit}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Distribution Records</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <View style={[styles.column, { flex: 2 }]}> 
                    <Text style={styles.columnHeader}>Family</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>ID</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.columnHeader}>Status</Text>
                  </View>
                </View>

                {records.map((record, index) => {
                  const family = families.find(f => f.id === record.familyId);
                  return (
                    <View style={styles.tableRow} key={index}>
                      <View style={[styles.column, { flex: 2 }]}>
                        <Text style={styles.cell}>{getFamilyName(record.familyId)}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={styles.cell}>{family?.homeId || '-'}</Text>
                      </View>
                      <View style={styles.column}>
                        <Text style={styles.cell}>{record.status}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text>Masjidul-Minhaj</Text>
            <Text>Reference: {event.id}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default EventSummaryPDF;