//
//  ContentView.swift
//  FootScannerApp
//
//  3D Foot Scanner using ARKit
//

import SwiftUI

struct ContentView: View {
    @StateObject private var scanManager = FootScanManager()
    @State private var showingScanView = false
    @State private var showingSavedScans = false

    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                // App Logo and Title
                VStack(spacing: 10) {
                    Image(systemName: "cube.transparent")
                        .font(.system(size: 80))
                        .foregroundColor(.blue)

                    Text("足部3D扫描器")
                        .font(.largeTitle)
                        .fontWeight(.bold)

                    Text("儿童足部精准扫描 (精度 ≤ 3mm)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 50)

                Spacer()

                // Action Buttons
                VStack(spacing: 20) {
                    Button(action: {
                        showingScanView = true
                    }) {
                        HStack {
                            Image(systemName: "camera.fill")
                            Text("开始扫描")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(15)
                    }

                    Button(action: {
                        showingSavedScans = true
                    }) {
                        HStack {
                            Image(systemName: "folder.fill")
                            Text("查看已保存扫描")
                                .fontWeight(.semibold)
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.green)
                        .foregroundColor(.white)
                        .cornerRadius(15)
                    }
                }
                .padding(.horizontal, 40)

                Spacer()

                // Info Section
                VStack(spacing: 5) {
                    Text("使用ARKit技术")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("支持导出OBJ、PLY格式")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.bottom, 30)
            }
            .navigationBarHidden(true)
            .fullScreenCover(isPresented: $showingScanView) {
                ARScanView(scanManager: scanManager)
            }
            .sheet(isPresented: $showingSavedScans) {
                SavedScansView(scanManager: scanManager)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
