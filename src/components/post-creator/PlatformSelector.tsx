
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
}

export function PlatformSelector({ 
  selectedPlatforms, 
  setSelectedPlatforms 
}: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="platforms">Platforms</Label>
      <Select onValueChange={(value) => setSelectedPlatforms([value])}>
        <SelectTrigger>
          <SelectValue placeholder="Select platforms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="twitter">Twitter</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
          <SelectItem value="tiktok">TikTok</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
