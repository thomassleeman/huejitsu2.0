"use client";

import { useEffect } from "react";
import chroma from "chroma-js";

export default function DebugChroma() {
  useEffect(() => {
    console.log("Testing chroma.js deltaE method in browser...");

    try {
      // Test 1: Basic deltaE with strings
      const result1 = chroma.deltaE("#ff0000", "#00ff00");
      console.log("✅ deltaE with strings:", result1);

      // Test 2: deltaE with chroma objects
      const color1 = chroma("#ff0000");
      const color2 = chroma("#00ff00");
      const result2 = chroma.deltaE(color1, color2);
      console.log("✅ deltaE with chroma objects:", result2);

      // Test 3: Simulate the exact code pattern from accessibility checker
      const colors = ["#ff0000", "#00ff00", "#0000ff"];
      const simulatedColors = colors.map((color) => {
        const [r, g, b] = chroma(color).rgb();
        // Simulate protanopia
        const newR = 0.567 * r + 0.433 * g;
        const newG = 0.558 * r + 0.442 * g;
        const newB = 0.242 * g + 0.758 * b;
        return chroma
          .rgb(
            Math.max(0, Math.min(255, newR)),
            Math.max(0, Math.min(255, newG)),
            Math.max(0, Math.min(255, newB))
          )
          .hex();
      });

      console.log("Original colors:", colors);
      console.log("Simulated colors:", simulatedColors);

      // Test deltaE on simulated colors
      for (let i = 0; i < simulatedColors.length - 1; i++) {
        for (let j = i + 1; j < simulatedColors.length; j++) {
          const deltaE = chroma.deltaE(simulatedColors[i], simulatedColors[j]);
          console.log(
            `✅ deltaE(${simulatedColors[i]}, ${simulatedColors[j]}):`,
            deltaE
          );
        }
      }
    } catch (error) {
      console.error("❌ deltaE error in browser:", error);
      console.error("Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Chroma.js deltaE Debug</h1>
      <p>Check the browser console for deltaE test results.</p>
    </div>
  );
}
