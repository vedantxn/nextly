"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function PrivacyPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sections = [
    { id: "overview", title: "Privacy Overview" },
    { id: "information-collection", title: "Information We Collect" },
    { id: "data-usage", title: "How We Use Your Data" },
    { id: "data-sharing", title: "Data Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "user-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies and Tracking" },
    { id: "contact", title: "Contact Information" }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              ← Back
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
            </button>
            
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">Privacy Policy</h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/terms")}
              className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              Terms of Service →
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
        </div>

        <div className="flex gap-12">
          {/* Table of Contents */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8 bg-background border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`group relative block text-sm py-2 px-3 transition-colors duration-200 hover:text-primary ${
                      activeSection === section.id ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-mono text-muted-foreground mr-2">
                      {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    {section.title}
                    <span className="absolute bottom-0 left-3 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300 ease-out"></span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-background border border-border rounded-xl shadow-sm p-12">
              
              {/* Introduction */}
              <div className="mb-12 p-6 bg-muted/30 border-l-4 border-primary">
                <h2 className="text-lg font-semibold text-foreground mb-3">Your Privacy Matters</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This Privacy Policy explains how Nextly collects, uses, and protects your personal information 
                  when you use our AI-powered Next.js application generation platform.
                </p>
              </div>

              {/* Section 1 */}
              <section id="overview" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  1. Privacy Overview
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    At Nextly, we believe privacy is a fundamental right. This policy describes how we collect, 
                    use, store, and protect your personal information when you use our service.
                  </p>
                  <p>
                    This policy applies to all users of the Nextly platform. By using our service, you consent 
                    to the data practices described in this policy.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="information-collection" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  2. Information We Collect
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We collect several types of information to provide and improve our services:</p>
                  
                  <div className="border-l-4 border-blue-500 pl-4 py-3">
                    <h4 className="font-semibold text-foreground mb-2">Account Information:</h4>
                    <ul className="list-none space-y-1">
                      <li className="border-l-2 border-muted pl-3">Email address and authentication credentials</li>
                      <li className="border-l-2 border-muted pl-3">Name and profile information</li>
                      <li className="border-l-2 border-muted pl-3">Subscription and billing information</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-3">
                    <h4 className="font-semibold text-foreground mb-2">Usage Data:</h4>
                    <ul className="list-none space-y-1">
                      <li className="border-l-2 border-muted pl-3">Project data and generated code</li>
                      <li className="border-l-2 border-muted pl-3">AI prompts and interactions</li>
                      <li className="border-l-2 border-muted pl-3">Platform usage patterns</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="data-usage" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  3. How We Use Your Data
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We use your information for the following purposes:</p>
                  <ul className="list-none space-y-3 ml-2">
                    <li className="border-l-2 border-muted pl-3">
                      <span className="font-semibold text-foreground">Service Provision:</span> To provide and operate the Nextly platform
                    </li>
                    <li className="border-l-2 border-muted pl-3">
                      <span className="font-semibold text-foreground">AI Improvement:</span> To improve our AI models and code generation
                    </li>
                    <li className="border-l-2 border-muted pl-3">
                      <span className="font-semibold text-foreground">Communication:</span> To send updates and respond to support requests
                    </li>
                    <li className="border-l-2 border-muted pl-3">
                      <span className="font-semibold text-foreground">Security:</span> To detect fraud and maintain platform security
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="data-sharing" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  4. Data Sharing
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We do not sell your personal information. We only share data in limited circumstances:</p>
                  <div className="border-l-4 border-red-500 pl-4 py-3">
                    <ul className="list-none space-y-2">
                      <li className="border-l-2 border-muted pl-3">With trusted service providers who help operate our platform</li>
                      <li className="border-l-2 border-muted pl-3">When required by law or court order</li>
                      <li className="border-l-2 border-muted pl-3">With your explicit consent</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="data-security" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  5. Data Security
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We implement comprehensive security measures to protect your information:</p>
                  <div className="border-l-4 border-green-500 pl-4 py-3">
                    <ul className="list-none space-y-1">
                      <li className="border-l-2 border-muted pl-3">End-to-end encryption for data transmission</li>
                      <li className="border-l-2 border-muted pl-3">AES-256 encryption for stored data</li>
                      <li className="border-l-2 border-muted pl-3">Regular security audits and monitoring</li>
                      <li className="border-l-2 border-muted pl-3">Multi-factor authentication options</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="user-rights" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  6. Your Rights
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>You have important rights regarding your personal information:</p>
                  <div className="border-l-4 border-blue-500 pl-4 py-3">
                    <ul className="list-none space-y-2">
                      <li className="border-l-2 border-muted pl-3">
                        <span className="font-semibold text-foreground">Access:</span> Request a copy of your personal information
                      </li>
                      <li className="border-l-2 border-muted pl-3">
                        <span className="font-semibold text-foreground">Correction:</span> Request correction of inaccurate information
                      </li>
                      <li className="border-l-2 border-muted pl-3">
                        <span className="font-semibold text-foreground">Deletion:</span> Request deletion of your personal information
                      </li>
                      <li className="border-l-2 border-muted pl-3">
                        <span className="font-semibold text-foreground">Portability:</span> Request your data in a machine-readable format
                      </li>
                    </ul>
                  </div>
                  <p>To exercise these rights, contact us at privacy@nextly.live</p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="cookies" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  7. Cookies and Tracking
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-none space-y-2 ml-2">
                    <li className="border-l-2 border-muted pl-3">Remember your preferences and settings</li>
                    <li className="border-l-2 border-muted pl-3">Analyze platform usage and performance</li>
                    <li className="border-l-2 border-muted pl-3">Provide security features</li>
                  </ul>
                  <p>You can control cookies through your browser settings.</p>
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b-2 border-border">
                  8. Contact Information
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>For privacy-related questions, contact us:</p>
                  <div className="border-l-4 border-primary pl-4 py-3">
                    <div className="space-y-2">
                      <div className="border-l-2 border-muted pl-3">
                        <span className="font-semibold">Email:</span> privacy@nextly.live
                      </div>
                      <div className="border-l-2 border-muted pl-3">
                        <span className="font-semibold">Data Protection Officer:</span> vedant@nextly.live
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-16 pt-6 border-t-2 border-border text-center">
                <div className="text-muted-foreground mb-3">
                  Last updated: January 27, 2025
                </div>
                <p className="text-muted-foreground text-sm">
                  This Privacy Policy is effective as of the date listed above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
