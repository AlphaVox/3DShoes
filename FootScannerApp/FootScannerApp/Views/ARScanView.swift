//
//  ARScanView.swift
//  FootScannerApp
//
//  ARKit-based 3D Scanning View
//

import SwiftUI
import RealityKit
import ARKit

struct ARScanView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var scanManager: FootScanManager

    @State private var isScanning = false
    @State private var showingSaveDialog = false
    @State private var scanName = ""
    @State private var pointCount = 0
    @State private var scanQuality: String = "准备中..."

    var body: some View {
        ZStack {
            // AR View
            ARViewContainer(
                scanManager: scanManager,
                isScanning: $isScanning,
                pointCount: $pointCount,
                scanQuality: $scanQuality
            )
            .edgesIgnoringSafeArea(.all)

            // UI Overlay
            VStack {
                // Top Bar
                HStack {
                    Button(action: {
                        scanManager.stopScanning()
                        presentationMode.wrappedValue.dismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 30))
                            .foregroundColor(.white)
                            .shadow(radius: 5)
                    }

                    Spacer()

                    VStack(alignment: .trailing) {
                        Text("点云数量: \(pointCount)")
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(8)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(8)

                        Text(scanQuality)
                            .font(.caption)
                            .foregroundColor(.white)
                            .padding(8)
                            .background(Color.black.opacity(0.6))
                            .cornerRadius(8)
                    }
                }
                .padding()

                Spacer()

                // Instructions
                if !isScanning {
                    VStack(spacing: 10) {
                        Text("扫描指南")
                            .font(.headline)
                            .foregroundColor(.white)

                        Text("1. 让儿童坐下，保持足部稳定")
                            .font(.caption)
                            .foregroundColor(.white)
                        Text("2. 缓慢移动设备，从多个角度扫描")
                            .font(.caption)
                            .foregroundColor(.white)
                        Text("3. 确保光照充足且均匀")
                            .font(.caption)
                            .foregroundColor(.white)
                    }
                    .padding()
                    .background(Color.black.opacity(0.7))
                    .cornerRadius(15)
                    .padding(.horizontal)
                }

                // Control Buttons
                HStack(spacing: 30) {
                    if !isScanning {
                        Button(action: {
                            scanManager.startScanning()
                            isScanning = true
                        }) {
                            VStack {
                                Image(systemName: "play.circle.fill")
                                    .font(.system(size: 50))
                                Text("开始扫描")
                                    .font(.caption)
                            }
                            .foregroundColor(.green)
                        }
                    } else {
                        Button(action: {
                            scanManager.pauseScanning()
                            isScanning = false
                        }) {
                            VStack {
                                Image(systemName: "pause.circle.fill")
                                    .font(.system(size: 50))
                                Text("暂停")
                                    .font(.caption)
                            }
                            .foregroundColor(.orange)
                        }

                        Button(action: {
                            scanManager.stopScanning()
                            isScanning = false
                            showingSaveDialog = true
                        }) {
                            VStack {
                                Image(systemName: "stop.circle.fill")
                                    .font(.system(size: 50))
                                Text("完成并保存")
                                    .font(.caption)
                            }
                            .foregroundColor(.red)
                        }
                    }
                }
                .padding(.bottom, 50)
                .background(Color.black.opacity(0.5))
                .cornerRadius(20)
                .padding()
            }
        }
        .alert("保存扫描", isPresented: $showingSaveDialog) {
            TextField("输入扫描名称", text: $scanName)
            Button("保存") {
                scanManager.saveScan(name: scanName.isEmpty ? "足部扫描_\(Date())" : scanName)
                presentationMode.wrappedValue.dismiss()
            }
            Button("取消", role: .cancel) {
                scanManager.clearCurrentScan()
            }
        } message: {
            Text("为这次扫描命名")
        }
    }
}

// ARView Container
struct ARViewContainer: UIViewRepresentable {
    @ObservedObject var scanManager: FootScanManager
    @Binding var isScanning: Bool
    @Binding var pointCount: Int
    @Binding var scanQuality: String

    func makeUIView(context: Context) -> ARView {
        let arView = ARView(frame: .zero)

        // Configure AR session
        let config = ARWorldTrackingConfiguration()
        config.sceneReconstruction = .meshWithClassification
        config.planeDetection = [.horizontal]
        config.environmentTexturing = .automatic

        // Enable high-precision depth data if available
        if ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth) {
            config.frameSemantics.insert(.sceneDepth)
        }

        arView.session.run(config)
        arView.session.delegate = context.coordinator

        scanManager.arView = arView

        return arView
    }

    func updateUIView(_ uiView: ARView, context: Context) {
        // Update UI if needed
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, ARSessionDelegate {
        var parent: ARViewContainer

        init(_ parent: ARViewContainer) {
            self.parent = parent
        }

        func session(_ session: ARSession, didUpdate frame: ARFrame) {
            guard parent.isScanning else { return }

            // Process frame for 3D scanning
            parent.scanManager.processFrame(frame)

            // Update statistics
            DispatchQueue.main.async {
                self.parent.pointCount = self.parent.scanManager.pointCloudCount
                self.parent.scanQuality = self.parent.scanManager.getScanQuality()
            }
        }
    }
}
