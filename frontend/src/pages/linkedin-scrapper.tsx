import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

import { AnimatedInput } from "@/components/custom/animated-input";
import { DataTable } from "@/components/custom/data-table";
import { GlowingText } from "@/components/ui/glowing-text";
import { API_URL } from "@/config/config";
import { LinkedInProfile } from "@/lib/types";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campaign name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  status: z.enum(["ACTIVE", "INACTIVE", "DELETED"]),
  leads: z.array(z.string().url({ message: "Invalid LinkedIn URL" })),
});

type FormValues = z.infer<typeof formSchema>;

export default function LinkedInScraper() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<LinkedInProfile[]>(
    []
  );
  const [openDialog, setOpenDialog] = useState(false);

  // Setup form with explicit typing
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
      leads: [],
    },
  });

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Please enter a search keyword");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/scrape/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: searchKeyword }),
      });

      const result = await response.json();
      console.log("Scraped profiles:", result);
      if (!result.success) {
        throw new Error(result.error);
      }

      setProfiles(result.data);
      setSelectedProfiles([]);
      toast.success(`Found ${result.data.length} profiles`);
    } catch (error) {
      console.error("Error scraping profiles:", error);
      toast.error("Failed to scrape profiles");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProfileSelection = (profile: LinkedInProfile) => {
    setSelectedProfiles((prev) => {
      const isSelected = prev.some((p) => p.profileURL === profile.profileURL);
      if (isSelected) {
        return prev.filter((p) => p.profileURL !== profile.profileURL);
      } else {
        return [...prev, profile];
      }
    });
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/campaign/campaigns`);
      const data = await response.json();
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to connect to the server");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const onCreateCampaign = async (values: FormValues) => {
    try {
      // In a real implementation, you would call your API to create the campaign
      console.log("Creating campaign with values:", values);

      const response = await fetch(`${API_URL}/api/v1/campaign/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Campaign created successfully!");
        setOpenDialog(false);
        fetchCampaigns();
        form.reset();
      } else {
        toast.error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    }
  };

  const openCreateCampaignDialog = () => {
    if (selectedProfiles.length === 0) {
      toast.error("Please select at least one profile to create a campaign");
      return;
    }

    form.setValue(
      "leads",
      selectedProfiles.map((profile) => profile.profileURL)
    );
    setOpenDialog(true);
  };

  const columns = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getFilteredSelectedRowModel().rows.length > 0 &&
            table.getFilteredSelectedRowModel().rows.length ===
              table.getFilteredRowModel().rows.length
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setSelectedProfiles(value ? profiles : []);
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            toggleProfileSelection(row.original);
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "headline",
      header: "Headline",
      cell: ({ row }: any) => (
        <div
          className="max-w-[300px] truncate"
          title={row.getValue("headline")}
        >
          {row.getValue("headline")}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }: any) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "profileURL",
      header: "Profile",
      cell: ({ row }: any) => (
        <a
          href={row.getValue("profileURL")}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View Profile
        </a>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="relative z-10 px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <GlowingText className="text-3xl font-bold mb-2">
            LinkedIn Profile Scraper
          </GlowingText>
          <p className="text-muted-foreground text-center max-w-2xl">
            Search for LinkedIn profiles by keyword, scrape their data, and
            create targeted campaigns with the selected profiles.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm border border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Search LinkedIn Profiles</CardTitle>
            <CardDescription>
              Enter a keyword to search for LinkedIn profiles of founders in
              lead generation agencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <AnimatedInput
                placeholder="e.g. lead generation agency"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {profiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Search Results
                </h2>
                <p className="text-muted-foreground">
                  Found {profiles.length} profiles. Selected:{" "}
                  {selectedProfiles.length}
                </p>
              </div>
              <Button
                onClick={openCreateCampaignDialog}
                disabled={selectedProfiles.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </div>

            <Card className="bg-card/80 backdrop-blur-sm border border-border/50">
              <CardContent className="p-6">
                <DataTable columns={columns} data={profiles} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Campaign Creation Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Create New Campaign
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a campaign with the selected LinkedIn profiles.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onCreateCampaign)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter campaign description"
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="leads"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selected Leads ({field.value.length})
                      </FormLabel>
                      <div className="bg-muted/30 p-3 rounded-md max-h-[150px] overflow-y-auto">
                        {field.value.map((url, index) => {
                          // Extract username from LinkedIn URL
                          const username =
                            url
                              .split("/in/")[1]
                              ?.split("?")[0]
                              ?.split("/")[0] || url;
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2 mb-2"
                            >
                              <Check className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm">
                                {username}
                                <span className="text-xs text-muted-foreground ml-2">
                                  (LinkedIn Profile)
                                </span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <FormDescription>
                        These LinkedIn profiles will be added to your campaign
                        as leads.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                    className="border-border/50 text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Create Campaign
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
