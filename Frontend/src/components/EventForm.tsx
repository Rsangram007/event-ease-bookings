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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  title: string;
  description: string;
  date: string;
  location: string;
  locationType: string;
  category: string;
  capacity: number;
  imageUrl?: string;
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
      imageUrl: "",
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new object without the imageUrl field if it's empty
    const { imageUrl, ...formDataWithoutImageUrl } = formData;
    const dataToSend = imageUrl ? formData : formDataWithoutImageUrl;

    onSubmit(dataToSend as FormData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Date *</label>
                <Input
                  type='date'
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Image</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Upload Image
                </label>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      // We don't set the image URL in formData here since it will be uploaded separately
                    }
                  }}
                />
                <p className='text-xs text-muted-foreground mt-1'>
                  Supported formats: JPG, PNG, GIF (Max size: 5MB)
                </p>
              </div>

              {initialData?.imageUrl && (
                <div className='mt-4'>
                  <label className='block text-sm font-medium mb-2'>
                    Current Image
                  </label>
                  <div className='border rounded-lg p-2'>
                    <img
                      src={initialData.imageUrl}
                      alt='Current event'
                      className='w-full h-48 object-contain rounded-md'
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Location & Category</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Location *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Location Type *
                </label>
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
                <label className='block text-sm font-medium mb-2'>
                  Category *
                </label>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  Maximum Capacity *
                </label>
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
                <p className='text-xs text-muted-foreground mt-1'>
                  Enter the maximum number of attendees allowed for this event
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='flex justify-end pt-4'>
        <Button type='submit' className='w-full sm:w-auto'>
          {buttonText}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
