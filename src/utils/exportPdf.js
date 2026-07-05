/**
 * PDF Export Utility
 * 
 * Generates a clean, readable PDF summary report of computed results
 * using jsPDF. Includes graph summary, shortest path, and MST data.
 */
import { jsPDF } from 'jspdf';

/**
 * Export results as a PDF report.
 */
export function exportAsPdf({ graphData, shortestPath, mstResult, stats }) {
  const doc = new jsPDF();
  let y = 20;
  const marginLeft = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('LogiFlow — Results Report', marginLeft, y);
  y += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated: ${new Date().toLocaleString()}`, marginLeft, y);
  y += 12;

  // Divider
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y, pageWidth - marginLeft, y);
  y += 10;

  // Graph Summary
  if (stats) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Graph Summary', marginLeft, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const statLines = [
      `Total Locations: ${stats.nodeCount}`,
      `Total Routes: ${stats.edgeCount}`,
      `Average Weight: ${stats.avgWeight}`,
      `Graph Density: ${(stats.density * 100).toFixed(1)}%`,
      `Longest Route: ${stats.longestRoute ? `${stats.longestRoute.from} → ${stats.longestRoute.to} (${stats.longestRoute.weight})` : 'N/A'}`,
    ];

    for (const line of statLines) {
      doc.text(`  • ${line}`, marginLeft, y);
      y += 6;
    }
    y += 6;
  }

  // Shortest Path Results
  if (shortestPath?.path) {
    checkPageBreak();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Shortest Path', marginLeft, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    doc.text(`Route: ${shortestPath.path.join('  →  ')}`, marginLeft, y);
    y += 6;
    doc.text(`Total Distance: ${shortestPath.totalDistance}`, marginLeft, y);
    y += 6;
    doc.text(`Nodes Visited: ${shortestPath.nodesVisited}`, marginLeft, y);
    y += 6;
    doc.text(`Edges Relaxed: ${shortestPath.edgesRelaxed}`, marginLeft, y);
    y += 10;
  } else if (shortestPath?.message) {
    checkPageBreak();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Shortest Path', marginLeft, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(239, 68, 68); // red-500
    doc.text(shortestPath.message, marginLeft, y);
    y += 10;
  }

  // MST Results
  if (mstResult) {
    checkPageBreak();

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 158, 11); // amber-500
    doc.text('Optimized Network (MST)', marginLeft, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    doc.text(`Total Cost: ${mstResult.totalCost}`, marginLeft, y);
    y += 6;

    if (mstResult.isForest) {
      doc.setTextColor(245, 158, 11);
      doc.text(`Note: Graph is disconnected (${mstResult.componentCount} components). Showing minimum spanning forest.`, marginLeft, y);
      y += 6;
      doc.setTextColor(51, 65, 85);
    }

    doc.text(`Edges in optimized network:`, marginLeft, y);
    y += 6;

    // Edge table header
    doc.setFont('helvetica', 'bold');
    doc.text('From', marginLeft + 4, y);
    doc.text('To', marginLeft + 54, y);
    doc.text('Weight', marginLeft + 104, y);
    y += 5;
    doc.setLineWidth(0.3);
    doc.line(marginLeft + 4, y, marginLeft + 140, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    for (const edge of mstResult.mstEdges) {
      checkPageBreak();
      doc.text(edge.from, marginLeft + 4, y);
      doc.text(edge.to, marginLeft + 54, y);
      doc.text(String(edge.weight), marginLeft + 104, y);
      y += 5;
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `LogiFlow Report — Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save('logiflow-report.pdf');

  function checkPageBreak() {
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 20;
    }
  }
}
