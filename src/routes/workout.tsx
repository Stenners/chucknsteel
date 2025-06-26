import {
  Flex,
  Button,
  TextField,
  Heading,
  Box,
  Checkbox,
  Dialog,
  Card,
  Text,
} from "@radix-ui/themes";
import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";
import { getCurrentDay, getWorkout, saveWorkout, changeWeight } from "../services/supabase";

export const Route = createFileRoute("/workout")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Workout,
});

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

function ExerciseActions({ exercise, day, onWeightUpdate }: { 
  exercise: WorkoutData; 
  day: number; 
  onWeightUpdate: (exerciseId: number, newWeight: number) => void 
}) {
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

function WorkoutList({ currentDay }: { currentDay: number }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [allWorkouts, setAllWorkouts] = useState<{ [key: number]: WorkoutData[] }>({});

  useEffect(() => {
    const fetchAllWorkouts = async () => {
      if (auth.user) {
        const workouts: { [key: number]: WorkoutData[] } = {};
        for (let day = 1; day <= 4; day++) {
          const workoutData = await getWorkout(auth.user.id, day);
          workouts[day] = workoutData as unknown as WorkoutData[];
        }
        setAllWorkouts(workouts);
      }
    };

    fetchAllWorkouts();
  }, [auth.user]);

  const handleWorkoutSelect = (day: number) => {
    navigate({ to: "/workout", search: { day } });
  };

  return (
    <Flex direction="column" gap="4">
      <Heading size="4">All Workouts</Heading>
      {[1, 2, 3, 4].map((day) => (
        <Card 
          key={day} 
          style={{ 
            border: day === currentDay ? '2px solid #007bff' : '1px solid #ddd',
            backgroundColor: day === currentDay ? '#f8f9fa' : 'white'
          }}
        >
          <Flex justify="between" align="center" p="3">
            <Box>
              <Heading size="3">Day {day}</Heading>
              <Text size="2" color="gray">
                {allWorkouts[day]?.length || 0} exercises
              </Text>
            </Box>
            <Button 
              variant={day === currentDay ? "solid" : "soft"}
              onClick={() => handleWorkoutSelect(day)}
            >
              {day === currentDay ? "Current" : "View"}
            </Button>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

function WorkoutDetail({ day }: { day: number }) {
  const auth = useAuth();
  const [workout, setWorkout] = useState<WorkoutData[]>([]);
  const navigate = useNavigate();

  const handleWeightUpdate = (exerciseId: number, newWeight: number) => {
    setWorkout(prevWorkout => 
      prevWorkout.map(exercise => 
        exercise.exercise === exerciseId 
          ? { ...exercise, weight: newWeight }
          : exercise
      )
    );
  };

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    interface ExerciseRecord {
      exercise: number;
      weight: number[];
      reps: number[];
      sets: number;
      completed?: boolean;
    }

    const reformattedData = Object.entries(data).reduce(
      (acc: { [key: string]: ExerciseRecord }, [key, value]) => {
        const [id, field] = key.split("-");
        if (!acc[id]) {
          acc[id] = {
            exercise: parseInt(id),
            weight: [],
            reps: [],
            sets:
              workout.find((item) => item.exercise === parseInt(id))?.sets || 0,
            completed: false,
          };
        }
        if (field === "weight" || field === "reps") {
          acc[id][field].push(parseFloat(value as string));
        }
        if (field === "completed") {
          acc[id][field] = value === "on";
        }
        return acc;
      },
      {}
    );

    const filteredWorkout = Object.values(reformattedData).filter(
      (workout) => workout.completed
    );
    filteredWorkout.forEach((workout) => {
      delete workout.completed;
    });

    if (auth.user) {
      const id = auth.user.id;
      const saved = await saveWorkout(id, filteredWorkout, day);
      if (saved) {
        navigate({ to: "/" });
      }
    } else {
      console.error("User ID not set");
    }
  };

  useEffect(() => {
    const fetchWorkout = async () => {
      if (auth.user) {
        const { id } = auth.user;
        const workoutData = await getWorkout(id, day);
        setWorkout(workoutData as unknown as WorkoutData[]);
      }
    };

    fetchWorkout();
  }, [auth.user, day]);

  return (
    <Flex direction="column" gap="3">
      <Flex justify="between" align="center">
        <Heading size="4">Day {day} Workout</Heading>
        <Button variant="soft" onClick={() => navigate({ to: "/workout" })}>
          ← Back to All Workouts
        </Button>
      </Flex>
      
      <form onSubmit={handleComplete}>
        {workout.map((exercise) => (
          <Box key={exercise.exercise} mb="5">
            <Flex justify="between">
              <Heading size="3" mb="2">
                {exercise.name
                  .toLowerCase()
                  .replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </Heading>
              <ExerciseActions 
                exercise={exercise} 
                day={day} 
                onWeightUpdate={handleWeightUpdate}
              />
            </Flex>
            <Flex mb="2">
              <Box width="30%">Set</Box>
              <Box width="30%">Weight</Box>
              <Box width="30%">Reps</Box>
            </Flex>
            {Array.from({ length: exercise.sets }, (_, index) => (
              <Flex key={`${exercise.exercise}-${index}`}>
                <Box width="30%">{index + 1}</Box>
                <Box width="30%">
                  <TextField.Root
                    name={`${exercise.exercise}-weight-${index}`}
                    value={exercise.weight}
                    onChange={(e) => {
                      const newWeight = parseFloat(e.target.value);
                      if (!isNaN(newWeight)) {
                        handleWeightUpdate(exercise.exercise, newWeight);
                      }
                    }}
                  />
                </Box>
                <Box width="30%">
                  <TextField.Root
                    name={`${exercise.exercise}-reps-${index}`}
                    defaultValue={exercise.reps}
                  />
                </Box>
                <Box width="10%">
                  <Flex
                    justify="center"
                    align="center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Checkbox
                      size="3"
                      name={`${exercise.exercise}-completed-${index}`}
                    />
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Box>
        ))}
        <Flex mb="5" justify="end">
          <Button type="submit">Complete</Button>
        </Flex>
      </form>
    </Flex>
  );
}

function Workout() {
  const auth = useAuth();
  const [currentDay, setCurrentDay] = useState<number>(0);
  const search = useSearch({ from: "/workout" }) as { day?: number };

  useEffect(() => {
    const fetchCurrentDay = async () => {
      if (auth.user) {
        const { id } = auth.user;
        const day = await getCurrentDay(id);
        setCurrentDay(day);
      }
    };

    fetchCurrentDay();
  }, [auth.user]);

  // If a specific day is selected, show the workout detail
  if (search.day) {
    return <WorkoutDetail day={search.day} />;
  }

  // Otherwise show the workout list
  return <WorkoutList currentDay={currentDay} />;
}
