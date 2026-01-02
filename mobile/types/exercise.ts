// types/exercise.ts

export enum Muscle {
    chest = "chest",
    middle_back = "middle back",
    lats = "lats",
    biceps = "biceps",
    forearms = "forearms",
    shoulders = "shoulders",
    abdominals = "abdominals",
    hamstrings = "hamstrings",
    calves = "calves",
    adductors = "adductors",
    glutes = "glutes",
    quadriceps = "quadriceps",
    abductors = "abductors",
    triceps = "triceps",
    lower_back = "lower back",
    traps = "traps",
    neck = "neck",
}

export enum Force {
    pull = "pull",
    push = "push",
    static = "static",
}

export enum Level {
    beginner = "beginner",
    intermediate = "intermediate",
    expert = "expert",
}

export enum Mechanic {
    compound = "compound",
    isolation = "isolation",
}

export enum Equipment {
    body = "body only",
    machine = "machine",
    kettlebells = "kettlebells",
    dumbbell = "dumbbell",
    cable = "cable",
    barbell = "barbell",
    bands = "bands",
    medicine_ball = "medicine ball",
    exercise_ball = "exercise ball",
    e_z_curl_bar = "e-z curl bar",
    foam_roll = "foam roll",
}

export enum Category {
    strength = "strength",
    stretching = "stretching",
    plyometrics = "plyometrics",
    strongman = "strongman",
    powerlifting = "powerlifting",
    cardio = "cardio",
    olympic_weightlifting = "olympic weightlifting",

}


export interface Exercise {
    id: number;
    name: string;
    aliases?: string[];
    
   
    primary_muscles: Muscle[]; 
    secondary_muscles: Muscle[]; 
    
    force?: Force;
    level: Level;
    mechanic?: Mechanic;
    equipment?: Equipment;
    category: Category;
    instructions: string[];
    description?: string;
    tips?: string[];
    

    image_urls: string[]; 
}