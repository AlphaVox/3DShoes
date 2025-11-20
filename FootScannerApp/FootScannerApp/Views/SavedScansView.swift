//
//  SavedScansView.swift
//  FootScannerApp
//
//  View for displaying and managing saved scans
//

import SwiftUI

struct SavedScansView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var scanManager: FootScanManager
    @State private var selectedScan: FootScan?
    @State private var showingExportOptions = false
    @State private var showingDeleteAlert = false
    @State private var scanToDelete: FootScan?

    var body: some View {
        NavigationView {
            ZStack {
                if scanManager.savedScans.isEmpty {
                    // Empty state
                    VStack(spacing: 20) {
                        Image(systemName: "tray")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)

                        Text("暂无保存的扫描")
                            .font(.title2)
                            .foregroundColor(.secondary)

                        Text("完成扫描后将显示在这里")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                } else {
                    // Scans list
                    List {
                        ForEach(scanManager.savedScans) { scan in
                            ScanRowView(scan: scan)
                                .contentShape(Rectangle())
                                .onTapGesture {
                                    selectedScan = scan
                                }
                                .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                                    Button(role: .destructive) {
                                        scanToDelete = scan
                                        showingDeleteAlert = true
                                    } label: {
                                        Label("删除", systemImage: "trash")
                                    }

                                    Button {
                                        selectedScan = scan
                                        showingExportOptions = true
                                    } label: {
                                        Label("导出", systemImage: "square.and.arrow.up")
                                    }
                                    .tint(.blue)
                                }
                        }
                    }
                }
            }
            .navigationTitle("已保存扫描")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("关闭") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
            .sheet(item: $selectedScan) { scan in
                ScanDetailView(scan: scan, scanManager: scanManager)
            }
            .confirmationDialog("导出格式", isPresented: $showingExportOptions) {
                ForEach(ExportFormat.allCases, id: \.self) { format in
                    Button(format.rawValue) {
                        if let scan = selectedScan {
                            exportScan(scan, format: format)
                        }
                    }
                }
                Button("取消", role: .cancel) {}
            }
            .alert("确认删除", isPresented: $showingDeleteAlert) {
                Button("删除", role: .destructive) {
                    if let scan = scanToDelete {
                        scanManager.deleteScan(scan)
                    }
                }
                Button("取消", role: .cancel) {}
            } message: {
                if let scan = scanToDelete {
                    Text("确定要删除 \"\(scan.name)\" 吗？此操作无法撤销。")
                }
            }
        }
    }

    private func exportScan(_ scan: FootScan, format: ExportFormat) {
        if let url = scanManager.exportScan(scan, format: format) {
            // Show share sheet
            let activityVC = UIActivityViewController(
                activityItems: [url],
                applicationActivities: nil
            )

            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let rootVC = windowScene.windows.first?.rootViewController {
                rootVC.present(activityVC, animated: true)
            }
        }
    }
}

// MARK: - Scan Row View
struct ScanRowView: View {
    let scan: FootScan

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(scan.name)
                    .font(.headline)

                Spacer()

                QualityBadge(quality: scan.qualityLevel)
            }

            HStack {
                Label(scan.formattedDate, systemImage: "calendar")
                    .font(.caption)
                    .foregroundColor(.secondary)

                Spacer()

                Label("\(scan.pointCount) 点", systemImage: "point.3.connected.trianglepath.dotted")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            HStack {
                Label("精度: \(scan.precisionDescription)", systemImage: "ruler")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 8)
    }
}

// MARK: - Quality Badge
struct QualityBadge: View {
    let quality: String

    var badgeColor: Color {
        switch quality {
        case "优秀": return .green
        case "良好": return .blue
        default: return .orange
        }
    }

    var body: some View {
        Text(quality)
            .font(.caption)
            .fontWeight(.semibold)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(badgeColor.opacity(0.2))
            .foregroundColor(badgeColor)
            .cornerRadius(8)
    }
}

// MARK: - Scan Detail View
struct ScanDetailView: View {
    let scan: FootScan
    @ObservedObject var scanManager: FootScanManager
    @Environment(\.presentationMode) var presentationMode
    @State private var showingExportOptions = false

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header
                    VStack(alignment: .leading, spacing: 10) {
                        Text(scan.name)
                            .font(.title)
                            .fontWeight(.bold)

                        HStack {
                            QualityBadge(quality: scan.qualityLevel)
                            Spacer()
                            Text(scan.formattedDate)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(15)

                    // Stats
                    VStack(alignment: .leading, spacing: 15) {
                        Text("扫描统计")
                            .font(.headline)

                        StatRow(icon: "point.3.connected.trianglepath.dotted",
                               label: "点云数量",
                               value: "\(scan.pointCount)")

                        StatRow(icon: "ruler",
                               label: "扫描精度",
                               value: scan.precisionDescription)

                        StatRow(icon: "cube",
                               label: "网格顶点",
                               value: "\(scan.meshVertices.count)")

                        StatRow(icon: "triangle",
                               label: "三角面",
                               value: "\(scan.meshIndices.count / 3)")
                    }
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(15)

                    // Actions
                    VStack(spacing: 15) {
                        Button(action: {
                            showingExportOptions = true
                        }) {
                            HStack {
                                Image(systemName: "square.and.arrow.up")
                                Text("导出扫描数据")
                                    .fontWeight(.semibold)
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.blue)
                            .foregroundColor(.white)
                            .cornerRadius(15)
                        }

                        Text("支持导出格式: OBJ, PLY, USDZ")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                    }
                    .padding()
                }
                .padding()
            }
            .navigationTitle("扫描详情")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("完成") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
            .confirmationDialog("选择导出格式", isPresented: $showingExportOptions) {
                ForEach(ExportFormat.allCases, id: \.self) { format in
                    Button(format.rawValue) {
                        exportScan(format: format)
                    }
                }
                Button("取消", role: .cancel) {}
            }
        }
    }

    private func exportScan(format: ExportFormat) {
        if let url = scanManager.exportScan(scan, format: format) {
            let activityVC = UIActivityViewController(
                activityItems: [url],
                applicationActivities: nil
            )

            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
               let rootVC = windowScene.windows.first?.rootViewController {
                rootVC.present(activityVC, animated: true)
            }
        }
    }
}

// MARK: - Stat Row
struct StatRow: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.blue)
                .frame(width: 25)

            Text(label)
                .foregroundColor(.secondary)

            Spacer()

            Text(value)
                .fontWeight(.semibold)
        }
    }
}
