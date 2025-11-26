import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  title: string;
  description: string;
  date: string;
  location: string;
  locationType: string;
  category: string;
  capacity: number;
}

interface EventFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  buttonText: string;
}

const categories = ["Music", "Tech", "Business", "Sports", "Art", "Education"];

const EventForm = ({ initialData, onSubmit, buttonText }: EventFormProps) => {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      title: "",
      description: "",
      date: "",
      location: "",
      locationType: "In-Person",
      category: "Tech",
      capacity: 100,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>Title</label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Date</label>
        <Input
          type='date'
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Location</label>
        <Input
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Location Type</label>
        <Select
          value={formData.locationType}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, locationType: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Online'>Online</SelectItem>
            <SelectItem value='In-Person'>In-Person</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Category</label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Capacity</label>
        <Input
          type='number'
          min='1'
          value={formData.capacity}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              capacity: Number(e.target.value),
            }))
          }
          required
        />
      </div>

      <Button type='submit' className='w-full'>
        {buttonText}
      </Button>
    </form>
  );
};

export default EventForm;
