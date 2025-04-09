import CampaignCards from "@/components/ui/campaign-cards";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/config/config";
import { Campaign } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CampaignsDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    leads: "",
    accountIDs: "",
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/v1/campaign/campaigns`);
      const data = await response.json();
      if (data.success) {
        setCampaigns(data.data);
      } else {
        toast.error(data.message || "Failed to fetch campaigns");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
      status: "ACTIVE",
      leads: "",
      accountIDs: "",
    });
  };

  const setEditFormData = (campaign: Campaign) => {
    setFormData({
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      leads: campaign.leads.join("\n"),
      accountIDs: campaign.accountIDs.join(","),
    });
    setCurrentCampaign(campaign);
    setOpenEditDialog(true);
  };

  const createCampaign = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/campaign/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          status: formData.status,
          leads: formData.leads
            .split("\n")
            .filter((lead) => lead.trim() !== ""),
          accountIDs: formData.accountIDs
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id !== ""),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Campaign created successfully");
        fetchCampaigns();
        setOpenCreateDialog(false);
        resetFormData();
      } else {
        toast.error(data.message || "Failed to create campaign");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    }
  };

  const updateCampaign = async () => {
    if (!currentCampaign) return;

    try {
      const response = await fetch(
        `${API_URL}/api/v1/campaign/campaigns/${currentCampaign._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            status: formData.status,
            leads: formData.leads
              .split("\n")
              .filter((lead) => lead.trim() !== ""),
            accountIDs: formData.accountIDs
              .split(",")
              .map((id) => id.trim())
              .filter((id) => id !== ""),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Campaign updated successfully");
        fetchCampaigns();
        setOpenEditDialog(false);
        resetFormData();
        setCurrentCampaign(null);
      } else {
        toast.error(data.message || "Failed to update campaign");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    }
  };

  const deleteCampaign = async () => {
    if (!currentCampaign) return;

    try {
      const response = await fetch(
        `${API_URL}/api/v1/campaign/campaigns/${currentCampaign._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Campaign deleted successfully");
        fetchCampaigns();
        setOpenDeleteDialog(false);
        setCurrentCampaign(null);
      } else {
        toast.error(data.message || "Failed to delete campaign");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    }
  };

  const toggleCampaignStatus = async (campaign: Campaign) => {
    try {
      const newStatus = campaign.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const response = await fetch(
        `${API_URL}/api/v1/campaign/campaigns/${campaign._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success(
          `Campaign ${
            newStatus === "ACTIVE" ? "activated" : "deactivated"
          } successfully`
        );
        fetchCampaigns();
      } else {
        toast.error(data.message || "Failed to update campaign status");
      }
    } catch (error) {
      toast.error("Failed to connect to the server");
    }
  };

  // Campaign cards

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="relative z-10 px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Campaign Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your outreach campaigns
            </p>
          </div>
          <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border border-border/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">
                  Create New Campaign
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Fill in the details to create a new outreach campaign.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Campaign name"
                    className="bg-background/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Campaign description"
                    className="bg-background/50 border-border/50 text-foreground"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leads" className="text-foreground">
                    LinkedIn Leads (one per line)
                  </Label>
                  <Textarea
                    id="leads"
                    name="leads"
                    value={formData.leads}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/profile-1,https://linkedin.com/in/profile-2"
                    className="bg-background/50 border-border/50 text-foreground"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accountIDs" className="text-foreground">
                    Account IDs (comma separated)
                  </Label>
                  <Input
                    id="accountIDs"
                    name="accountIDs"
                    value={formData.accountIDs}
                    onChange={handleInputChange}
                    placeholder="123, 456"
                    className="bg-background/50 border-border/50 text-foreground"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpenCreateDialog(false)}
                  className="border-border/50 text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createCampaign}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Create Campaign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-background/50 border border-border/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary/10"
            >
              All Campaigns
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-primary/10"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="data-[state=active]:bg-primary/10"
            >
              Inactive
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/80 backdrop-blur-sm border border-border/50"
                  >
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="h-4 w-full mt-2 bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2 bg-muted" />
                        <Skeleton className="h-4 w-1/3 bg-muted" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-full bg-muted" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-foreground">
                  No campaigns found
                </h3>
                <p className="text-muted-foreground mt-2">
                  Create your first campaign to get started
                </p>
                <Button
                  onClick={() => setOpenCreateDialog(true)}
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>
            ) : (
              <CampaignCards
                campaigns={campaigns}
                setEditFormData={setEditFormData}
                setCurrentCampaign={setCurrentCampaign}
                setOpenDeleteDialog={setOpenDeleteDialog}
                toggleCampaignStatus={toggleCampaignStatus}
              />
            )}
          </TabsContent>
          <TabsContent value="active" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/80 backdrop-blur-sm border border-border/50"
                  >
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="h-4 w-full mt-2 bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2 bg-muted" />
                        <Skeleton className="h-4 w-1/3 bg-muted" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-full bg-muted" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <CampaignCards
                campaigns={campaigns.filter((c) => c.status === "ACTIVE")}
                setEditFormData={setEditFormData}
                setCurrentCampaign={setCurrentCampaign}
                setOpenDeleteDialog={setOpenDeleteDialog}
                toggleCampaignStatus={toggleCampaignStatus}
              />
            )}
          </TabsContent>
          <TabsContent value="inactive" className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card
                    key={i}
                    className="bg-card/80 backdrop-blur-sm border border-border/50"
                  >
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="h-4 w-full mt-2 bg-muted" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2 bg-muted" />
                        <Skeleton className="h-4 w-1/3 bg-muted" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-8 w-full bg-muted" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <CampaignCards
                campaigns={campaigns.filter((c) => c.status === "INACTIVE")}
                setEditFormData={setEditFormData}
                setCurrentCampaign={setCurrentCampaign}
                setOpenDeleteDialog={setOpenDeleteDialog}
                toggleCampaignStatus={toggleCampaignStatus}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Campaign Dialog */}
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-md border border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Edit Campaign
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Update the details of your campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Campaign name"
                  className="bg-background/50 border-border/50 text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Campaign description"
                  className="bg-background/50 border-border/50 text-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status" className="text-foreground">
                  Status
                </Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="status-active"
                      name="status"
                      value="ACTIVE"
                      checked={formData.status === "ACTIVE"}
                      onChange={() =>
                        setFormData((prev) => ({ ...prev, status: "ACTIVE" }))
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <Label htmlFor="status-active" className="text-foreground">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="status-inactive"
                      name="status"
                      value="INACTIVE"
                      checked={formData.status === "INACTIVE"}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: "INACTIVE",
                        }))
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="status-inactive"
                      className="text-foreground"
                    >
                      Inactive
                    </Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-leads" className="text-foreground">
                  LinkedIn Leads (one per line)
                </Label>
                <Textarea
                  id="edit-leads"
                  name="leads"
                  value={formData.leads}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/profile-1
  https://linkedin.com/in/profile-2"
                  className="bg-background/50 border-border/50 text-foreground"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-accountIDs" className="text-foreground">
                  Account IDs (comma separated)
                </Label>
                <Input
                  id="edit-accountIDs"
                  name="accountIDs"
                  value={formData.accountIDs}
                  onChange={handleInputChange}
                  placeholder="123, 456"
                  className="bg-background/50 border-border/50 text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenEditDialog(false)}
                className="border-border/50 text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={updateCampaign}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Update Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Campaign Dialog */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-md border border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Delete Campaign
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Are you sure you want to delete this campaign? This action will
                soft delete the campaign.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-foreground">
                Campaign:{" "}
                <span className="font-medium">{currentCampaign?.name}</span>
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenDeleteDialog(false)}
                className="border-border/50 text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={deleteCampaign}
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Delete Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
