"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

interface Role {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements: string[];
  whatYoullDo: string[];
  weOffer: string[];
}

const roles: Role[] = [
  {
    id: "ai-engineer",
    title: "AI Engineer",
    type: "Full-time",
    location: "Remote",
    description: "We're looking for an AI wizard who can make machines think, learn, and create. Not someone who follows tutorials, but someone who writes them. You'll be building the core AI systems that power Nextly's code generation capabilities.",
    requirements: [
      "Under 25 years old (we want fresh, unbiased thinking)",
      "No degree required - show us what you've built instead",
      "Deep understanding of transformer architectures and LLMs",
      "Experience with PyTorch, TensorFlow, or JAX",
      "Can explain complex AI concepts in simple terms",
      "Obsessed with AI capabilities and limitations",
      "Built something impressive that people actually use"
    ],
    whatYoullDo: [
      "Design and implement AI models for code generation",
      "Optimize inference performance and reduce latency",
      "Research and implement cutting-edge AI techniques",
      "Build evaluation frameworks for AI output quality",
      "Collaborate on prompt engineering and fine-tuning strategies",
      "Push the boundaries of what's possible with AI"
    ],
    weOffer: [
      "Competitive salary that values talent over credentials",
      "Equity in a fast-growing AI company",
      "Work directly with the founder on core technology",
      "Complete creative freedom and technical autonomy",
      "Remote-first culture with flexible hours",
      "Budget for courses, conferences, and learning"
    ]
  },
  {
    id: "growth-intern",
    title: "Growth Intern",
    type: "Internship",
    location: "Remote",
    description: "We need a growth hacker who understands the internet better than most adults. Someone who can make things go viral, build communities, and turn curiosity into customers. Age and experience don't matter - results do.",
    requirements: [
      "Under 25 years old (digital natives preferred)",
      "No degree needed - show us your growth experiments",
      "Deep understanding of social media and internet culture",
      "Data-driven mindset with analytical thinking",
      "Experience with growth tools and analytics",
      "Creative problem solver who thinks outside the box",
      "Already built an audience or grown something from zero"
    ],
    whatYoullDo: [
      "Design and execute viral marketing campaigns",
      "Build and nurture developer communities",
      "Create content that developers actually want to share",
      "Run growth experiments and optimize conversion funnels",
      "Partner with influencers and thought leaders",
      "Track metrics and iterate based on data"
    ],
    weOffer: [
      "Paid internship with performance bonuses",
      "Learn directly from a founder who built from zero",
      "Complete ownership of growth initiatives",
      "Flexible schedule that works around your life",
      "Potential for full-time role based on performance",
      "Real impact on a growing startup"
    ]
  }
];

export default function HiringPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const openModal = (role: Role) => {
    setSelectedRole(role);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedRole(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => router.back()}
            className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            ← Back to Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-semibold text-foreground mb-6 leading-tight">
            Join the Rebellion
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            We're not hiring based on where you went to school or how old you are. We care about what you've built, 
            how you think, and whether you can create something extraordinary from nothing.
          </p>
          <div className="inline-block p-6 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-lg text-foreground font-medium mb-2">
              Looking for top 1% talent under 25
            </p>
            <p className="text-muted-foreground">
              College dropouts encouraged to apply • No degrees required • Skills over credentials
            </p>
          </div>
        </div>

        {/* Roles Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">
            Open Positions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => openModal(role)}
                className="group cursor-pointer bg-background border border-border rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {role.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {role.type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {role.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {role.description}
                </p>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    Click to view details and requirements
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Ready to Apply?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Skip the boring application forms. Send us your resume, portfolio, and tell us why you're 
              the genius we're looking for. Show us what you've built, not where you studied.
            </p>
            <a
              href="mailto:vedant@nextly.live?subject=Application for [Role Name]"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              Send Your Application
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {selectedRole.title}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    {selectedRole.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {selectedRole.location}
                  </span>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              <div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {selectedRole.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    What We're Looking For
                  </h4>
                  <ul className="space-y-3">
                    {selectedRole.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary mt-1.5 font-semibold">•</span>
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    What You'll Do
                  </h4>
                  <ul className="space-y-3">
                    {selectedRole.whatYoullDo.map((task, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-primary mt-1.5 font-semibold">•</span>
                        <span className="text-muted-foreground">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4">
                  What We Offer
                </h4>
                <ul className="grid md:grid-cols-2 gap-3">
                  {selectedRole.weOffer.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary mt-1.5 font-semibold">•</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/10 border border-primary/20 p-6 rounded-xl text-center">
                <h5 className="text-lg font-semibold text-foreground mb-3">
                  Interested in this role?
                </h5>
                <p className="text-muted-foreground mb-4">
                  Send your resume and portfolio to get started
                </p>
                <a
                  href={`mailto:vedant@nextly.live?subject=Application for ${selectedRole.title}&body=Hi Vedant,%0D%0A%0D%0AI'm interested in the ${selectedRole.title} position at Nextly.%0D%0A%0D%0A[Tell us about yourself and why you're perfect for this role]%0D%0A%0D%0ABest regards`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
                >
                  Apply Now
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
