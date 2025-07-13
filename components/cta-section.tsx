"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FaWhatsapp } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

export default function CTASection() {
  const [activeTab, setActiveTab] = useState<"contact" | "hire" | "collaborate">("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    project: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Sending message...");

    try {
      const response = await fetch("https://formspree.io/f/mvgreeod", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(e.currentTarget),
      });

      if (response.ok) {
        toast.success("✅ Message sent successfully!", { id: toastId });
        setFormData({ name: "", email: "", company: "", project: "", message: "" });
      } else {
        toast.error("❌ Failed to send message.", { id: toastId });
      }
    } catch (error) {
      toast.error("❌ Something went wrong.", { id: toastId });
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-accent/10">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have a project idea, collaboration opportunity, or just want to chat about AI and emerging technologies?
              I'm always open to connecting with fellow researchers, developers, and creators.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-5/12">
              <Card className="h-full bg-card/70 backdrop-blur">
                <CardHeader>
                  <CardTitle>Connect with Me</CardTitle>
                  <CardDescription>Choose how you'd like to reach out</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Contact Options */}
                  <a
                    href="mailto:pratikkale7661@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">babar.ali63101@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.link/2xw5zy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <FaWhatsapp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Whatsapp</h3>
                      <p className="text-sm text-muted-foreground">@Babar Ali</p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/BraWler66"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">GitHub</h3>
                      <p className="text-sm text-muted-foreground">github.com/BraWler66</p>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/babar1438"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">LinkedIn</h3>
                      <p className="text-sm text-muted-foreground">linkedin.com/in/babar1438</p>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="md:w-7/12">
              <Card className="bg-card/70 backdrop-blur">
                <CardHeader>
                  <div className="flex border border-border rounded-lg p-1 mb-4">
                    {["contact", "hire", "collaborate"].map((tab) => (
                      <button
                        key={tab}
                        className={cn(
                          "flex-1 text-center py-2 rounded-md transition-colors capitalize",
                          activeTab === tab ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                        )}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <CardTitle>
                    {activeTab === "contact" && "Send a Message"}
                    {activeTab === "hire" && "Work with Me"}
                    {activeTab === "collaborate" && "Let's Build Together"}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "contact" && "I'll get back to you as soon as possible"}
                    {activeTab === "hire" && "Tell me about your project or position"}
                    {activeTab === "collaborate" && "Share your idea and how we can collaborate"}
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input id="name" name="name" placeholder="Your name" required value={formData.name} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input id="email" name="email" type="email" placeholder="Your email" required value={formData.email} onChange={handleChange} />
                      </div>
                    </div>

                    {activeTab === "hire" && (
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium">Company / Organization</label>
                        <Input id="company" name="company" placeholder="Company or organization name" value={formData.company} onChange={handleChange} />
                      </div>
                    )}

                    {activeTab === "collaborate" && (
                      <div className="space-y-2">
                        <label htmlFor="project" className="text-sm font-medium">Project Name</label>
                        <Input id="project" name="project" placeholder="Name of your project" value={formData.project} onChange={handleChange} />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">Message</label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder={
                          activeTab === "contact"
                            ? "Your message..."
                            : activeTab === "hire"
                            ? "Tell me about your project or position..."
                            : "Share your collaboration idea..."
                        }
                        className="min-h-[120px]"
                        required
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button type="submit" className="w-full group">
                      {activeTab === "contact" && (
                        <>
                          Send Message
                          <MessageSquare className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                        </>
                      )}
                      {activeTab === "hire" && (
                        <>
                          Submit Inquiry
                          <Send className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                        </>
                      )}
                      {activeTab === "collaborate" && (
                        <>
                          Let&apos;s Collaborate
                          <Send className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
