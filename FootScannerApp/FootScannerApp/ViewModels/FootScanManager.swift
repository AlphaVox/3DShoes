//
//  FootScanManager.swift
//  FootScannerApp
//
//  Core scanning manager using ARKit for high-precision 3D foot scanning
//

import Foundation
import ARKit
import RealityKit
import Combine

class FootScanManager: NSObject, ObservableObject {
    // MARK: - Published Properties
    @Published var isScanning = false
    @Published var pointCloudCount = 0
    @Published var currentScan: FootScan?
    @Published var savedScans: [FootScan] = []

    // MARK: - Properties
    var arView: ARView?
    private var pointCloud: [SIMD3<Float>] = []
    private var meshVertices: [SIMD3<Float>] = []
    private var meshNormals: [SIMD3<Float>] = []
    private var meshColors: [SIMD3<Float>] = []
    private var meshIndices: [UInt32] = []

    private let storageManager = ScanStorageManager()
    private var frameCount = 0
    private let samplingRate = 3 // Process every Nth frame for performance

    // Quality metrics
    private var coverageMap: Set<String> = []
    private var minPoints = 10000 // Minimum points for good quality
    private var optimalPoints = 50000 // Optimal points for high quality

    // MARK: - Initialization
    override init() {
        super.init()
        loadSavedScans()
    }

    // MARK: - Scanning Control
    func startScanning() {
        isScanning = true
        pointCloud.removeAll()
        meshVertices.removeAll()
        meshNormals.removeAll()
        meshColors.removeAll()
        meshIndices.removeAll()
        coverageMap.removeAll()
        frameCount = 0
        pointCloudCount = 0
    }

    func pauseScanning() {
        isScanning = false
    }

    func stopScanning() {
        isScanning = false
    }

    func clearCurrentScan() {
        pointCloud.removeAll()
        meshVertices.removeAll()
        meshNormals.removeAll()
        meshColors.removeAll()
        meshIndices.removeAll()
        coverageMap.removeAll()
        pointCloudCount = 0
        currentScan = nil
    }

    // MARK: - Frame Processing
    func processFrame(_ frame: ARFrame) {
        guard isScanning else { return }

        frameCount += 1

        // Sample frames for performance
        guard frameCount % samplingRate == 0 else { return }

        // Process depth data if available
        if let depthData = frame.sceneDepth {
            processDepthData(depthData, frame: frame)
        }

        // Process mesh anchors
        if let meshAnchors = frame.anchors.compactMap({ $0 as? ARMeshAnchor }) as? [ARMeshAnchor] {
            processMeshAnchors(meshAnchors, transform: frame.camera.transform)
        }
    }

    private func processDepthData(_ sceneDepth: ARDepthData, frame: ARFrame) {
        let depthMap = sceneDepth.depthMap
        let confidenceMap = sceneDepth.confidenceMap

        let width = CVPixelBufferGetWidth(depthMap)
        let height = CVPixelBufferGetHeight(depthMap)

        CVPixelBufferLockBaseAddress(depthMap, .readOnly)
        CVPixelBufferLockBaseAddress(confidenceMap!, .readOnly)

        defer {
            CVPixelBufferUnlockBaseAddress(depthMap, .readOnly)
            CVPixelBufferUnlockBaseAddress(confidenceMap!, .readOnly)
        }

        guard let depthData = CVPixelBufferGetBaseAddress(depthMap)?.assumingMemoryBound(to: Float32.self),
              let confidenceData = CVPixelBufferGetBaseAddress(confidenceMap!)?.assumingMemoryBound(to: UInt8.self) else {
            return
        }

        let camera = frame.camera
        let viewMatrix = camera.viewMatrix(for: .portrait)
        let intrinsics = camera.intrinsics

        // Sample points from depth map (not every pixel for performance)
        let step = 8 // Sample every 8th pixel
        var newPoints: [SIMD3<Float>] = []

        for y in stride(from: 0, to: height, by: step) {
            for x in stride(from: 0, to: width, by: step) {
                let index = y * width + x
                let confidence = confidenceData[index]

                // Only use high confidence depth values
                guard confidence >= 2 else { continue } // 2 = high confidence

                let depth = depthData[index]
                guard depth > 0 && depth < 2.0 else { continue } // Reasonable depth range for foot scanning

                // Convert pixel coordinates to 3D point
                let point = unproject(x: Float(x), y: Float(y), depth: depth,
                                    intrinsics: intrinsics, viewMatrix: viewMatrix)

                newPoints.append(point)

                // Track coverage
                let gridKey = "\(Int(point.x * 100))_\(Int(point.y * 100))_\(Int(point.z * 100))"
                coverageMap.insert(gridKey)
            }
        }

        // Add new points to point cloud
        pointCloud.append(contentsOf: newPoints)
        pointCloudCount = pointCloud.count
    }

    private func processMeshAnchors(_ meshAnchors: [ARMeshAnchor], transform: simd_float4x4) {
        for anchor in meshAnchors {
            let geometry = anchor.geometry

            // Extract vertices
            let vertices = geometry.vertices
            let vertexCount = vertices.count

            for i in 0..<vertexCount {
                let vertex = vertices[i]
                let worldPosition = anchor.transform * SIMD4<Float>(vertex.x, vertex.y, vertex.z, 1.0)
                let position = SIMD3<Float>(worldPosition.x, worldPosition.y, worldPosition.z)

                meshVertices.append(position)

                // Add color (can be enhanced with texture data)
                meshColors.append(SIMD3<Float>(0.8, 0.8, 0.8))
            }

            // Extract normals
            if geometry.normals.count > 0 {
                let normals = geometry.normals
                for i in 0..<min(normals.count, vertexCount) {
                    let normal = normals[i]
                    meshNormals.append(SIMD3<Float>(normal.x, normal.y, normal.z))
                }
            }

            // Extract faces/indices
            let faces = geometry.faces
            let indexBuffer = faces.buffer
            let faceCount = faces.count

            for i in 0..<faceCount {
                let offset = i * faces.indexCountPerPrimitive * MemoryLayout<UInt32>.stride
                let indices = indexBuffer.contents().advanced(by: offset).assumingMemoryBound(to: UInt32.self)

                for j in 0..<faces.indexCountPerPrimitive {
                    meshIndices.append(indices[j])
                }
            }
        }
    }

    private func unproject(x: Float, y: Float, depth: Float,
                          intrinsics: simd_float3x3, viewMatrix: simd_float4x4) -> SIMD3<Float> {
        let fx = intrinsics[0][0]
        let fy = intrinsics[1][1]
        let cx = intrinsics[2][0]
        let cy = intrinsics[2][1]

        let xCamera = (x - cx) * depth / fx
        let yCamera = (y - cy) * depth / fy
        let zCamera = depth

        let cameraPoint = SIMD4<Float>(xCamera, yCamera, zCamera, 1.0)
        let worldPoint = viewMatrix.inverse * cameraPoint

        return SIMD3<Float>(worldPoint.x, worldPoint.y, worldPoint.z)
    }

    // MARK: - Quality Assessment
    func getScanQuality() -> String {
        let coverage = coverageMap.count
        let points = pointCloud.count

        if points < minPoints {
            return "质量: 低 - 需要更多数据"
        } else if points < optimalPoints {
            return "质量: 中等 - 继续扫描"
        } else {
            return "质量: 优秀 ✓"
        }
    }

    // MARK: - Save and Load
    func saveScan(name: String) {
        let scan = FootScan(
            id: UUID(),
            name: name,
            date: Date(),
            pointCloud: pointCloud,
            meshVertices: meshVertices,
            meshNormals: meshNormals,
            meshColors: meshColors,
            meshIndices: meshIndices,
            pointCount: pointCloud.count,
            precision: estimatePrecision()
        )

        storageManager.saveScan(scan)
        savedScans.append(scan)
        currentScan = scan
    }

    func loadSavedScans() {
        savedScans = storageManager.loadAllScans()
    }

    func deleteScan(_ scan: FootScan) {
        storageManager.deleteScan(scan)
        savedScans.removeAll { $0.id == scan.id }
    }

    func exportScan(_ scan: FootScan, format: ExportFormat) -> URL? {
        return storageManager.exportScan(scan, format: format)
    }

    // MARK: - Precision Estimation
    private func estimatePrecision() -> Double {
        // Estimate precision based on point density and coverage
        // Target: 3mm precision
        let coverage = Double(coverageMap.count)
        let points = Double(pointCloud.count)

        // More points and better coverage = better precision
        if points > Double(optimalPoints) && coverage > 1000 {
            return 2.5 // mm - excellent
        } else if points > Double(minPoints) && coverage > 500 {
            return 3.0 // mm - good
        } else {
            return 5.0 // mm - acceptable
        }
    }
}

// MARK: - Export Format
enum ExportFormat: String, CaseIterable {
    case obj = "OBJ"
    case ply = "PLY"
    case usdz = "USDZ"

    var fileExtension: String {
        switch self {
        case .obj: return "obj"
        case .ply: return "ply"
        case .usdz: return "usdz"
        }
    }
}
