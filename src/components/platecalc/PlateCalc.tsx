import { useState, useRef } from "react";
import plateCalc from "../../utils/plateCalc";
import { Button, Heading, TextField, Container, Flex } from "@radix-ui/themes";

// const drawWeights = (plates: number[]) => {
//   const canvas = document.getElementById("canvas");
//   console.log(plates);
//   if (canvas) {
//     const ctx = (canvas as HTMLCanvasElement).getContext("2d");
//     // Rounded rectangle with zero radius (specified as a number)
//     if (ctx) {
//       ctx.strokeStyle = "red";
//       ctx.beginPath();
//       ctx.roundRect(10, 20, 150, 100, 0);
//       ctx.stroke();

//       // Rounded rectangle with 40px radius (single element list)
//       ctx.strokeStyle = "blue";
//       ctx.beginPath();
//       ctx.roundRect(10, 20, 150, 100, [20, 40]);
//       ctx.stroke();
//     }
//   }
// };

export function PlateCalc() {
  const totalWeightRef = useRef<HTMLInputElement>(null);
  const [plateCalculation, setPlateCalculation] = useState<{
    plates: { plateWeight: number; qty: number }[];
    closestWeight?: number;
  } | null>(null);

  const handleCalculatePlates = () => {
    const totalWeight = totalWeightRef.current
      ? Number(totalWeightRef.current.value)
      : 0;
    const result = plateCalc.calculate(totalWeight);
    setPlateCalculation(result);
    // drawWeights(result.plates);
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
          <Heading size="4" mt="4" mb="2">Plate Calculation Result:</Heading>
          <code>{JSON.stringify(plateCalculation.plates)}</code>
          <canvas id="canvas" width="700" height="300"></canvas>
        </div>
      )}
    </Container>
  );
} 