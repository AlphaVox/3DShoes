//
//  FootScan.swift
//  FootScannerApp
//
//  Data model for foot scan
//

import Foundation
import simd

struct FootScan: Identifiable, Codable {
    let id: UUID
    var name: String
    let date: Date
    let pointCloud: [SIMD3<Float>]
    let meshVertices: [SIMD3<Float>]
    let meshNormals: [SIMD3<Float>]
    let meshColors: [SIMD3<Float>]
    let meshIndices: [UInt32]
    let pointCount: Int
    let precision: Double // in millimeters

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        formatter.locale = Locale(identifier: "zh_CN")
        return formatter.string(from: date)
    }

    var precisionDescription: String {
        return String(format: "%.1f mm", precision)
    }

    var qualityLevel: String {
        if precision <= 2.5 {
            return "优秀"
        } else if precision <= 3.0 {
            return "良好"
        } else {
            return "可接受"
        }
    }
}

// MARK: - Codable Support for SIMD types
extension SIMD3: Codable where Scalar: Codable {
    public func encode(to encoder: Encoder) throws {
        var container = encoder.unkeyedContainer()
        try container.encode(x)
        try container.encode(y)
        try container.encode(z)
    }

    public init(from decoder: Decoder) throws {
        var container = try decoder.unkeyedContainer()
        let x = try container.decode(Scalar.self)
        let y = try container.decode(Scalar.self)
        let z = try container.decode(Scalar.self)
        self.init(x: x, y: y, z: z)
    }
}
