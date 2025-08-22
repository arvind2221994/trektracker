import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertUserProfileSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const formSchema = insertUserProfileSchema.extend({
  preferredDurations: z.array(z.string()).min(1, "Select at least one duration preference"),
  climatePreferences: z.array(z.string()).min(1, "Select at least one climate preference"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ProfileSetup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ageRange: "",
      fitnessLevel: "",
      trekExperience: "",
      preferredDurations: [],
      climatePreferences: [],
      travelRadius: "",
      location: "",
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
      toast({
        title: "Profile Created!",
        description: "Your trek recommendations are now ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await createProfileMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white" id="profile-setup" data-testid="profile-setup">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-forest mb-4" data-testid="text-profile-title">
            Tell Us About Yourself
          </h2>
          <p className="text-lg text-slate-gray" data-testid="text-profile-description">
            We'll use this information to recommend the perfect treks for you
          </p>
        </div>
        
        <Card className="bg-warm-beige">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-profile">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-forest mb-4">Personal Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="ageRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Range</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-age-range">
                                <SelectValue placeholder="Select age range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="18-25">18-25</SelectItem>
                              <SelectItem value="26-35">26-35</SelectItem>
                              <SelectItem value="36-50">36-50</SelectItem>
                              <SelectItem value="51-65">51-65</SelectItem>
                              <SelectItem value="65+">65+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fitnessLevel"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Fitness Level</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                              data-testid="radio-fitness-level"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Beginner" id="fitness-beginner" />
                                <Label htmlFor="fitness-beginner">Beginner - I exercise occasionally</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Intermediate" id="fitness-intermediate" />
                                <Label htmlFor="fitness-intermediate">Intermediate - I exercise regularly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Advanced" id="fitness-advanced" />
                                <Label htmlFor="fitness-advanced">Advanced - I'm very fit and active</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="trekExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trekking Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-trek-experience">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="First time trekker">First time trekker</SelectItem>
                              <SelectItem value="1-3 treks completed">1-3 treks completed</SelectItem>
                              <SelectItem value="4-10 treks completed">4-10 treks completed</SelectItem>
                              <SelectItem value="Experienced (10+ treks)">Experienced (10+ treks)</SelectItem>
                              <SelectItem value="Expert level">Expert level</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Preferences */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-forest mb-4">Preferences</h3>
                    
                    <FormField
                      control={form.control}
                      name="preferredDurations"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Preferred Trek Duration</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-2" data-testid="checkbox-duration">
                            {[
                              { id: "day-hikes", label: "Day hikes" },
                              { id: "weekend", label: "2-3 days" },
                              { id: "week", label: "4-7 days" },
                              { id: "long", label: "1+ weeks" },
                            ].map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="preferredDurations"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== item.id)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="climatePreferences"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Climate Preferences</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-2" data-testid="checkbox-climate">
                            {[
                              { id: "temperate", label: "Temperate" },
                              { id: "tropical", label: "Tropical" },
                              { id: "alpine", label: "Alpine" },
                              { id: "desert", label: "Desert" },
                            ].map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="climatePreferences"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== item.id)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="travelRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Travel Distance</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-travel-radius">
                                <SelectValue placeholder="Select travel radius" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Within 100 miles">Within 100 miles</SelectItem>
                              <SelectItem value="Within 500 miles">Within 500 miles</SelectItem>
                              <SelectItem value="Within my country">Within my country</SelectItem>
                              <SelectItem value="International OK">International OK</SelectItem>
                              <SelectItem value="Anywhere in the world">Anywhere in the world</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-forest text-white hover:bg-forest/90 px-8 py-3 text-lg"
                    disabled={isSubmitting}
                    data-testid="button-submit-profile"
                  >
                    {isSubmitting ? "Saving..." : "Get My Recommendations"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
