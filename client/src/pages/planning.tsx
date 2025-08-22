import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TrekPlan } from "@shared/schema";
import { CalendarDays, Dumbbell, Heart, Backpack, ShieldCheck } from "lucide-react";

export default function Planning() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const { data: plans, isLoading } = useQuery<TrekPlan[]>({
    queryKey: ["/api/plans"],
  });

  const toggleCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const timelineData = {
    "6months": [
      {
        period: "6M",
        title: "6 Months Before Trek",
        color: "bg-forest",
        items: [
          "Book trek and flights",
          "Start fitness training program",
          "Get travel insurance",
          "Visa arrangements",
          "Medical check-up",
          "Research gear requirements"
        ]
      },
      {
        period: "3M",
        title: "3 Months Before Trek",
        color: "bg-sage",
        items: [
          "Intensify training (long hikes)",
          "Purchase major gear items",
          "Break in hiking boots",
          "Altitude training if possible",
          "Learn basic local phrases",
          "Review trek itinerary"
        ]
      },
      {
        period: "1M",
        title: "1 Month Before Trek",
        color: "bg-warm-orange",
        items: [
          "Final gear check and testing",
          "Confirm bookings",
          "Pack and repack",
          "Weather monitoring",
          "Emergency contacts list",
          "Mental preparation"
        ]
      }
    ]
  };

  const fitnessPrograms = [
    {
      icon: Dumbbell,
      title: "Strength Training",
      frequency: "2-3 times per week",
      description: "Focus on legs, core, and shoulders",
      exercises: ["Squats & lunges", "Step-ups", "Planks", "Shoulder exercises"]
    },
    {
      icon: Heart,
      title: "Cardio Training",
      frequency: "4-5 times per week",
      description: "Build endurance for long days",
      exercises: ["Running/jogging", "Cycling", "Swimming", "Stair climbing"]
    },
    {
      icon: Backpack,
      title: "Hiking Practice",
      frequency: "Weekly",
      description: "Weekend hikes with full pack",
      exercises: ["Local trail hikes", "Gradually increase distance", "Practice with backpack", "Test gear"]
    }
  ];

  const gearCategories = [
    {
      icon: "👔",
      title: "Clothing",
      items: [
        "Base layers (wool/synthetic)",
        "Insulating layers",
        "Waterproof jacket",
        "Down jacket",
        "Hiking pants",
        "Warm hat and sun hat",
        "Gloves (liner and insulated)"
      ]
    },
    {
      icon: "👟",
      title: "Footwear",
      items: [
        "Hiking boots (broken in)",
        "Camp shoes",
        "Wool hiking socks",
        "Liner socks",
        "Gaiters"
      ]
    },
    {
      icon: "🎒",
      title: "Gear",
      items: [
        "Backpack (65-75L)",
        "Sleeping bag (-15°C)",
        "Trekking poles",
        "Headlamp + batteries",
        "Water bottles/hydration",
        "Sleeping pad",
        "Stuff sacks"
      ]
    },
    {
      icon: "🏥",
      title: "Safety/Health",
      items: [
        "First aid kit",
        "Altitude sickness meds",
        "Sunglasses",
        "Sunscreen (SPF 50+)",
        "Water purification",
        "Personal medications",
        "Emergency whistle"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-warm-beige" data-testid="planning-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-forest mb-4" data-testid="text-planning-title">
            Plan Your Trek
          </h1>
          <p className="text-lg text-slate-gray" data-testid="text-planning-description">
            Comprehensive preparation and timeline for your adventure
          </p>
        </div>

        {/* My Trek Plans */}
        {plans && plans.length > 0 && (
          <Card className="mb-8" data-testid="card-my-plans">
            <CardHeader>
              <CardTitle className="text-forest">My Trek Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 bg-warm-beige rounded-lg">
                    <div>
                      <h3 className="font-semibold text-forest">Trek Plan #{plan.id.slice(0, 8)}</h3>
                      <p className="text-slate-gray text-sm">Created: {new Date(plan.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={plan.isCompleted ? "default" : "secondary"}>
                      {plan.isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="timeline" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timeline" data-testid="tab-timeline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="fitness" data-testid="tab-fitness">
              <Dumbbell className="h-4 w-4 mr-2" />
              Fitness
            </TabsTrigger>
            <TabsTrigger value="gear" data-testid="tab-gear">
              <Backpack className="h-4 w-4 mr-2" />
              Gear
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-forest">Preparation Timeline</CardTitle>
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-1 rounded-lg flex">
                    <Button
                      variant={selectedTimeframe === "6months" ? "default" : "ghost"}
                      className={selectedTimeframe === "6months" ? "bg-forest text-white" : ""}
                      onClick={() => setSelectedTimeframe("6months")}
                      data-testid="button-6months"
                    >
                      6 Months
                    </Button>
                    <Button
                      variant={selectedTimeframe === "3months" ? "default" : "ghost"}
                      onClick={() => setSelectedTimeframe("3months")}
                      data-testid="button-3months"
                    >
                      3 Months
                    </Button>
                    <Button
                      variant={selectedTimeframe === "1month" ? "default" : "ghost"}
                      onClick={() => setSelectedTimeframe("1month")}
                      data-testid="button-1month"
                    >
                      1 Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {timelineData["6months"].map((phase, index) => (
                    <div key={index} className="flex">
                      <div className={`flex-shrink-0 w-16 h-16 ${phase.color} text-white rounded-full flex items-center justify-center font-bold text-lg mr-6`}>
                        {phase.period}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-forest mb-3">{phase.title}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          {phase.items.map((item, itemIndex) => {
                            const itemId = `${phase.period}-${itemIndex}`;
                            return (
                              <div key={itemIndex} className="flex items-center space-x-3">
                                <Checkbox
                                  id={itemId}
                                  checked={checkedItems[itemId] || false}
                                  onCheckedChange={() => toggleCheck(itemId)}
                                  data-testid={`checkbox-${itemId}`}
                                />
                                <label htmlFor={itemId} className="text-slate-gray text-sm cursor-pointer">
                                  {item}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fitness">
            <Card>
              <CardHeader>
                <CardTitle className="text-forest">Fitness Training Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {fitnessPrograms.map((program, index) => (
                    <Card key={index} className="text-center bg-warm-beige">
                      <CardContent className="p-6">
                        <program.icon className="h-12 w-12 text-forest mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-forest mb-2">{program.title}</h4>
                        <p className="text-slate-gray text-sm mb-2">{program.frequency}</p>
                        <p className="text-slate-gray text-sm mb-4">{program.description}</p>
                        <ul className="text-slate-gray text-sm space-y-1">
                          {program.exercises.map((exercise, exerciseIndex) => (
                            <li key={exerciseIndex}>• {exercise}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gear">
            <Card>
              <CardHeader>
                <CardTitle className="text-forest">Essential Gear Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {gearCategories.map((category, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-forest mb-3 flex items-center">
                        <span className="text-2xl mr-2">{category.icon}</span>
                        {category.title}
                      </h4>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => {
                          const itemId = `gear-${index}-${itemIndex}`;
                          return (
                            <div key={itemIndex} className="flex items-center space-x-2">
                              <Checkbox
                                id={itemId}
                                checked={checkedItems[itemId] || false}
                                onCheckedChange={() => toggleCheck(itemId)}
                                data-testid={`checkbox-gear-${itemId}`}
                              />
                              <label htmlFor={itemId} className="text-sm text-slate-gray cursor-pointer">
                                {item}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
