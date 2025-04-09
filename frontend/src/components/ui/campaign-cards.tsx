import { Edit, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Campaign } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./badge";

const CampaignCards = ({
  campaigns,
  setEditFormData,
  setCurrentCampaign,
  setOpenDeleteDialog,
  toggleCampaignStatus,
}: {
  campaigns: Campaign[];
  setEditFormData: (campaign: Campaign) => void;
  setCurrentCampaign: (campaign: Campaign) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  toggleCampaignStatus: (campaign: Campaign) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <Card
          key={campaign._id}
          className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-border/80 transition-all duration-300"
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-card-foreground">
                  {campaign.name}
                </CardTitle>
                <CardDescription className="mt-2 text-muted-foreground">
                  {campaign.description}
                </CardDescription>
              </div>
              <Badge
                variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
              >
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Leads
                </p>
                <p className="text-sm text-card-foreground">
                  {campaign.leads.length} LinkedIn profiles
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEditFormData(campaign)}
                className="border-border/50 hover:border-border/80 bg-transparent"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentCampaign(campaign);
                  setOpenDeleteDialog(true);
                }}
                className="border-border/50 hover:border-border/80 bg-transparent text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCampaignStatus(campaign)}
              className="flex items-center space-x-1"
            >
              {campaign.status === "ACTIVE" ? (
                <>
                  <ToggleRight className="h-4 w-4 text-primary" />
                  <span className="text-xs">Active</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Inactive</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CampaignCards;
