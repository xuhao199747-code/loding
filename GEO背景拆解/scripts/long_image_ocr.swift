import CoreGraphics
import Foundation
import ImageIO
import Vision

struct OCRLine: Codable {
    let text: String
    let confidence: Float
    let x: Int
    let y: Int
    let width: Int
    let height: Int
    let tile: Int
}

struct OCRPayload: Codable {
    let image: String
    let width: Int
    let height: Int
    let lines: [OCRLine]
}

enum OCRError: Error, CustomStringConvertible {
    case usage
    case invalidNumber(String)
    case imageLoad(String)
    case cropFailed(Int, Int)

    var description: String {
        switch self {
        case .usage:
            return "usage: swift scripts/long_image_ocr.swift INPUT OUTPUT [tile_height] [start_y] [end_y]"
        case .invalidNumber(let value):
            return "invalid integer argument: \(value)"
        case .imageLoad(let path):
            return "unable to load image: \(path)"
        case .cropFailed(let start, let height):
            return "unable to crop tile at y=\(start), height=\(height)"
        }
    }
}

func integerArgument(_ arguments: [String], index: Int, default defaultValue: Int) throws -> Int {
    guard arguments.count > index else { return defaultValue }
    guard let value = Int(arguments[index]) else {
        throw OCRError.invalidNumber(arguments[index])
    }
    return value
}

func recognize(tileImage: CGImage, tileIndex: Int, tileStartY: Int) throws -> [OCRLine] {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["zh-Hans", "en-US"]
    request.usesLanguageCorrection = true

    let handler = VNImageRequestHandler(cgImage: tileImage, orientation: .up)
    try handler.perform([request])

    let tileWidth = tileImage.width
    let tileHeight = tileImage.height
    let observations = request.results ?? []

    return observations.compactMap { observation in
        guard let candidate = observation.topCandidates(1).first else { return nil }
        let box = observation.boundingBox
        let x = Int((box.minX * CGFloat(tileWidth)).rounded(.down))
        let localTop = (1.0 - box.maxY) * CGFloat(tileHeight)
        let y = tileStartY + Int(localTop.rounded(.down))
        let width = max(1, Int((box.width * CGFloat(tileWidth)).rounded(.up)))
        let height = max(1, Int((box.height * CGFloat(tileHeight)).rounded(.up)))
        return OCRLine(
            text: candidate.string,
            confidence: candidate.confidence,
            x: max(0, x),
            y: max(0, y),
            width: width,
            height: height,
            tile: tileIndex
        )
    }
    .sorted {
        if abs($0.y - $1.y) > 8 { return $0.y < $1.y }
        return $0.x < $1.x
    }
}

func run() throws {
    let arguments = CommandLine.arguments
    guard arguments.count >= 3 else { throw OCRError.usage }

    let inputPath = arguments[1]
    let outputPath = arguments[2]
    let tileHeight = try integerArgument(arguments, index: 3, default: 2400)
    let startY = try integerArgument(arguments, index: 4, default: 0)

    guard tileHeight > 0, startY >= 0 else {
        throw OCRError.invalidNumber(tileHeight <= 0 ? String(tileHeight) : String(startY))
    }

    let inputURL = URL(fileURLWithPath: inputPath)
    guard
        let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
        let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
    else {
        throw OCRError.imageLoad(inputPath)
    }

    let imageWidth = image.width
    let imageHeight = image.height
    let requestedEndY = try integerArgument(arguments, index: 5, default: imageHeight)
    let endY = min(imageHeight, requestedEndY)
    guard startY < endY else { throw OCRError.invalidNumber(String(requestedEndY)) }

    var allLines: [OCRLine] = []
    var tileIndex = 0
    var tileStartY = startY

    while tileStartY < endY {
        let currentHeight = min(tileHeight, endY - tileStartY)
        let cropRect = CGRect(x: 0, y: tileStartY, width: imageWidth, height: currentHeight)
        guard let tileImage = image.cropping(to: cropRect) else {
            throw OCRError.cropFailed(tileStartY, currentHeight)
        }
        allLines.append(contentsOf: try recognize(
            tileImage: tileImage,
            tileIndex: tileIndex,
            tileStartY: tileStartY
        ))
        tileIndex += 1
        tileStartY += currentHeight
    }

    allLines.sort {
        if abs($0.y - $1.y) > 8 { return $0.y < $1.y }
        return $0.x < $1.x
    }

    let payload = OCRPayload(
        image: inputPath,
        width: imageWidth,
        height: imageHeight,
        lines: allLines
    )
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    let data = try encoder.encode(payload)
    try data.write(to: URL(fileURLWithPath: outputPath), options: .atomic)
}

do {
    try run()
} catch {
    FileHandle.standardError.write(Data("\(error)\n".utf8))
    exit(1)
}
