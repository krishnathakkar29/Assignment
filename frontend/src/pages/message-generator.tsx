import type React from "react";

import { useState } from "react";
import { Loader2, Copy, Check, RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { API_URL } from "../config/config";

interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
  email: string;
}

export function MessageGenerator() {
  const [profile, setProfile] = useState<LinkedInProfile>({
    name: "",
    job_title: "",
    company: "",
    location: "",
    summary: "",
    email: "",
  });

  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateMessage = async () => {

    if (
      !profile.name ||
      !profile.job_title ||
      !profile.company ||
      !profile.email
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          job_title: profile.job_title,
          company: profile.company,
          location: profile.location || "",
          summary: profile.summary || "",
          email: profile.email,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setGeneratedMessage(data.message);
        toast.success("Message generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate message");
        // Fallback to client-side generation if server fails
        generateFallbackMessage();
      }
    } catch (error) {
      console.error("Error generating message:", error);
      toast.error(
        "Failed to connect to the server. Using fallback generation."
      );
     
      generateFallbackMessage();
    } finally {
      setIsGenerating(false);
    }
  };

  
  const generateFallbackMessage = () => {
    const message = `Hi ${profile.name},

I noticed your impressive background as a ${profile.job_title} at ${
      profile.company
    }. Your experience in ${profile.summary
      .split(" ")
      .slice(0, 5)
      .join(" ")}... caught my attention.

Our campaign management system helps professionals like you streamline outreach and generate personalized messages with AI. I'd love to show you how it could help with your specific needs.

Would you be open to a quick 15-minute call this week to discuss how we might be able to support your work? You can reach me at ${
      profile.email
    }.

Looking forward to connecting!`;

    setGeneratedMessage(message);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setIsCopied(true);

    toast.success("Message copied to clipboard!");
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          LinkedIn Message Generator
        </h2>
        <p className="text-muted-foreground">
          Generate personalized outreach messages for LinkedIn profiles
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Profile</CardTitle>
            <CardDescription>
              Enter the LinkedIn profile details to generate a personalized
              message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    value={profile.job_title}
                    onChange={handleInputChange}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={profile.company}
                    onChange={handleInputChange}
                    placeholder="TechCorp"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary">Profile Summary</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={profile.summary}
                    onChange={handleInputChange}
                    placeholder="Experienced in AI & ML..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={generateMessage} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>Generate Message</>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Message</CardTitle>
            <CardDescription>
              Your personalized LinkedIn outreach message
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Generating your personalized message...
                </p>
              </div>
            ) : generatedMessage ? (
              <div className="relative">
                <Textarea
                  value={generatedMessage}
                  onChange={(e) => setGeneratedMessage(e.target.value)}
                  className="min-h-[300px] resize-none font-medium"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    No message generated yet
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Fill in the LinkedIn profile details and click "Generate
                    Message" to create a personalized outreach message.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          {generatedMessage && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={generateMessage}
                disabled={isGenerating}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
              <Button onClick={copyToClipboard} disabled={isGenerating}>
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
