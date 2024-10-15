create table "public"."current_workout" (
    "updated" timestamp with time zone not null default now(),
    "user" uuid not null default auth.uid(),
    "day" smallint
);


alter table "public"."current_workout" enable row level security;

create table "public"."exercises" (
    "id" bigint generated by default as identity not null,
    "name" character varying not null
);


alter table "public"."exercises" enable row level security;

create table "public"."gzclp_exercise_prog" (
    "id" bigint generated by default as identity not null,
    "exercise" smallint not null,
    "tier" smallint not null,
    "user" uuid not null default auth.uid(),
    "day" smallint not null,
    "sets" smallint not null,
    "reps" smallint not null,
    "weight" real not null
);


alter table "public"."gzclp_exercise_prog" enable row level security;

create table "public"."workout_log" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "exercise" bigint not null,
    "user" uuid not null default auth.uid(),
    "sets" bigint not null,
    "weight" double precision[] not null,
    "reps" integer[] not null,
    "program" character varying not null
);


alter table "public"."workout_log" enable row level security;

CREATE UNIQUE INDEX current_workout_pkey ON public.current_workout USING btree ("user");

CREATE UNIQUE INDEX exercises_pkey ON public.exercises USING btree (id);

CREATE UNIQUE INDEX "gzclp-exercise-prog_pkey" ON public.gzclp_exercise_prog USING btree (id);

CREATE UNIQUE INDEX workouts_id_key ON public.workout_log USING btree (id);

CREATE UNIQUE INDEX workouts_pkey ON public.workout_log USING btree (id);

alter table "public"."current_workout" add constraint "current_workout_pkey" PRIMARY KEY using index "current_workout_pkey";

alter table "public"."exercises" add constraint "exercises_pkey" PRIMARY KEY using index "exercises_pkey";

alter table "public"."gzclp_exercise_prog" add constraint "gzclp-exercise-prog_pkey" PRIMARY KEY using index "gzclp-exercise-prog_pkey";

alter table "public"."workout_log" add constraint "workouts_pkey" PRIMARY KEY using index "workouts_pkey";

alter table "public"."gzclp_exercise_prog" add constraint "gzclp-exercise-prog_exercise_fkey" FOREIGN KEY (exercise) REFERENCES exercises(id) not valid;

alter table "public"."gzclp_exercise_prog" validate constraint "gzclp-exercise-prog_exercise_fkey";

alter table "public"."gzclp_exercise_prog" add constraint "gzclp-exercise-prog_exercise_fkey1" FOREIGN KEY (exercise) REFERENCES exercises(id) not valid;

alter table "public"."gzclp_exercise_prog" validate constraint "gzclp-exercise-prog_exercise_fkey1";

alter table "public"."workout_log" add constraint "workouts_id_key" UNIQUE using index "workouts_id_key";

grant delete on table "public"."current_workout" to "anon";

grant insert on table "public"."current_workout" to "anon";

grant references on table "public"."current_workout" to "anon";

grant select on table "public"."current_workout" to "anon";

grant trigger on table "public"."current_workout" to "anon";

grant truncate on table "public"."current_workout" to "anon";

grant update on table "public"."current_workout" to "anon";

grant delete on table "public"."current_workout" to "authenticated";

grant insert on table "public"."current_workout" to "authenticated";

grant references on table "public"."current_workout" to "authenticated";

grant select on table "public"."current_workout" to "authenticated";

grant trigger on table "public"."current_workout" to "authenticated";

grant truncate on table "public"."current_workout" to "authenticated";

grant update on table "public"."current_workout" to "authenticated";

grant delete on table "public"."current_workout" to "service_role";

grant insert on table "public"."current_workout" to "service_role";

grant references on table "public"."current_workout" to "service_role";

grant select on table "public"."current_workout" to "service_role";

grant trigger on table "public"."current_workout" to "service_role";

grant truncate on table "public"."current_workout" to "service_role";

grant update on table "public"."current_workout" to "service_role";

grant delete on table "public"."exercises" to "anon";

grant insert on table "public"."exercises" to "anon";

grant references on table "public"."exercises" to "anon";

grant select on table "public"."exercises" to "anon";

grant trigger on table "public"."exercises" to "anon";

grant truncate on table "public"."exercises" to "anon";

grant update on table "public"."exercises" to "anon";

grant delete on table "public"."exercises" to "authenticated";

grant insert on table "public"."exercises" to "authenticated";

grant references on table "public"."exercises" to "authenticated";

grant select on table "public"."exercises" to "authenticated";

grant trigger on table "public"."exercises" to "authenticated";

grant truncate on table "public"."exercises" to "authenticated";

grant update on table "public"."exercises" to "authenticated";

grant delete on table "public"."exercises" to "service_role";

grant insert on table "public"."exercises" to "service_role";

grant references on table "public"."exercises" to "service_role";

grant select on table "public"."exercises" to "service_role";

grant trigger on table "public"."exercises" to "service_role";

grant truncate on table "public"."exercises" to "service_role";

grant update on table "public"."exercises" to "service_role";

grant delete on table "public"."gzclp_exercise_prog" to "anon";

grant insert on table "public"."gzclp_exercise_prog" to "anon";

grant references on table "public"."gzclp_exercise_prog" to "anon";

grant select on table "public"."gzclp_exercise_prog" to "anon";

grant trigger on table "public"."gzclp_exercise_prog" to "anon";

grant truncate on table "public"."gzclp_exercise_prog" to "anon";

grant update on table "public"."gzclp_exercise_prog" to "anon";

grant delete on table "public"."gzclp_exercise_prog" to "authenticated";

grant insert on table "public"."gzclp_exercise_prog" to "authenticated";

grant references on table "public"."gzclp_exercise_prog" to "authenticated";

grant select on table "public"."gzclp_exercise_prog" to "authenticated";

grant trigger on table "public"."gzclp_exercise_prog" to "authenticated";

grant truncate on table "public"."gzclp_exercise_prog" to "authenticated";

grant update on table "public"."gzclp_exercise_prog" to "authenticated";

grant delete on table "public"."gzclp_exercise_prog" to "service_role";

grant insert on table "public"."gzclp_exercise_prog" to "service_role";

grant references on table "public"."gzclp_exercise_prog" to "service_role";

grant select on table "public"."gzclp_exercise_prog" to "service_role";

grant trigger on table "public"."gzclp_exercise_prog" to "service_role";

grant truncate on table "public"."gzclp_exercise_prog" to "service_role";

grant update on table "public"."gzclp_exercise_prog" to "service_role";

grant delete on table "public"."workout_log" to "anon";

grant insert on table "public"."workout_log" to "anon";

grant references on table "public"."workout_log" to "anon";

grant select on table "public"."workout_log" to "anon";

grant trigger on table "public"."workout_log" to "anon";

grant truncate on table "public"."workout_log" to "anon";

grant update on table "public"."workout_log" to "anon";

grant delete on table "public"."workout_log" to "authenticated";

grant insert on table "public"."workout_log" to "authenticated";

grant references on table "public"."workout_log" to "authenticated";

grant select on table "public"."workout_log" to "authenticated";

grant trigger on table "public"."workout_log" to "authenticated";

grant truncate on table "public"."workout_log" to "authenticated";

grant update on table "public"."workout_log" to "authenticated";

grant delete on table "public"."workout_log" to "service_role";

grant insert on table "public"."workout_log" to "service_role";

grant references on table "public"."workout_log" to "service_role";

grant select on table "public"."workout_log" to "service_role";

grant trigger on table "public"."workout_log" to "service_role";

grant truncate on table "public"."workout_log" to "service_role";

grant update on table "public"."workout_log" to "service_role";

create policy "Enable update for users based on email"
on "public"."current_workout"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = "user"))
with check ((( SELECT auth.uid() AS uid) = "user"));


create policy "Enable users to view their own data only"
on "public"."current_workout"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = "user"));


create policy "Enable read access for all users"
on "public"."exercises"
as permissive
for select
to public
using (true);


create policy "Enable users to view their own data only"
on "public"."gzclp_exercise_prog"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = "user"));


create policy "Enable insert for users based on user_id"
on "public"."workout_log"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = "user"));



