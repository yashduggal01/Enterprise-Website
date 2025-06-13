
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ContactMessage {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: string | null;
  created_at: string;
  processed_at: string | null;
}

export const ContactMessagesViewer = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
    setupRealtimeSubscription();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('contact-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_messages'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchMessages(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>;
      case 'processed':
        return <Badge variant="default">Processed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">Real-time view of contact form submissions</p>
      </div>

      <div className="grid gap-6">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No contact messages yet.</p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {message.first_name} {message.last_name}
                  </CardTitle>
                  {getStatusBadge(message.status)}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>📧 {message.email}</span>
                  {message.phone && <span>📱 {message.phone}</span>}
                  {message.company && <span>🏢 {message.company}</span>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Message:</h4>
                    <p className="text-muted-foreground">{message.message}</p>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Submitted: {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                    {message.processed_at && (
                      <span>
                        Processed: {formatDistanceToNow(new Date(message.processed_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
