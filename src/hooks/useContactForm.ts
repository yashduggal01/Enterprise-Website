
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import emailjs from '@emailjs/browser';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export const useContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Sending email notification to admin:", formData);

      // EmailJS configuration with your actual credentials
      const serviceId = 'service_a5p2ddc';
      const templateId = 'template_hfefrvc';
      const publicKey = 'QCSVbUHjjUCb0famf';

      // Template parameters for the email you'll receive
      const templateParams = {
        to_name: 'Admin',
        to_email: 'yash01duggal@gmail.com',
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        message: formData.message,
        reply_to: formData.email
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log("Email sent successfully:", response);

      if (response.status === 200) {
        toast({
          title: "Message Sent Successfully! 🎉",
          description: "Thank you for reaching out. We'll get back to you within 24 hours.",
        });
        resetForm();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast({
        title: "Failed to Send Message",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    submitForm
  };
};
