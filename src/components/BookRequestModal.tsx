import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: {
    id: string;
    title: string;
    author: string;
  } | null;
}

const BookRequestModal = ({ open, onOpenChange, book }: BookRequestModalProps) => {
  const [formData, setFormData] = useState({
    studentName: "",
    mobileNo: "",
    email: "",
    academicYear: "",
    rollNo: "",
  });
  const [preferredDueDate, setPreferredDueDate] = useState<Date>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book || !preferredDueDate) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('book_requests')
        .insert({
          book_id: book.id,
          user_name: formData.studentName,
          user_email: formData.email,
          notes: `Mobile: ${formData.mobileNo}, Academic Year: ${formData.academicYear}, Roll No: ${formData.rollNo}, Preferred Due Date: ${preferredDueDate.toISOString().split('T')[0]}`,
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: `Your request for "${book.title}" has been submitted successfully.`,
      });

      // Reset form
      setFormData({
        studentName: "",
        mobileNo: "",
        email: "",
        academicYear: "",
        rollNo: "",
      });
      setPreferredDueDate(undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Book</DialogTitle>
          {book && (
            <p className="text-sm text-muted-foreground">
              Requesting: <span className="font-medium">{book.title}</span> by {book.author}
            </p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mobileNo">Mobile Number</Label>
            <Input
              id="mobileNo"
              type="tel"
              value={formData.mobileNo}
              onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              placeholder="e.g., 2nd Year, 3rd Year"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <Input
              id="rollNo"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Preferred Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !preferredDueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {preferredDueDate ? format(preferredDueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={preferredDueDate}
                  onSelect={setPreferredDueDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !preferredDueDate} className="flex-1">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookRequestModal;