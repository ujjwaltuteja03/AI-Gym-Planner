import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import React, { useState } from "react";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
import type { UserProfile } from "../types";
import { useNavigate } from "react-router-dom";

const goalOptions = [
  { value: "bulk", label: "Build Mass" },
  { value: "cut", label: "Cut Fat" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "recomp", label: "Body Recomposition" },
  { value: "strength", label: "Build Strength" },
  { value: "endurance", label: "Improve Endurance" },
];

const experienceOptions = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" },
];

const daysOptions = [
  { value: "2", label: "2 days per week" },
  { value: "3", label: "3 days per week" },
  { value: "4", label: "4 days per week" },
  { value: "5", label: "5 days per week" },
  { value: "6", label: "6 days per week" },
];

const sessionOptions = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "60 minutes" },
  { value: "90", label: "90 minutes" },
];

const equipmentOptions = [
  { value: "full_gym", label: "Full Gym Access" },
  { value: "home", label: "Home Gym" },
  { value: "dumbbells", label: "Dumbbells Only" },
];

const splitOptions = [
  { value: "full_body", label: "Full Body" },
  { value: "upper_lower", label: "Upper/Lower Split" },
  { value: "ppl", label: "Push/Pull/Legs" },
  { value: "custom", label: "Let AI Decide" },
];

export default function Onboarding() {
  const { user, saveProfile, generatePlan } = useAuth();
  const [formData, setFormData] = useState({
    goal: "bulk",
    experience: "intermediate",
    daysPerWeek: "4",
    sessionLength: "60",
    equipment: "full_gym",
    injuries: "",
    preferredSplit: "upper_lower",
  });
  const [isGenerating, setisGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function updateForm(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleQuestionnaire(e: React.SubmitEvent) {
    e.preventDefault();

    const profile: Omit<UserProfile, "userId" | "updatedAt"> = {
      goal: formData.goal as UserProfile["goal"],
      experience: formData.experience as UserProfile["experience"],
      daysPerWeek: parseInt(formData.daysPerWeek),
      sessionLength: parseInt(formData.sessionLength),
      equipment: formData.equipment as UserProfile["equipment"],
      injuries: formData.injuries || undefined,
      preferredSplit: formData.preferredSplit as UserProfile["preferredSplit"],
    };
    try {
      await saveProfile(profile);
      setisGenerating(true);
      await generatePlan();
      navigate("/profile");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setisGenerating(false);
    }
  }
  if (!user) {
    return <RedirectToSignIn />;
  }
  return (
    <SignedIn>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          {/* PROGRESS INDICATOR */}

          {/* QUESTIONNAIRE */}

          {!isGenerating ? (
            <Card variant="bordered">
              <h1 className="text-2xl font-bold mb-2">
                Tell Us About Yourself
              </h1>
              <p className="text-[var(--color-muted)] mb-6">
                Help us create the perfect plan for you.
              </p>
              <form onSubmit={handleQuestionnaire} className="space-y-5">
                <Select
                  id="goal"
                  label="What are your gym goals?"
                  options={goalOptions}
                  value={formData.goal}
                  onChange={(e) => updateForm("goal", e.target.value)}
                />
                <Select
                  id="experience"
                  label="What is your experience level?"
                  options={experienceOptions}
                  value={formData.experience}
                  onChange={(e) => updateForm("experience", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    id="daysPerWeek"
                    label="How many days per week would you like to train?"
                    options={daysOptions}
                    value={formData.daysPerWeek}
                    onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                  />
                  <Select
                    id="sessionLength"
                    label="How long would you like each training session to be?"
                    options={sessionOptions}
                    value={formData.sessionLength}
                    onChange={(e) =>
                      updateForm("sessionLength", e.target.value)
                    }
                  />
                </div>
                <Select
                  id="equipment"
                  label="What equipment do you have access to?"
                  options={equipmentOptions}
                  value={formData.equipment}
                  onChange={(e) => updateForm("equipment", e.target.value)}
                />
                <Select
                  id="preferredSplit"
                  label="What training split do you prefer?"
                  options={splitOptions}
                  value={formData.preferredSplit}
                  onChange={(e) => updateForm("preferredSplit", e.target.value)}
                />
                <Textarea
                  id="injuries"
                  label="Do you have any injuries or limitations? (optional)"
                  placeholder="Shoulder impingement, lower back issues, wrist strain...."
                  rows={3}
                  value={formData.injuries}
                  onChange={(e) => updateForm("injuries", e.target.value)}
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 gap-2">
                    Generate My Plan <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card variant="bordered" className="text-center py-16">
              <Loader2 className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Creating your plan</h1>
              <p className="text-[var(--color-muted)]">
                {" "}
                Building a personalized training plan that suits all your needs
              </p>
            </Card>
          )}
        </div>
      </div>
    </SignedIn>
  );
}
