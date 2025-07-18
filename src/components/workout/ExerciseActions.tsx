import {
  Button,
  Dialog,
  Flex,
} from "@radix-ui/themes";
import { useState } from "react";
import { useAuth } from "../../contexts/auth";
import { changeWeight } from "../../services/supabase";

// Define an interface for the workout data
interface WorkoutData {
  id: number;
  name: string;
  completed: boolean;
  exercise: number;
  sets: number;
  weight: number;
  reps: number;
}

interface ExerciseActionsProps {
  exercise: WorkoutData;
  day: number;
  onWeightUpdate: (exerciseId: number, newWeight: number) => void;
}

export function ExerciseActions({ exercise, day, onWeightUpdate }: ExerciseActionsProps) {
  const auth = useAuth();
  const [open, setOpen] = useState(false);
  const [changeWeightOpen, setChangeWeightOpen] = useState(false);
  const [newWeight, setNewWeight] = useState(exercise.weight.toString());

  const handleIncrement = async () => {
    if (!auth?.user?.id) return;
    const newWeight = await changeWeight(auth.user.id, exercise.exercise, day);
    if (newWeight !== null) {
      onWeightUpdate(exercise.exercise, newWeight);
      setOpen(false);
    }
  };

  const handleChangeWeight = async () => {
    if (!auth?.user?.id) return;
    const weight = parseFloat(newWeight);
    if (isNaN(weight)) return;
    
    const success = await changeWeight(auth.user.id, exercise.exercise, day, weight);
    if (success !== null) {
      onWeightUpdate(exercise.exercise, success);
      setChangeWeightOpen(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button variant="ghost">...</Button>
        </Dialog.Trigger>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Exercise Options</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            <Button variant="soft" onClick={handleIncrement}>
              Increment Weight
            </Button>
            <Button variant="soft" onClick={() => setChangeWeightOpen(true)}>
              Change Weight
            </Button>
            <Button variant="soft" onClick={() => {}}>
              Progress Exercise
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={changeWeightOpen} onOpenChange={setChangeWeightOpen}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Change Weight</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            <input
              type="number"
              value={newWeight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewWeight(e.target.value)}
              placeholder="Enter new weight"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
            <Flex gap="3" justify="end" mt="4">
              <Button variant="soft" onClick={() => setChangeWeightOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangeWeight}>
                Save
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
} 