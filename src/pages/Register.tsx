import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterAiHelp from "@/components/RegisterAiHelp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createRegistration } from "@/lib/api";

const departments = ["AIML", "CS", "CT", "IT", "BCA", "DCFS", "CSDA"];

const registrationSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters").max(50, "Team name must be less than 50 characters"),
  leaderName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  collegeName: z.string().min(2, "College name is required").max(200, "College name must be less than 200 characters"),
  leaderDepartment: z.string().min(1, "Please select a department"),
  member2Name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  member2Email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  member2Department: z.string().min(1, "Please select a department"),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const Register = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Create registration object
      const registration = {
        team_name: data.teamName,
        leader_name: data.leaderName,
        email: data.email,
        mobile: data.mobile,
        college: data.collegeName,
        leader_dept: data.leaderDepartment,
        member2_name: data.member2Name,
        member2_email: data.member2Email,
        member2_dept: data.member2Department,
      };

      await createRegistration(registration);

      toast({
        title: "Registration Successful!",
        description: "Your team has been registered for the hackathon.",
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error:", error);
      const message = error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="glass-card p-8">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">Registration Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your team has been successfully registered for Department Hackathon 2026. 
                You will receive a confirmation email shortly.
              </p>
              <Button variant="hero" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Team Registration</span>
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Register Your <span className="gradient-text">Team</span>
            </h1>
            <p className="text-muted-foreground">
              Team size is fixed to 2 members. Fill in the details below to participate.
            </p>
          </div>

          {/* Registration Form */}
          <div className="glass-card p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Team Information */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-lg border-b border-border pb-2">
                  Team Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    placeholder="Enter your team name"
                    className="bg-muted/50 border-border text-base"
                    autoComplete="organization"
                    {...register("teamName")}
                  />
                  {errors.teamName && (
                    <p className="text-sm text-destructive">{errors.teamName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    placeholder="Enter your college name"
                    className="bg-muted/50 border-border text-base"
                    autoComplete="organization"
                    {...register("collegeName")}
                  />
                  {errors.collegeName && (
                    <p className="text-sm text-destructive">{errors.collegeName.message}</p>
                  )}
                </div>
              </div>

              {/* Team Leader */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-lg border-b border-border pb-2">
                  Team Leader (Member 1)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaderName">Full Name</Label>
                    <Input
                      id="leaderName"
                      placeholder="Team leader's name"
                      className="bg-muted/50 border-border text-base"
                      autoComplete="name"
                      {...register("leaderName")}
                    />
                    {errors.leaderName && (
                      <p className="text-sm text-destructive">{errors.leaderName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leaderDepartment">Department</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("leaderDepartment", value, { shouldValidate: true, shouldDirty: true })
                        }
                      >
                      <SelectTrigger className="bg-muted/50 border-border text-base">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.leaderDepartment && (
                      <p className="text-sm text-destructive">{errors.leaderDepartment.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email ID</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="bg-muted/50 border-border text-base"
                      autoComplete="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className="bg-muted/50 border-border text-base"
                      inputMode="numeric"
                      autoComplete="tel"
                      {...register("mobile")}
                    />
                    {errors.mobile && (
                      <p className="text-sm text-destructive">{errors.mobile.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-lg border-b border-border pb-2">
                  Team Member 2
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member2Name">Full Name</Label>
                    <Input
                      id="member2Name"
                      placeholder="Member's name"
                      className="bg-muted/50 border-border text-base"
                      autoComplete="name"
                      {...register("member2Name")}
                    />
                    {errors.member2Name && (
                      <p className="text-sm text-destructive">{errors.member2Name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="member2Department">Department</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("member2Department", value, { shouldValidate: true, shouldDirty: true })
                      }
                    >
                      <SelectTrigger className="bg-muted/50 border-border text-base">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.member2Department && (
                      <p className="text-sm text-destructive">{errors.member2Department.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="member2Email">Email ID</Label>
                    <Input
                      id="member2Email"
                      type="email"
                      placeholder="member@example.com"
                      className="bg-muted/50 border-border text-base"
                      autoComplete="email"
                      {...register("member2Email")}
                    />
                    {errors.member2Email && (
                      <p className="text-sm text-destructive">{errors.member2Email.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register Team"}
              </Button>
            </form>
          </div>

          <div className="mt-8">
            <RegisterAiHelp />
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
