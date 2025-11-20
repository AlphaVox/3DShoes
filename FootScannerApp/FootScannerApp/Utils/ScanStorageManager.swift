//
//  ScanStorageManager.swift
//  FootScannerApp
//
//  Manages local storage of foot scans
//

import Foundation
import UIKit

class ScanStorageManager {
    private let fileManager = FileManager.default
    private let scansDirectory: URL

    init() {
        // Create scans directory in Documents
        let documentsPath = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        scansDirectory = documentsPath.appendingPathComponent("FootScans", isDirectory: true)

        createScansDirectoryIfNeeded()
    }

    private func createScansDirectoryIfNeeded() {
        if !fileManager.fileExists(atPath: scansDirectory.path) {
            try? fileManager.createDirectory(at: scansDirectory, withIntermediateDirectories: true)
        }
    }

    // MARK: - Save Scan
    func saveScan(_ scan: FootScan) {
        let scanFolder = scansDirectory.appendingPathComponent(scan.id.uuidString, isDirectory: true)

        do {
            // Create scan folder
            try fileManager.createDirectory(at: scanFolder, withIntermediateDirectories: true)

            // Save metadata as JSON
            let metadataURL = scanFolder.appendingPathComponent("metadata.json")
            let encoder = JSONEncoder()
            encoder.dateEncodingStrategy = .iso8601
            let data = try encoder.encode(scan)
            try data.write(to: metadataURL)

            // Save point cloud as binary
            let pointCloudURL = scanFolder.appendingPathComponent("pointcloud.bin")
            let pointCloudData = scan.pointCloud.withUnsafeBytes { Data($0) }
            try pointCloudData.write(to: pointCloudURL)

            // Save mesh data
            saveMeshData(scan, to: scanFolder)

            print("✓ Scan saved successfully: \(scan.name)")
        } catch {
            print("✗ Error saving scan: \(error.localizedDescription)")
        }
    }

    private func saveMeshData(_ scan: FootScan, to folder: URL) {
        do {
            // Save vertices
            if !scan.meshVertices.isEmpty {
                let verticesURL = folder.appendingPathComponent("vertices.bin")
                let verticesData = scan.meshVertices.withUnsafeBytes { Data($0) }
                try verticesData.write(to: verticesURL)
            }

            // Save normals
            if !scan.meshNormals.isEmpty {
                let normalsURL = folder.appendingPathComponent("normals.bin")
                let normalsData = scan.meshNormals.withUnsafeBytes { Data($0) }
                try normalsData.write(to: normalsURL)
            }

            // Save colors
            if !scan.meshColors.isEmpty {
                let colorsURL = folder.appendingPathComponent("colors.bin")
                let colorsData = scan.meshColors.withUnsafeBytes { Data($0) }
                try colorsData.write(to: colorsURL)
            }

            // Save indices
            if !scan.meshIndices.isEmpty {
                let indicesURL = folder.appendingPathComponent("indices.bin")
                let indicesData = scan.meshIndices.withUnsafeBytes { Data($0) }
                try indicesData.write(to: indicesURL)
            }
        } catch {
            print("✗ Error saving mesh data: \(error.localizedDescription)")
        }
    }

    // MARK: - Load Scans
    func loadAllScans() -> [FootScan] {
        var scans: [FootScan] = []

        guard let scanFolders = try? fileManager.contentsOfDirectory(
            at: scansDirectory,
            includingPropertiesForKeys: nil
        ) else {
            return []
        }

        for folder in scanFolders {
            if let scan = loadScan(from: folder) {
                scans.append(scan)
            }
        }

        return scans.sorted { $0.date > $1.date }
    }

    private func loadScan(from folder: URL) -> FootScan? {
        let metadataURL = folder.appendingPathComponent("metadata.json")

        guard let data = try? Data(contentsOf: metadataURL) else {
            return nil
        }

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        return try? decoder.decode(FootScan.self, from: data)
    }

    // MARK: - Delete Scan
    func deleteScan(_ scan: FootScan) {
        let scanFolder = scansDirectory.appendingPathComponent(scan.id.uuidString, isDirectory: true)

        do {
            try fileManager.removeItem(at: scanFolder)
            print("✓ Scan deleted: \(scan.name)")
        } catch {
            print("✗ Error deleting scan: \(error.localizedDescription)")
        }
    }

    // MARK: - Export Formats
    func exportScan(_ scan: FootScan, format: ExportFormat) -> URL? {
        let exportFolder = scansDirectory.appendingPathComponent("Exports", isDirectory: true)
        try? fileManager.createDirectory(at: exportFolder, withIntermediateDirectories: true)

        let fileName = "\(scan.name)_\(Int(Date().timeIntervalSince1970)).\(format.fileExtension)"
        let exportURL = exportFolder.appendingPathComponent(fileName)

        switch format {
        case .obj:
            return exportAsOBJ(scan, to: exportURL)
        case .ply:
            return exportAsPLY(scan, to: exportURL)
        case .usdz:
            return exportAsUSDZ(scan, to: exportURL)
        }
    }

    // MARK: - OBJ Export
    private func exportAsOBJ(_ scan: FootScan, to url: URL) -> URL? {
        var objContent = "# Foot Scan: \(scan.name)\n"
        objContent += "# Date: \(scan.formattedDate)\n"
        objContent += "# Points: \(scan.pointCount)\n"
        objContent += "# Precision: \(scan.precisionDescription)\n\n"

        // Use mesh vertices if available, otherwise use point cloud
        let vertices = scan.meshVertices.isEmpty ? scan.pointCloud : scan.meshVertices

        // Write vertices
        for vertex in vertices {
            objContent += "v \(vertex.x) \(vertex.y) \(vertex.z)\n"
        }

        // Write normals
        if !scan.meshNormals.isEmpty {
            objContent += "\n"
            for normal in scan.meshNormals {
                objContent += "vn \(normal.x) \(normal.y) \(normal.z)\n"
            }
        }

        // Write faces
        if !scan.meshIndices.isEmpty {
            objContent += "\n"
            for i in stride(from: 0, to: scan.meshIndices.count, by: 3) {
                let i1 = scan.meshIndices[i] + 1
                let i2 = scan.meshIndices[i + 1] + 1
                let i3 = scan.meshIndices[i + 2] + 1

                if scan.meshNormals.isEmpty {
                    objContent += "f \(i1) \(i2) \(i3)\n"
                } else {
                    objContent += "f \(i1)//\(i1) \(i2)//\(i2) \(i3)//\(i3)\n"
                }
            }
        }

        do {
            try objContent.write(to: url, atomically: true, encoding: .utf8)
            print("✓ Exported as OBJ: \(url.lastPathComponent)")
            return url
        } catch {
            print("✗ Error exporting OBJ: \(error.localizedDescription)")
            return nil
        }
    }

    // MARK: - PLY Export
    private func exportAsPLY(_ scan: FootScan, to url: URL) -> URL? {
        let vertices = scan.meshVertices.isEmpty ? scan.pointCloud : scan.meshVertices
        let vertexCount = vertices.count
        let faceCount = scan.meshIndices.count / 3

        var plyContent = "ply\n"
        plyContent += "format ascii 1.0\n"
        plyContent += "comment Foot Scan: \(scan.name)\n"
        plyContent += "comment Date: \(scan.formattedDate)\n"
        plyContent += "comment Precision: \(scan.precisionDescription)\n"
        plyContent += "element vertex \(vertexCount)\n"
        plyContent += "property float x\n"
        plyContent += "property float y\n"
        plyContent += "property float z\n"

        if !scan.meshNormals.isEmpty {
            plyContent += "property float nx\n"
            plyContent += "property float ny\n"
            plyContent += "property float nz\n"
        }

        if !scan.meshColors.isEmpty {
            plyContent += "property uchar red\n"
            plyContent += "property uchar green\n"
            plyContent += "property uchar blue\n"
        }

        if faceCount > 0 {
            plyContent += "element face \(faceCount)\n"
            plyContent += "property list uchar int vertex_indices\n"
        }

        plyContent += "end_header\n"

        // Write vertex data
        for i in 0..<vertexCount {
            let vertex = vertices[i]
            plyContent += "\(vertex.x) \(vertex.y) \(vertex.z)"

            if i < scan.meshNormals.count {
                let normal = scan.meshNormals[i]
                plyContent += " \(normal.x) \(normal.y) \(normal.z)"
            }

            if i < scan.meshColors.count {
                let color = scan.meshColors[i]
                let r = UInt8(color.x * 255)
                let g = UInt8(color.y * 255)
                let b = UInt8(color.z * 255)
                plyContent += " \(r) \(g) \(b)"
            }

            plyContent += "\n"
        }

        // Write face data
        for i in stride(from: 0, to: scan.meshIndices.count, by: 3) {
            let i1 = scan.meshIndices[i]
            let i2 = scan.meshIndices[i + 1]
            let i3 = scan.meshIndices[i + 2]
            plyContent += "3 \(i1) \(i2) \(i3)\n"
        }

        do {
            try plyContent.write(to: url, atomically: true, encoding: .utf8)
            print("✓ Exported as PLY: \(url.lastPathComponent)")
            return url
        } catch {
            print("✗ Error exporting PLY: \(error.localizedDescription)")
            return nil
        }
    }

    // MARK: - USDZ Export
    private func exportAsUSDZ(_ scan: FootScan, to url: URL) -> URL? {
        // For USDZ, we'll first create an OBJ, then convert it
        // This is a simplified implementation
        let tempOBJ = FileManager.default.temporaryDirectory.appendingPathComponent("temp.obj")

        guard let objURL = exportAsOBJ(scan, to: tempOBJ) else {
            return nil
        }

        // In a real app, you would use Model I/O or RealityKit to convert OBJ to USDZ
        // For now, we'll just return the OBJ path
        print("⚠️ USDZ export requires additional conversion. OBJ file created at: \(objURL.path)")

        return objURL
    }

    // MARK: - Get Storage Size
    func getStorageSize() -> String {
        guard let fileURLs = try? fileManager.contentsOfDirectory(
            at: scansDirectory,
            includingPropertiesForKeys: [.fileSizeKey],
            options: .skipsHiddenFiles
        ) else {
            return "0 MB"
        }

        let totalSize = fileURLs.reduce(0) { total, url in
            let size = (try? url.resourceValues(forKeys: [.fileSizeKey]))?.fileSize ?? 0
            return total + size
        }

        let sizeInMB = Double(totalSize) / 1_048_576.0
        return String(format: "%.1f MB", sizeInMB)
    }
}
