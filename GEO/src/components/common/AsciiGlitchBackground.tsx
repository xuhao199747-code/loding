import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import asciiBackground from "@/assets/ascii-background.txt?raw"

type AsciiGlitchBackgroundProps = {
  className?: string
}

export function AsciiGlitchBackground({ className }: AsciiGlitchBackgroundProps) {
  const baseLines = useMemo(() => {
    const sourceLines = asciiBackground.trimEnd().split("\n")
    const width = Math.max(...sourceLines.map((line) => line.length))

    return sourceLines.map((line) => line.padEnd(width, " "))
  }, [])

  const [frame, setFrame] = useState(() => createAsciiFrame(baseLines))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setFrame(createAsciiFrame(baseLines))
    }, 82)

    return () => window.clearInterval(intervalId)
  }, [baseLines])

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-0 flex items-start justify-center overflow-hidden bg-white px-6 pb-6 pt-[6px]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="dashboard-ascii-scanlines absolute inset-0" />
      <pre className="dashboard-ascii-glitch relative z-[1] m-0 max-h-full max-w-full select-none whitespace-pre font-mono text-[clamp(5px,0.58vw,9px)] leading-none tracking-normal text-foreground opacity-[0.15]">
        {frame}
      </pre>
      <div className="dashboard-ascii-noise absolute inset-0 z-[2]" />
    </div>
  )
}

function createAsciiFrame(baseLines: string[]) {
  const active: Array<[number, number]> = []
  const dense: Array<[number, number]> = []
  const frame = baseLines.map((line) => line.split(""))

  for (let y = 0; y < baseLines.length; y++) {
    for (let x = 0; x < baseLines[y].length; x++) {
      const character = baseLines[y][x]

      if (character !== " ") {
        active.push([y, x])

        if (![".", ":", ","].includes(character)) {
          dense.push([y, x])
        }
      }
    }
  }

  const total = Math.max(24, Math.floor(active.length * 0.01))
  const denseTotal = Math.max(8, Math.floor(dense.length * 0.005))

  for (let i = 0; i < total; i++) {
    const [y, x] = pickAsciiPoint(active)
    const baseCharacter = frame[y][x]
    frame[y][x] = Math.random() < 0.82 ? similarAsciiGlyph(baseCharacter) : Math.random() < 0.6 ? "." : " "
  }

  if (dense.length > 0) {
    for (let i = 0; i < denseTotal; i++) {
      const [y, x] = pickAsciiPoint(dense)
      frame[y][x] = similarAsciiGlyph(frame[y][x])
    }
  }

  return frame.map((row) => row.join("")).join("\n")
}

function pickAsciiPoint(points: Array<[number, number]>) {
  return points[Math.floor(Math.random() * points.length)]
}

function similarAsciiGlyph(character: string) {
  if (character === "." || character === "," || character === ":") {
    return [".", ",", ":", " ", '"'][Math.floor(Math.random() * 5)]
  }

  if (character === '"' || character === "'") {
    return ['"', "'", ":", ",", "-", "_"][Math.floor(Math.random() * 6)]
  }

  if (character === "-" || character === "_") {
    return ["-", "_", '"', ",", ":", "+", "="][Math.floor(Math.random() * 7)]
  }

  if (character === "+" || character === "=" || character === "^") {
    return ["+", "=", "^", "_", "-", ":"][Math.floor(Math.random() * 6)]
  }

  return [".", ":", ",", '"', "-", "_", "+", "=", "^"][Math.floor(Math.random() * 9)]
}
