import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import plateCalc from "../utils/plateCalc";
import { Button, Heading, TextField, Container, Flex } from "@radix-ui/themes";

const drawWeights = () => {
  const canvas = document.getElementById("canvas");
  console.log(canvas);
  if (canvas) {
    const ctx = canvas.getContext("2d");
    // Rounded rectangle with zero radius (specified as a number)
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.roundRect(10, 20, 150, 100, 0);
    ctx.stroke();

    // Rounded rectangle with 40px radius (single element list)
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.roundRect(10, 20, 150, 100, [20,40]);
    ctx.stroke();
  }
};

const PlateCalcView = () => {
  const totalWeightRef = useRef<HTMLInputElement>(null);
  const [plateCalculation, setPlateCalculation] = useState<{
    plates: number[];
  } | null>(null);

  const handleCalculatePlates = () => {
    const totalWeight = totalWeightRef.current
      ? Number(totalWeightRef.current.value)
      : 0;
    const result = plateCalc.calculate(totalWeight);
    setPlateCalculation(result);
    drawWeights(result.plates);
  };

  return (
    <Container mt="4">
      <Heading>Plate Calculator</Heading>
      <Flex mt="3">
        <TextField.Root
          type="number"
          ref={totalWeightRef}
          placeholder="Enter total lift weight"
        />
        <Button onClick={handleCalculatePlates}>Calculate Plates</Button>
      </Flex>

      {plateCalculation && (
        <div>
          <h2>Plate Calculation Result:</h2>
          <code>{JSON.stringify(plateCalculation.plates)}</code>
          <canvas id="canvas" width="700" height="300"></canvas>
        </div>
      )}
    </Container>
  );
};

export const Route = createFileRoute("/platecalc")({
  component: PlateCalcView,
});
